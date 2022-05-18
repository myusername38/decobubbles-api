export enum ArrayQueryType {
  equals = '==',
  notEqual = '!=',
  contains = 'array-contains',
}

export enum OrderBy {
  desc = 'desc',
  asc = 'asc',
}

export enum QueryType {
  where = 'where',
  limit = 'limit',
  orderBy = 'order',
}

export interface WhereQuery extends CollectionQueryBase {
  field: string;
  queryType: ArrayQueryType;
  value: string | boolean;
}

export interface LimitQuery extends CollectionQueryBase {
  limit: number;
}

export interface OrderQuery extends CollectionQueryBase {
  field: string;
  orderBy?: OrderBy;
}

export interface CollectionQueryBase {
  type: QueryType;
}

export type CollectionQuery = WhereQuery | LimitQuery | OrderQuery;
