module.exports = {
  services: {
    hosting: "@factor/service-firebase-hosting",
    storage: "@factor/service-firebase-storage",
    database: "@factor/service-firebase-firestore",
    search: "@factor/service-algolia",
    storage: "@factor/service-firebase-storage",
    auth: "@factor/service-firebase-auth",
    endpoints: "@factor/service-firebase-functions",
    email: ""
  },
  styleVars: {
    colorText: "#506677",
    colorPlaceholder: "#bdcad4",
    colorPrimary: "#ff0076",
    colorSecondary: "#0496FF",
    colorBg: "#fafbff",
    colorBgAlt: "#FFFFFF",
    colorSuccess: "#26d12b",
    colorWarning: "#ff6464",
    colorDanger: "#ff0076",
    colorInfo: "#62bdff",
    fontFamily:
      "'canada-type-gibson', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
  }
}
