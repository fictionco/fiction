<template>
  <dashboard-page :loading="loading">
    <dashboard-splash
      title="Your Admin"
      sub-title="Want to learn more about Factor? Reach out to us or explore the docs."
      :features="splash('features')"
      :media-url="splash('media')"
    />
    <dashboard-chat
      title="Tech Support"
      sub-title="Get in touch with other travelers on the new chat group..."
      :media-url="splash('media')"
    />
  </dashboard-page>
</template>
<script>
export default {
  data() {
    return {
      loading: false
    }
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
            title: "Latest Plugins",
            description: "plugins will go here",
            content: "something",
            btn: "Get Plugins",
            path: "/plugins"
          },
          {
            title: "Factor News",
            description:
              "Monorepo Workflows - Public and Private Repos and Yarn Link",
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
