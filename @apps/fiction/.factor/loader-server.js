/******** GENERATED FILE ********/
const files = {}
files["setting"] = require("@factor/app-settings").default
files["mongo"] = require("@factor/tools-mongo").default
files["blog"] = require("@factor/plugin-blog").default
files["bugsnagServer"] = require("@factor/plugin-bugsnag/server").default
files["contactFormServer"] = require("@factor/plugin-contact-form/server").default
files["dashboard"] = require("@factor/dashboard").default
files["dbServer"] = require("@factor/core-db/server").default
files["directivesStandard"] = require("@factor/ui-directives-standard").default
files["emailServer"] = require("@factor/core-email/server").default
files["emailListServer"] = require("@factor/plugin-email-list/server").default
files["emailList"] = require("@factor/plugin-email-list").default
files["endpointServer"] = require("@factor/core-endpoint/server").default
files["error"] = require("@factor/core-error").default
files["http"] = require("@factor/tools-http").default
files["jobs"] = require("@factor/plugin-jobs").default
files["postServer"] = require("@factor/post/server").default
files["post"] = require("@factor/post").default
files["seo"] = require("@factor/plugin-seo").default
files["server"] = require("@factor/server").default
files["serverDev"] = require("@factor/server-dev").default
files["setup"] = require("@factor/setup").default
files["sitemap"] = require("@factor/plugin-sitemap").default
files["storageServer"] = require("@factor/core-storage/server").default
files["storageS3"] = require("@factor/plugin-storage-s3").default
files["tagManager"] = require("@factor/plugin-google-tag-manager").default
files["templates"] = require("@factor/post-page-templates").default
files["time"] = require("@factor/tools-time").default
files["userServer"] = require("@factor/core-user/server").default
files["userEmailsServer"] = require("@factor/core-user-emails/server").default
files["userRolesServer"] = require("@factor/core-user-roles/server").default
files["webpack"] = require("@factor/build-webpack").default
files["appShared"] = require("@factor/theme-shared").default
files["cwd"] = require("../src/index.js").default
module.exports = files