<template>
  <dashboard-page :loading="loading">
    <dashboard-splash
      title="Admin"
      sub-title="Manage your app content and users."
      :features="splash('features')"
      :media-url="require('./resource/splash-factor.jpg')"
    />
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "dashboard-chat": () => import("./chat"),
    "dashboard-splash": () => import("./splash")
  },
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    console.log("load")
    await this.$user.init()
    this.loading = false
  },
  metatags() {
    return {
      title: "Overview",
      description: "Fiction.com dashboard overview.",
      priority: 30
    }
  },
  methods: {
    splash(v) {
      if (v == "media") {
        return require("./resource/splash.jpg")
      } else if (v == "features") {
        return [
          {
            title: "Get Plugins",
            description: "Browse and download Factor extensions for your app.",
            content: "something",
            btn: "Get Plugins &rarr;",
            path: "https://factor.dev/plugins"
          },
          {
            title: "Latest Updates",
            description:
              "Katest news, tips and tutorials on creating next level apps.",
            btn: "Blog &rarr;",
            path: "https://www.fiction.com/blog"
          },
          {
            title: "Factor Docs",
            description:
              "Need some help getting things rolling? Check out Factor.dev.",
            btn: "Go &rarr;",
            path: "https://factor.dev"
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
