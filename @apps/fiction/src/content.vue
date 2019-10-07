<template>
  <div class="content-layout">
    <site-head v-if="nav">
      <factor-link path="/factor-js">Factor JS</factor-link>
      <factor-link path="/vip">VIP</factor-link>
      <factor-link path="/careers">Careers</factor-link>
      <factor-link path="/blog">Blog</factor-link>
      <factor-link v-if="!$userId" event="signin-modal" data-test="login">
        Sign In
        <factor-icon icon="arrow-right" />
      </factor-link>
      <factor-link v-else path="/dashboard" class="dashboard-link">
        View Dashboard
        <factor-icon icon="arrow-right" />
      </factor-link>
    </site-head>
    <div class="content-main" :style="bg">
      <div class="content-main-content">
        <slot v-if="$slots.default" />
        <router-view v-else />
      </div>
      <content-footer v-if="nav" />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "site-head": () => import("./site-head"),
    "content-footer": () => import("./site-footer")
  },

  metaInfo() {
    const post = this.post || {}
    return {
      title: post.titleTag || post.title,
      titleTemplate: "%s - Fiction.com",
      description: post.description || this.$utils.excerpt(post.content),
      image: this.socialImage(post)
    }
  },

  computed: {
    post() {
      return this.$store.getters["getItem"]("post") || {}
    },

    nav() {
      return typeof this.$route.meta.nav != "undefined" ? this.$route.meta.nav : true
    },
    bg() {
      const background = this.$route.meta.background || false

      if (!background) {
        return ""
      } else {
        return {
          background
        }
      }
    }
  },
  methods: {
    socialImage(post) {
      return post.images && post.images.length > 0 && post.images[0].url
        ? post.images[0].url
        : ""
    }
  }
}
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  @media (max-width: 767px) {
    .dashboard-link {
      display: none;
    }
  }
  .content-content {
    display: flex;
    flex-grow: 1;
    .content-nav,
    .content-main {
      overflow-y: scroll;
    }
    .content-nav {
      flex: 0 0 250px;
      padding: 1em 1.5em;
      background: rgba(38, 67, 89, 0.08);
    }
    .content-main {
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      .content-main-content {
        padding: 1.5em;
        flex-grow: 1;
      }
      .content-footer {
        padding: 1em 1.5em;
        font-size: 0.85em;
        //  background: rgba(38, 67, 89, 0.03);
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}
</style>