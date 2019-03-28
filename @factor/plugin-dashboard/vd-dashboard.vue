<template>
  <dashboard-page :loading="loading">
    <dashboard-splash
      title="A Home for Nomads"
      sub-title="All the tools you'll need to go location independent."
      :media-url="splash('media')"
      :features="splash('features')"
    />
    <dashboard-chat
      title="Fiction on Discord"
      sub-title="Get in touch with other travelers on the new Fiction Discord channel..."
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
            title: "Fund Your Travel",
            description: "Host in your home while you're away.",
            icon: require("./resource/dashboard.svg"),
            btn: "List Your Home",
            path: "/dashboard/hosting"
          },
          {
            title: "Monthly Homes",
            description:
              "Awesome monthly places perfect for long-term travelers.",
            icon: require("./resource/dashboard.svg"),
            btn: "Find A Home",
            path: "/dashboard/staying"
          },
          {
            title: "Travel Network",
            description: "Traveling is better with friends new and old...",
            icon: require("./resource/dashboard.svg"),
            btn: "Add Friends",
            path: "/dashboard/network"
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
