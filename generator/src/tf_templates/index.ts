import { isDataCollection, isTable } from "../gen/dev.cft.v1alpha1";
import { DataCollectionManager } from "../datamanager";
import DataCollectionGenerator from "./datacollection";
import TableViewGenerator from "./table";
import { KubernetesObject } from "kpt-functions";

export default function(o: KubernetesObject, manager: DataCollectionManager) {
  if (isDataCollection(o)) {
    return DataCollectionGenerator(o, manager);
  }
  if (isTable(o)) {
    return TableViewGenerator(o, manager);
  }
  return '';
}
