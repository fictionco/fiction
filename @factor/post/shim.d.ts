declare module "mongoose/browser"
declare module "mongoose-beautiful-unique-validation"
declare module "vue-client-only"
declare module "bson-objectid" {}

declare module "mongoose" {
  export var modelSchemas: { [index: string]: Schema }
}
