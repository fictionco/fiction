// Important Developer Note
// In webpack production builds,
// any circular references to @factor/api from modules from also included here
// Will error with "Object(...) is not a function"
// Make sure to call modules directly here
// --

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />
/// <reference types="vue-meta" />

import log from "./logger"
export * from "./utils"

export * from "./time"
export * from "./hooks"
export * from "./html"
export * from "./metatags"
export * from "./permalink"
export * from "./url"
export * from "./post-types"
export * from "./settings"
export * from "./events"
export * from "./prefetch"
export * from "./markdown"
export * from "./endpoints"
export * from "./dashboard"
export * from "./i18n"

export * from "@factor/post/util"
export * from "@factor/post/request"
export * from "@factor/app/router"
export * from "@factor/app/store"
export * from "@factor/user"
export * from "@factor/templates"

export { log }
