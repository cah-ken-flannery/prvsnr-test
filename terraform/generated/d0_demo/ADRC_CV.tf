resource "google_bigquery_table" "dataset_source-identical-view_public_ADRC_CV" {
  dataset_id    = module.dataset_source-identical-view_public.bigquery_dataset.dataset_id
  friendly_name = "ADRC_CV"
  table_id      = "ADRC_CV"
  project       = module.dataset_source-identical-view_public.bigquery_dataset.project

  labels = {}

  view {
    query          = "SELECT CLIENT, SHA256(ADDRNUMBER) as ADDRNUMBER, DATE_FROM, SHA256(NATION) as NATION, DATE_TO, TITLE, NAME1, NAME2, NAME3, NAME4, NAME_TEXT, D0_UPDATE_STP FROM D0_MED_DEMO_SE2.ADRC_CV"
    use_legacy_sql = false
  }
}

resource "google_bigquery_table" "dataset_source-identical-view_foo_ADRC_CV" {
  dataset_id    = module.dataset_source-identical-view_foo.bigquery_dataset.dataset_id
  friendly_name = "ADRC_CV"
  table_id      = "ADRC_CV"
  project       = module.dataset_source-identical-view_foo.bigquery_dataset.project

  labels = {}

  view {
    query          = "SELECT CLIENT, ADDRNUMBER, DATE_FROM, SHA256(NATION) as NATION, DATE_TO, TITLE, NAME1, NAME2, NAME3, NAME4, NAME_TEXT, D0_UPDATE_STP FROM D0_MED_DEMO_SE2.ADRC_CV"
    use_legacy_sql = false
  }
}

resource "google_bigquery_table" "dataset_source-identical-view_zoo_ADRC_CV" {
  dataset_id    = module.dataset_source-identical-view_zoo.bigquery_dataset.dataset_id
  friendly_name = "ADRC_CV"
  table_id      = "ADRC_CV"
  project       = module.dataset_source-identical-view_zoo.bigquery_dataset.project

  labels = {}

  view {
    query          = "SELECT CLIENT, SHA256(ADDRNUMBER) as ADDRNUMBER, DATE_FROM, SHA256(NATION) as NATION, DATE_TO, TITLE, NAME1, NAME2, NAME3, NAME4, NAME_TEXT, D0_UPDATE_STP FROM D0_MED_DEMO_SE2.ADRC_CV"
    use_legacy_sql = false
  }
}

resource "google_bigquery_table" "dataset_source-identical-view_bar_ADRC_CV" {
  dataset_id    = module.dataset_source-identical-view_bar.bigquery_dataset.dataset_id
  friendly_name = "ADRC_CV"
  table_id      = "ADRC_CV"
  project       = module.dataset_source-identical-view_bar.bigquery_dataset.project

  labels = {}

  view {
    query          = "SELECT CLIENT, SHA256(ADDRNUMBER) as ADDRNUMBER, DATE_FROM, NATION, DATE_TO, TITLE, NAME1, NAME2, NAME3, NAME4, NAME_TEXT, D0_UPDATE_STP FROM D0_MED_DEMO_SE2.ADRC_CV"
    use_legacy_sql = false
  }
}