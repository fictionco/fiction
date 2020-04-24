<template>
  <header class="site-head">
    <div class="mast site-head-inner">
      <site-logo />
      <!-- <factor-link path="/" class="site-title">{{ siteTitle }}</factor-link> -->

      <div v-if="siteNav" class="nav">
        <template v-for="(item, index) in siteNav">
          <factor-link :key="index" :path="item.path">
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span>{{ item.name }}</span>
          </factor-link>
        </template>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "site-logo": () => import("./el/logo.vue"),
  },
  data() {
    return {
      siteTitle: setting("site.title"),
      siteNav: setting("site.nav"),
    }
  },
  methods: { setting },
})
</script>
<style lang="less">
.site-head {
  .mast {
    max-width: 1140px;
    margin: 0 auto;
  }
  .site-head-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;

    // .site-title {
    //   color: var(--color-text);
    //   font-weight: 700;
    // }
    .nav {
      > a {
        color: var(--color-text);
        padding: 0 1rem;
        &:last-child {
          padding-right: 0;
        }
        &:hover {
          color: var(--color-primary);
        }
      }
    }
  }
}
</style>
