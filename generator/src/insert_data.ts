import * as _ from 'lodash';
import {BigQuery} from '@google-cloud/bigquery';
import * as faker from 'faker';

import { Configs } from 'kpt-functions';

import { DataManager, DataCollectionManager } from './datamanager';

export async function insertData(configs: Configs) {
  const dataManager = new DataManager(configs);

  const bigquery = new BigQuery();
  _.each(dataManager.collections, (manager: DataCollectionManager) => {
    const dataset = bigquery.dataset(manager.storage.getName());

    _.each(manager.tables, (o) => {
      const rows = _.times(10, (n) => {
        return _.fromPairs(_.map(o.spec.fields, (field) => {
          return [field.name, faker.random.word()]
        }));
      });

      const table = dataset.table(o.spec.name);
      const options = {
        schema: _.map(o.spec.fields, (field) => {
          return {
            name: field.name,
            type: "string"
          };
        })
      };

      table.exists()
        .then((data): any => {
          const exists = data[0];
          if (!exists) {
            return table.create(options);
          }
          return Promise.resolve();
        })
        .then((response: any) => {
          return table.insert(rows, options)
        })
        .then((data) => {
          console.log("inserted", data);
        })
        .catch((err: any) => {
          console.log("insert failed", err);
        });
    })
  });
}

insertData.usage = `
Inserts testing data into all provided collections.

Note this is only suitable for development and not meant for real testing.
`;
