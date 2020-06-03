import { DataCollection, isDataCollection, Table, isTable } from './gen/dev.cft.v1alpha1';
import { Configs, getAnnotation, KubernetesObject } from 'kpt-functions';
import { dirname } from 'path';
import _ from 'lodash';
import buildConfigFromEnv, { GeneratorConfig, DATASET_SUFFIXES, datasetTypes } from './config';
import { ManagedFieldsEntry } from 'kpt-functions/dist/src/gen/io.k8s.apimachinery.pkg.apis.meta.v1';

const PATH_ANNOTATION = 'config.kubernetes.io/path';

const datasetNamers = {
  [datasetTypes.SOURCE_IDENTICAL_VIEW]: (d: Dataset) => {
    const collection = d.manager;
    return [
      "D0",
      collection.o.spec.dataset.businessSegment,
      collection.o.spec.dataset.applicationName,
      collection.o.spec.dataset.instanceName,
      collection.o.spec.dataset.sourceSchema,
      d.parent?.suffix,
      "VW",
      (d.suffix == "public" ? null : d.suffix)
    ];
  },
  [datasetTypes.SOURCE_IDENTICAL]: (d: Dataset) => {
    const collection = d.manager;
    return [
      "D0",
      collection.o.spec.dataset.businessSegment,
      collection.o.spec.dataset.applicationName,
      collection.o.spec.dataset.instanceName,
      collection.o.spec.dataset.sourceSchema,
      d.suffix
    ];
  }
};

function getKey(o: KubernetesObject) {
  const path = getAnnotation(o, PATH_ANNOTATION) || '';
  return dirname(path);
}

export class Dataset {
  manager: DataCollectionManager;
  type: datasetTypes;
  suffix: string;
  parent?: Dataset;
  children: Dataset[];
  views: DataView[];

  constructor(type: datasetTypes, manager: DataCollectionManager, parent?: Dataset, suffix?: string) {
    this.manager = manager;
    this.type = type;
    this.views = [];
    this.children = [];
    this.suffix = suffix || DATASET_SUFFIXES.STORAGE;
    // this.suffix = suffix || (this.manager.o.spec.dataset.suffix ? String(this.manager.o.spec.dataset.suffix) : undefined);

    if (parent) {
      parent.addChild(this);
    }
  }

  getIndex() {
    const parts = ["dataset", _.kebabCase(this.type), _.kebabCase(this.suffix)];
    return _.join(_.compact(parts), "_");
  }

  getName() {
    return _.join(_.compact(datasetNamers[this.type](this)), "_");
  }

  getPermissions() {
    // TODO: insert the standardized AD group for each dataset
    const roles = [
      {
        // This could also be a custom role
        "role": "roles/bigquery.dataViewer",
        "member": "group:pso-cardinal-health@google.com"
      }
    ];

    if (this.type === datasetTypes.SOURCE_IDENTICAL) {
      roles.push({
        "role": "roles/bigquery.dataEditor",
        "member": `serviceAccount:${this.manager.manager.config.writer_service_account}`
      });
    }

    return roles;
  }

  getLabels() {
    return {
      "datasetname": this.getName(),
      "environment": this.manager.manager.config.environment,
      "data-requestor": this.manager.o.spec.dataRequestor,
      "data-owner": this.manager.o.spec.dataOwner
    };
  }

  addView(dv: DataView) {
    this.views.push(dv);
    dv.dataset = this;
  }

  addChild(child: Dataset) {
    this.children.push(child);
    child.parent = this;
  }
}

export class DataView {
  table: Table;
  suffix: string;
  exposedFields: string[];
  dataset?: Dataset;
  constructor(table: Table, suffix: string, exposedFields = <string[]>[]) {
    this.table = table;
    this.suffix = suffix;
    this.exposedFields = exposedFields;
  }

  getQuery() {
    const source = `${this.dataset?.parent?.getName()}.${this.table.spec.name}`;

    const fields =  _.map(this.table.spec.fields, (field) => {
      // directly expose non-regulatory fields
      if (!field.regulatory || field.regulatory == "none") {
        return field.name;
      }

      // expose fields which we want exposed for this view
      if (this.exposedFields.includes(field.name)) {
        return field.name;
      }

      // Implement various privacy methods
      const anonymizer = String(field.anonymizer || "");

      // expose the substring field value
      const regex = /SUBSTR\((\d+),( )?(\d+)+\)/;
      const found = anonymizer.match(regex);
      if (found) {
        return `SUBSTR(\`${field.name}\`, ${found[1]}, ${found[3]})  as ${field.name}`;
      }

      // Hide the column entirely
      if (anonymizer === "HIDE") {
        return null;
      }

      // Fall back to hashing
      return `SHA256(${field.name}) as ${field.name}`;
    });

    return `SELECT ${_.join(_.compact(fields), ", ")} FROM ${source}`;
  }

  getIndex() {
    const parts = [this.dataset?.getIndex(), this.table.spec.name];
    return _.join(_.compact(parts), "_");
  }

  exposeField(name: string) {
    this.exposedFields.push(name);
  }
}

export class DataCollectionManager {
  o: DataCollection;
  tables: Table[];
  storage: Dataset;
  manager: DataManager;

  constructor(collection: DataCollection, manager: DataManager) {
    this.o = collection;
    this.tables = [];
    this.storage = new Dataset(datasetTypes.SOURCE_IDENTICAL, this);
    this.manager = manager;
  }

  getViewsByTable() {
    const datasets = this.getDatasets();
    const views = _.flatten(_.map(datasets, (d) => d.views));
    const tableViews = _.groupBy(views, (view) => view.table.spec.name);
    return tableViews;
  }

  getViewsForTable(name: string) {
    const views = this.getViewsByTable();
    return views[name];
  }

  getDatasets(): Dataset[] {
    const datasets = <{[key:string]: Dataset}>{};

    const storage = this.storage;
    datasets[storage.suffix] = storage;

    // Generate all the views for each table
    const tableViews = _.map(this.tables, (table) => {
      return this.generateViewsForTable(table);
    });

    // Create all the datasets
    const suffixes = _.uniq(_.flatten(_.map(tableViews, (tv) => _.keys(tv))));
    _.each(suffixes, (suffix) => {
      const dataset = new Dataset(datasetTypes.SOURCE_IDENTICAL_VIEW, this, storage, suffix);
      datasets[suffix] = dataset;
    });

    // Attach the views to the datasets
    _.each(suffixes, (suffix) => {
      const dataset = datasets[suffix];
      _.each(tableViews, (tv) => {
        if (dataset.suffix in tv) {
          dataset.addView(tv[dataset.suffix]);
        }
      });
    });

    return _.values(datasets);
  }

  getDir() {
    return getKey(this.o);
  }

  private generateViewsForTable(table: Table) {
    const views = <{[key:string]: DataView}>{};
    const fields = table.spec.fields;

    // If you want to include a raw view, this could be re-activated
    if (false) {
      // add the source-identical view (fully exposed)
      views["raw"] = new DataView(table, "raw", _.map(fields, (field) => field.name));
    }

    // add the fully anonymized view
    views["public"] = new DataView(table, "public");

    // add views for each declared suffix
    _.each(fields, (field) => {
      _.each(field.dateset_suffixes, (suffix) => {
        if (!(suffix in views)) {
          views[suffix] = new DataView(table, suffix);
        }
        views[suffix].exposeField(field.name);
      });
    });

    return views;
  }

  addTable(table: Table) {
    this.tables.push(table);
  }
}

class OrphanedTableError extends Error {};

export class DataManager {
  collections: {[key:string]: DataCollectionManager};
  config: GeneratorConfig;

  constructor(
    configs: Configs,
  ) {
    this.collections = {};
    this.config = buildConfigFromEnv();;

    configs.get(isDataCollection).forEach(this.addDataCollection.bind(this));
    configs.get(isTable).forEach(this.addTable.bind(this));
  }

  addDataCollection(collection: DataCollection) {
    const manager = new DataCollectionManager(collection, this);
    this.collections[manager.getDir()] = manager;
  }

  addTable(table: Table): Error | null {
    let dir = getKey(table);
    while (true) {
      if (dir in this.collections) {
        const manager = this.collections[dir];
        manager.addTable(table);
        return null;
      }
      if (dirname(dir) === dir) {
        return new OrphanedTableError("No matching collection found for table.");
      }
      dir = dirname(dir)
    }
  }
}
