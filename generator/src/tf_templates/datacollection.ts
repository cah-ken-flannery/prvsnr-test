import * as _ from "lodash";

import { DataCollection, Table } from "../gen/dev.cft.v1alpha1";
import { DataCollectionManager, Dataset } from "../datamanager";
import { datasetTypes, getAuthKind, Binding } from "../config";

function getName(o: DataCollection | Table) {
  return _.snakeCase(o.metadata.name);
}

// https://cloud.google.com/bigquery/docs/labels-intro#requirements
function slugify(input: string) {
  return input.toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-");
}

function DatasetGenerator(d: Dataset) {
  const name = d.getName();
  const project_id = d.type == datasetTypes.SOURCE_IDENTICAL ?
    d.manager.manager.config.storage_project_id :
    d.manager.manager.config.view_project_id;

  return `module "${d.getIndex()}" {
    source  = "terraform-google-modules/bigquery/google"
    version = "~> 4.0"

    dataset_id   = "${name}"
    dataset_name = "${name}"
    project_id   = "${project_id}"

    dataset_labels = {${_.join(_.map(d.getLabels(), (value: string, label: string) => {
      return `
      ${slugify(label)} = "${slugify(value)}"`;
    }),"")}
    }

    // Access is handled in separate resources
    access = []
  }`;
}

function AuthGenerator(d: Dataset) {
  return `module "${d.getIndex()}_auth" {
    source = "terraform-google-modules/bigquery/google//modules/authorization"
    version = "~> 4.2.1"

    dataset_id = module.${d.getIndex()}.bigquery_dataset.dataset_id
    project_id = module.${d.getIndex()}.bigquery_dataset.project

    roles = [${_.join(_.compact(_.map(d.getPermissions(), (binding: Binding) => {
      const member = binding.member.match(/(user|group|serviceAccount|specialGroup):(.+)/);
      if (!member) {
        return null;
      }
      const authKind = getAuthKind(member[1]);
      if (!authKind) return null;
      return `{
        role = "${binding.role}"
        ${authKind} = "${member[2]}"
      }`;
    })), ",")}]

    authorized_views = [${_.join(_.compact(_.flatten(_.map(d.children, (child) => {
      return _.map(child.views, (view) => {
        return `{
          project_id = module.${child.getIndex()}.bigquery_dataset.project
          dataset_id = module.${child.getIndex()}.bigquery_dataset.dataset_id
          table_id   = google_bigquery_table.${view.getIndex()}.table_id
        }`;
      })
    }))),",\n")}]
  }`
}

export default function DataCollectionGenerator(o: DataCollection, manager: DataCollectionManager) {
  const datasets = manager.getDatasets()
  const configs = _.concat(
    _.map(datasets, DatasetGenerator),
    _.map(datasets, AuthGenerator)
  );
  return _.join(configs, "\n\n");
}
