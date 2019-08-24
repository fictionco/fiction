<template>
  <dashboard-page :loading="loading">
    <dashboard-splash
      title="Factor Admin"
      sub-title="Welcome to your application post admin."
      :features="splash('features')"
    />
    <dashboard-chat
      title="Community Support"
      sub-title="Join Factor and Fiction communities on Gitter."
      :media-url="splash('media')"
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
            btn: "Get Plugins",
            path: "/plugins"
          },
          {
            title: "Updates and News",
            description:
              "Katest news, tips and tutorials on creating next level apps.",
            btn: "More News",
            path: "/blog"
          },
          {
            title: "Developer Portal",
            description:
              "The go-to place for all developer related content and social activities, where you can ask questions and learn from each other.",
            btn: "Join Portal",
            path:
              "https://gitter.im/fiction-com/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link"
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
