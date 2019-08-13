<template>
  <div class="content-layout">
    <site-head />
    <div class="content-main" :style="bg">
      <div class="content-main-content">
        <slot v-if="$slots.default" />
        <router-view v-else />
      </div>
      <site-footer />
    </div>
  </div>
</template>

<style src="#/css/style.less" lang="less"></style>
<script>
export default {
  components: {
    "site-head": () => import("./site-head"),
    "site-footer": () => import("./site-footer")
  },
  computed: {
    bg() {
      return {
        background: this.$route.meta.background || ""
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