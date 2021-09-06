/**
 * In typescript, you need to augment the base process type
 * with any additional variables you add
 */
declare namespace NodeJS {
  interface Process {
    __API__: any;
  }
}
