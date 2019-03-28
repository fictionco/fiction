<template>
  <dashboard-page :loading="loading">
    <dashboard-splash
      title="Welcome to Factor!"
      sub-title="We’ve assembled some links to get you started:"
      :media-url="splash('media')"
      :features="splash('features')"
    >
      <ul class="list-unstyled">
        <li>
          <factor-link path="/">
            <i class="fa fa-edit" /> Add a page
          </factor-link>
        </li>
        <li>
          <factor-link path="/">Add a post</factor-link>
        </li>
        <li>
          <factor-link path="/">View your site</factor-link>
        </li>
        <li>
          <factor-link path="/">Learn more about getting started</factor-link>
        </li>
      </ul>
    </dashboard-splash>
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
            title: "At a Glance",
            description: "<ul><li>3 Posts</li><li>4 Pages</li></ul>",
            content: "something",
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
