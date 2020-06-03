import * as _ from 'lodash';

export const DATASET_SUFFIXES = {
  "STORAGE": "",
  "RAW": "raw",
  "PUBLIC": "public"
};

export enum datasetTypes {
  SOURCE_IDENTICAL = "SOURCE_IDENTICAL",
  SOURCE_IDENTICAL_VIEW = "SOURCE_IDENTICAL_VIEW",
  // These are out of scope for POC:
  // PREPARED = "PREPARED",
  // REFINED = "DEFINED",
  // PREPARED_VIEW = "PREPARED_VIEW", // D1
  // REFINED_VIEW = "REFINED_VIEW" // D2
}

export interface Binding {
  role: string;
  member: string;
}

export function getAuthKind(kind: string) {
  switch (kind) {
    case "group":
      return "group_by_email";
    case "serviceAccount":
    case "user":
      return "user_by_email";
  }
  return false;
}

export class GeneratorConfig {
  [index: string]: string;

  // list required config properties
  environment = "";
  storage_project_id = "";
  view_project_id = "";
  terraform_state_bucket = "";
  writer_service_account = "";
}

export default function buildConfigFromEnv() {
  const config = new GeneratorConfig();

  const source = process.env;

  _.each(Object.keys(config), (key: string) => {
    const name = key.toUpperCase();
    if (!(name in source)) {
      throw new Error(
        `Required config environment variable ${name} is not set.`
      );
    }
    const val = config[key];
    config[key] = <typeof val> (source[name]);
  });

  return config;
}

// class MyTableClass {
//   // list the propeties here, ONLY WRITTEN ONCE
//   constructor(
//       readonly id?: string,
//       readonly title?: string,
//       readonly isDeleted?: boolean,
//   ) {}
// }