/* GENERATED FILE */
export default {
  webpack: () => import("@factor/build/webpack-config.js"),
  serverDev: () => import("@factor/server-dev/index.js"),
  setup: () => import("@factor/setup/index.js"),
  emailServer: () => import("@factor/core-email/server"),
  endpointServer: () => import("@factor/core-endpoint/server"),
  error: () => import("@factor/core-error/index.js"),
  storageServer: () => import("@factor/core-storage/server"),
  userServer: () => import("@factor/core-user/server"),
  userEmailsServer: () => import("@factor/core-user-emails/server"),
  userRolesServer: () => import("@factor/core-user-roles/server"),
  postServer: () => import("@factor/post/server"),
  post: () => import("@factor/post/index"),
  dashboard: () => import("@factor/dashboard/index.js"),
  http: () => import("@factor/tools-http/index.js"),
  time: () => import("@factor/tools-time/index.js"),
  directivesStandard: () => import("@factor/ui-directives-standard/index.js"),
  templates: () => import("@factor/post-page-templates/index.js"),
  server: () => import("@factor/server/index.js"),
  cwd: () => import("../index.js")
}