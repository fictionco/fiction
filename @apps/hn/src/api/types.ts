import Firebase from "firebase"
import LRU from "lru-cache"

/**
 * Provided to Firebase
 */
export interface ApiArguments {
  config: { databaseURL: string };
  version: string;
}

/**
 * General data item shape
 */
export interface DataItem {
  id: string;
  kids: string[];
  descendants: number;
  url: string;
  score: number;
  time: number;
  by: string;
  title: string;
  [data: string]: any;
}

/**
 * User shape
 */
export type UserItem =
  | (DataItem & {
      karma: number;
      about: string;
      created: number;
    })
  | false

/**
 * Types of lists
 */
export enum ListTypes {
  TOP = "top",
  NEW = "new",
  SHOW = "show",
  ASK = "ask",
  JOB = "job"
}

export const listTypesArray: ListTypes[] = [
  ListTypes.TOP,
  ListTypes.NEW,
  ListTypes.SHOW,
  ListTypes.ASK,
  ListTypes.JOB
]

export type DataApi = {
  onServer?: boolean;
  cachedItems?: LRU<any, any>;
  cachedIds?: {
    [x in ListTypes]?: any
  };
} & Firebase.database.Reference
