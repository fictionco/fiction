<template>
  <div class="content-layout" :style="bg">
    <site-head>
      <factor-link path="/docs">Docs</factor-link>
      <factor-link path="/themes">Themes</factor-link>
      <factor-link path="/plugins">Plugins</factor-link>
      <factor-link v-if="!$uid" event="signin-modal" data-test="login">
        Sign In
        <i class="fa fa-arrow-right" />
      </factor-link>
      <factor-link v-else path="https://www.fiction.com" class="dashboard-link">
        Go to Fiction.com
        <i class="fa fa-arrow-right" />
      </factor-link>
      <factor-link
        class="factor-icon"
        path="https://gitter.im/fiction-com/community"
        target="_blank"
      >
        <factor-icon icon="gitter" />
      </factor-link>
      <factor-link class="factor-icon" path="https://github.com/fiction-com/factor" target="_blank">
        <factor-icon icon="github" />
      </factor-link>
    </site-head>
    <div class="content-main">
      <div class="content-main-content">
        <slot v-if="$slots.default" />
        <router-view v-else />
      </div>

      <site-footer v-if="$route.meta.footer !== false" />
    </div>
  </div>
</template>
<style src="#/css/style.less" lang="less"></style>
<script>
export default {
  components: {
    "site-head": () => import("#/site-head"),
    "site-footer": () => import("#/site-footer")
  },
  computed: {
    nav() {
      return typeof this.$route.meta.nav != "undefined"
        ? this.$route.meta.nav
        : true
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
  }
}
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

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
      min-height: 100vh;
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
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}
</style>