import { KubernetesObject } from 'kpt-functions';
import * as apisMetaV1 from './io.k8s.apimachinery.pkg.apis.meta.v1';

export class DataCollection implements KubernetesObject {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata: apisMetaV1.ObjectMeta;

  public spec: DataCollection.Spec;

  constructor(desc: DataCollection.Interface) {
    this.apiVersion = DataCollection.apiVersion;
    this.kind = DataCollection.kind;
    this.metadata = desc.metadata;
    this.spec = desc.spec;
  }
}

export function isDataCollection(o: any): o is DataCollection {
  return o && o.apiVersion === DataCollection.apiVersion && o.kind === DataCollection.kind;
}

export namespace DataCollection {
  export const apiVersion = "cft.dev/v1alpha1";
  export const group = "cft.dev";
  export const version = "v1alpha1";
  export const kind = "DataCollection";

  export interface Interface {
    // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata: apisMetaV1.ObjectMeta;

    spec: DataCollection.Spec;
  }
  export class Spec {
    // email of the dataset owner
    public dataOwner: string;

    // Email of the dataset requestor
    public dataRequestor: string;

    public dataset: DataCollection.Spec.Dataset;

    public permissions?: {[key: string]: string[]};

    constructor(desc: DataCollection.Spec) {
      this.dataOwner = desc.dataOwner;
      this.dataRequestor = desc.dataRequestor;
      this.dataset = desc.dataset;
      this.permissions = desc.permissions;
    }
  }

  export namespace Spec {
    export class Dataset {
      public applicationName: string;

      public businessSegment: string;

      public datasetType: string;

      public instanceName?: object;

      public sourceSchema: string;

      public suffix?: object;

      constructor(desc: DataCollection.Spec.Dataset) {
        this.applicationName = desc.applicationName;
        this.businessSegment = desc.businessSegment;
        this.datasetType = desc.datasetType;
        this.instanceName = desc.instanceName;
        this.sourceSchema = desc.sourceSchema;
        this.suffix = desc.suffix;
      }
    }
  }
}

// DataCollectionList is a list of DataCollection
export class DataCollectionList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // List of datacollections. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
  public items: DataCollection[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
  public metadata?: DataCollectionList.Metadata;

  constructor(desc: DataCollectionList) {
    this.apiVersion = DataCollectionList.apiVersion;
    this.items = desc.items.map((i) => new DataCollection(i));
    this.kind = DataCollectionList.kind;
    this.metadata = desc.metadata;
  }
}

export function isDataCollectionList(o: any): o is DataCollectionList {
  return o && o.apiVersion === DataCollectionList.apiVersion && o.kind === DataCollectionList.kind;
}

export namespace DataCollectionList {
  export const apiVersion = "cft.dev/v1alpha1";
  export const group = "cft.dev";
  export const version = "v1alpha1";
  export const kind = "DataCollectionList";

  // DataCollectionList is a list of DataCollection
  export interface Interface {
    // List of datacollections. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
    items: DataCollection[];

    // ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
    metadata?: DataCollectionList.Metadata;
  }
  // ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
  export class Metadata {
    // continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message.
    public continue?: string;

    // remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.
    public remainingItemCount?: number;

    // String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
    public resourceVersion?: string;

    // selfLink is a URL representing this object. Populated by the system. Read-only.
    // 
    // DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
    public selfLink?: string;
  }
}

export class Table implements KubernetesObject {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata: apisMetaV1.ObjectMeta;

  public spec: Table.Spec;

  constructor(desc: Table.Interface) {
    this.apiVersion = Table.apiVersion;
    this.kind = Table.kind;
    this.metadata = desc.metadata;
    this.spec = desc.spec;
  }
}

export function isTable(o: any): o is Table {
  return o && o.apiVersion === Table.apiVersion && o.kind === Table.kind;
}

export namespace Table {
  export const apiVersion = "cft.dev/v1alpha1";
  export const group = "cft.dev";
  export const version = "v1alpha1";
  export const kind = "Table";

  export interface Interface {
    // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata: apisMetaV1.ObjectMeta;

    spec: Table.Spec;
  }
  export class Spec {
    public fields: Table.Spec.Item[];

    public name: string;

    constructor(desc: Table.Spec) {
      this.fields = desc.fields;
      this.name = desc.name;
    }
  }

  export namespace Spec {
    export class Item {
      // function to anonymize the data [HIDE|HASH|SUBSTR(start,len)]
      public anonymizer?: object;

      public dateset_suffixes?: string[];

      public description?: object;

      public name: string;

      public regulatory?: string;

      public type?: object;

      constructor(desc: Table.Spec.Item) {
        this.anonymizer = desc.anonymizer;
        this.dateset_suffixes = desc.dateset_suffixes;
        this.description = desc.description;
        this.name = desc.name;
        this.regulatory = desc.regulatory;
        this.type = desc.type;
      }
    }
  }
}

// TableList is a list of Table
export class TableList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // List of tables. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
  public items: Table[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
  public metadata?: TableList.Metadata;

  constructor(desc: TableList) {
    this.apiVersion = TableList.apiVersion;
    this.items = desc.items.map((i) => new Table(i));
    this.kind = TableList.kind;
    this.metadata = desc.metadata;
  }
}

export function isTableList(o: any): o is TableList {
  return o && o.apiVersion === TableList.apiVersion && o.kind === TableList.kind;
}

export namespace TableList {
  export const apiVersion = "cft.dev/v1alpha1";
  export const group = "cft.dev";
  export const version = "v1alpha1";
  export const kind = "TableList";

  // TableList is a list of Table
  export interface Interface {
    // List of tables. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
    items: Table[];

    // ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
    metadata?: TableList.Metadata;
  }
  // ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
  export class Metadata {
    // continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message.
    public continue?: string;

    // remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.
    public remainingItemCount?: number;

    // String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
    public resourceVersion?: string;

    // selfLink is a URL representing this object. Populated by the system. Read-only.
    // 
    // DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
    public selfLink?: string;
  }
}