import * as path from 'path';
import * as _ from 'lodash';

import { Configs } from 'kpt-functions';
import { isDataCollection } from './gen/dev.cft.v1alpha1';
import { FileWriter } from './writer';
import { DataManager, DataCollectionManager } from './datamanager';
import generator from './tf_templates';
import buildConfigFromEnv from "./config";

export const SINK_DIR = 'sink_dir';
export const OVERWRITE = 'overwrite';

export async function generateTf(configs: Configs) {
  const tfDir = configs.getFunctionConfigValueOrThrow(SINK_DIR);
  const overwrite = configs.getFunctionConfigValue(OVERWRITE) !== 'false';

  const fileWriter = new FileWriter(tfDir, overwrite);

  const dataManager = new DataManager(configs);

  _.each(dataManager.collections, (manager: DataCollectionManager) => {
    const collectionConfig = generator(manager.o, manager);
    const hcl = collectionConfig;

    const dirName = manager.getDir().split(path.sep).join("_");
    const dumpPath = path.join(tfDir, dirName);

    const tfFilePath = path.join(dumpPath, `datasets.tf`);
    fileWriter.write(tfFilePath, hcl);

    // Create the backend config
    const backend = `terraform {
      backend "gcs" {
        bucket = "${manager.manager.config.terraform_state_bucket}"
        prefix = "terraform/${manager.manager.config.environment}/generated/${dirName}"
      }
    }`;
    fileWriter.write(path.join(dumpPath, 'backend.tf'), backend);

    // Create the views
    _.each(manager.tables, (table) => {
      const tableConfig = generator(table, manager);
      fileWriter.write(path.join(dumpPath, `${table.spec.name}.tf`), tableConfig);
    });
  });

  fileWriter.finish();
}

generateTf.usage = `
Generates BigQuery Terraform based on declarative YAML configs.

Configured using a ConfigMap with the following keys:
${SINK_DIR}: Path to dump Terraform into.
${OVERWRITE}: [Optional] If 'false', will refuse to overwrite existing Terraform configs.

Example:
apiVersion: v1
kind: ConfigMap
data:
  ${SINK_DIR}: terraform/generated
metadata:
  name: my-config
`;
