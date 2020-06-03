import * as _ from "lodash";

import { Table } from "../gen/dev.cft.v1alpha1";
import { DataCollectionManager, DataView } from "../datamanager";

function viewConfigGenerator(view: DataView) {
  return `resource "google_bigquery_table" "${view.getIndex()}" {
  dataset_id    = module.${view.dataset?.getIndex()}.bigquery_dataset.dataset_id
  friendly_name = "${view.table.spec.name}"
  table_id      = "${view.table.spec.name}"
  project       = module.${view.dataset?.getIndex()}.bigquery_dataset.project

  labels        = {}

  view {
    query          = "${view.getQuery()}"
    use_legacy_sql = false
  }
}`
}

export default function TableViewGenerator(table: Table, manager: DataCollectionManager) {
  const views = _.map(manager.getViewsForTable(table.spec.name), viewConfigGenerator);
  return _.join(views, "\n\n");
}
