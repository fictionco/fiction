<template>
  <dashboard-page :loading="loading">
    <dashboard-splash
      title="Fiction Admin"
      sub-title="Manage and control site resources and accounts."
      :features="splash('features')"
    />
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "dashboard-splash": () => import("./splash")
  },
  data() {
    return {
      loading: false
    }
  },

  methods: {
    splash(v) {
      if (v == "media") {
        return require("./resource/splash.jpg")
      } else if (v == "features") {
        return [
          {
            title: "Manage Posts",
            btn: "All Posts",
            path: "/admin/posts"
          },
          {
            title: "Manage Users",
            btn: "Users Overview",
            path: "/users/all"
          }
        ]
      }
    },
    tableStructure() {
      return [
        {
          column: "status",
          size: "1fr",
          type: "single"
        },
        {
          column: "property",
          size: "2fr",
          type: "media"
        },
        {
          column: "cost / mo",
          size: "2fr",
          type: "single"
        }
      ]
    }
  }
}
</script>
