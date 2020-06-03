module "dataset_source-identical" {
  source  = "terraform-google-modules/bigquery/google"
  version = "~> 4.0"

  dataset_id   = "D0_MED_DEMO_SE2"
  dataset_name = "D0_MED_DEMO_SE2"
  project_id   = "datamarket-np-cah"

  dataset_labels = {
    datasetname    = "d0_med_demo_se2"
    environment    = "dev"
    data-requestor = "ken-flannery-cardinalhealth-com"
    data-owner     = "jeffrey-lefeld-cardinalhealth-com"
  }

  // Access is handled in separate resources
  access = []
}

module "dataset_source-identical-view_public" {
  source  = "terraform-google-modules/bigquery/google"
  version = "~> 4.0"

  dataset_id   = "D0_MED_DEMO_SE2_VW"
  dataset_name = "D0_MED_DEMO_SE2_VW"
  project_id   = "datamarket-np-cah"

  dataset_labels = {
    datasetname    = "d0_med_demo_se2_vw"
    environment    = "dev"
    data-requestor = "ken-flannery-cardinalhealth-com"
    data-owner     = "jeffrey-lefeld-cardinalhealth-com"
  }

  // Access is handled in separate resources
  access = []
}

module "dataset_source-identical-view_foo" {
  source  = "terraform-google-modules/bigquery/google"
  version = "~> 4.0"

  dataset_id   = "D0_MED_DEMO_SE2_VW_foo"
  dataset_name = "D0_MED_DEMO_SE2_VW_foo"
  project_id   = "datamarket-np-cah"

  dataset_labels = {
    datasetname    = "d0_med_demo_se2_vw_foo"
    environment    = "dev"
    data-requestor = "ken-flannery-cardinalhealth-com"
    data-owner     = "jeffrey-lefeld-cardinalhealth-com"
  }

  // Access is handled in separate resources
  access = []
}

module "dataset_source-identical-view_zoo" {
  source  = "terraform-google-modules/bigquery/google"
  version = "~> 4.0"

  dataset_id   = "D0_MED_DEMO_SE2_VW_zoo"
  dataset_name = "D0_MED_DEMO_SE2_VW_zoo"
  project_id   = "datamarket-np-cah"

  dataset_labels = {
    datasetname    = "d0_med_demo_se2_vw_zoo"
    environment    = "dev"
    data-requestor = "ken-flannery-cardinalhealth-com"
    data-owner     = "jeffrey-lefeld-cardinalhealth-com"
  }

  // Access is handled in separate resources
  access = []
}

module "dataset_source-identical-view_bar" {
  source  = "terraform-google-modules/bigquery/google"
  version = "~> 4.0"

  dataset_id   = "D0_MED_DEMO_SE2_VW_bar"
  dataset_name = "D0_MED_DEMO_SE2_VW_bar"
  project_id   = "datamarket-np-cah"

  dataset_labels = {
    datasetname    = "d0_med_demo_se2_vw_bar"
    environment    = "dev"
    data-requestor = "ken-flannery-cardinalhealth-com"
    data-owner     = "jeffrey-lefeld-cardinalhealth-com"
  }

  // Access is handled in separate resources
  access = []
}

module "dataset_source-identical_auth" {
  source  = "terraform-google-modules/bigquery/google//modules/authorization"
  version = "~> 4.2.1"

  dataset_id = module.dataset_source-identical.bigquery_dataset.dataset_id
  project_id = module.dataset_source-identical.bigquery_dataset.project

  roles = [{
    role           = "roles/bigquery.dataViewer"
    group_by_email = "pso-cardinal-health@google.com"
    }, {
    role          = "roles/bigquery.dataEditor"
    user_by_email = "sa-provisioner@datamarket-np-cah.iam.gserviceaccount.com"
  }]

  authorized_views = [{
    project_id = module.dataset_source-identical-view_public.bigquery_dataset.project
    dataset_id = module.dataset_source-identical-view_public.bigquery_dataset.dataset_id
    table_id   = google_bigquery_table.dataset_source-identical-view_public_ADRC_CV.table_id
    },
    {
      project_id = module.dataset_source-identical-view_foo.bigquery_dataset.project
      dataset_id = module.dataset_source-identical-view_foo.bigquery_dataset.dataset_id
      table_id   = google_bigquery_table.dataset_source-identical-view_foo_ADRC_CV.table_id
    },
    {
      project_id = module.dataset_source-identical-view_zoo.bigquery_dataset.project
      dataset_id = module.dataset_source-identical-view_zoo.bigquery_dataset.dataset_id
      table_id   = google_bigquery_table.dataset_source-identical-view_zoo_ADRC_CV.table_id
    },
    {
      project_id = module.dataset_source-identical-view_bar.bigquery_dataset.project
      dataset_id = module.dataset_source-identical-view_bar.bigquery_dataset.dataset_id
      table_id   = google_bigquery_table.dataset_source-identical-view_bar_ADRC_CV.table_id
  }]
}

module "dataset_source-identical-view_public_auth" {
  source  = "terraform-google-modules/bigquery/google//modules/authorization"
  version = "~> 4.2.1"

  dataset_id = module.dataset_source-identical-view_public.bigquery_dataset.dataset_id
  project_id = module.dataset_source-identical-view_public.bigquery_dataset.project

  roles = [{
    role           = "roles/bigquery.dataViewer"
    group_by_email = "pso-cardinal-health@google.com"
  }]

  authorized_views = []
}

module "dataset_source-identical-view_foo_auth" {
  source  = "terraform-google-modules/bigquery/google//modules/authorization"
  version = "~> 4.2.1"

  dataset_id = module.dataset_source-identical-view_foo.bigquery_dataset.dataset_id
  project_id = module.dataset_source-identical-view_foo.bigquery_dataset.project

  roles = [{
    role           = "roles/bigquery.dataViewer"
    group_by_email = "pso-cardinal-health@google.com"
  }]

  authorized_views = []
}

module "dataset_source-identical-view_zoo_auth" {
  source  = "terraform-google-modules/bigquery/google//modules/authorization"
  version = "~> 4.2.1"

  dataset_id = module.dataset_source-identical-view_zoo.bigquery_dataset.dataset_id
  project_id = module.dataset_source-identical-view_zoo.bigquery_dataset.project

  roles = [{
    role           = "roles/bigquery.dataViewer"
    group_by_email = "pso-cardinal-health@google.com"
  }]

  authorized_views = []
}

module "dataset_source-identical-view_bar_auth" {
  source  = "terraform-google-modules/bigquery/google//modules/authorization"
  version = "~> 4.2.1"

  dataset_id = module.dataset_source-identical-view_bar.bigquery_dataset.dataset_id
  project_id = module.dataset_source-identical-view_bar.bigquery_dataset.project

  roles = [{
    role           = "roles/bigquery.dataViewer"
    group_by_email = "pso-cardinal-health@google.com"
  }]

  authorized_views = []
}