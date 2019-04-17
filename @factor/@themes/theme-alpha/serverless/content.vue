<template>
  <div class="content-layout">
    <site-head v-if="nav">
      <template v-slot:nav>
        <factor-link path="/">Intro</factor-link>
        <factor-link path="/">About</factor-link>
        <factor-link path="/">Work</factor-link>
        <factor-link path="/">Blog</factor-link>
        <factor-link path="/">Contact</factor-link>
      </template>
      <template v-slot:social>
        <factor-link class="factor-icon" path="https://dribbble.com/" target="_blank">
          <i class="fa fa-dribbble" />
        </factor-link>
        <factor-link class="factor-icon" path="https://www.instagram.com/" target="_blank">
          <i class="fa fa-instagram" />
        </factor-link>
        <factor-link class="factor-icon" path="https://twitter.com/" target="_blank">
          <i class="fa fa-twitter" />
        </factor-link>
        <factor-link class="factor-icon" path="https://www.linkedin.com/" target="_blank">
          <i class="fa fa-linkedin" />
        </factor-link>
      </template>
    </site-head>
    <div class="content-main" :style="bg">
      <div class="content-main-content">
        <slot v-if="$slots.default" />
        <router-view v-else />
      </div>
      <site-footer v-if="nav" />
    </div>
  </div>
</template>
<style src="./css/common.less" lang="less"></style>
<script>
export default {
  components: {
    "site-head": () => import("./site-head"),
    "site-footer": () => import("./site-footer")
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
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}
</style>