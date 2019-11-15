<template>
  <div class="site-head">
    <div class="site-head-pad">
      <site-brand class="site-brand" />

      <div class="primary-nav">
        <template v-for="(item, index) in siteNav">
          <component :is="item.component()" v-if="item.component" :key="index" />
          <factor-link
            v-else
            :key="index"
            :path="item.path"
            :event="item.event"
            :target="item.target"
          >
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span v-formatted-text="item.name" />
          </factor-link>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
export default Vue.extend({
  components: {
    factorIcon,
    factorLink,
    "site-brand": () => import("./el/brand.vue")
  },
  data() {
    return {
      navConfig: setting("site.nav")
    }
  },
  computed: {
    siteNav() {
      return this.navConfig.filter(item => !item.condition || item.condition())
    }
  }
})
</script>
<style lang="less">
.nav-light:not(.scrolled) .site-head {
  color: #fff;
  background: transparent;
}

.site-head {
  transition: all 0.3s;

  padding: 0 1.5em;
  position: fixed;
  width: 100%;
  z-index: 50;
  font-weight: 600;
}

.factor-site {
  .site-head {
    opacity: 0;
  }
  &.scrolled,
  &.top {
    .site-head {
      opacity: 1;
    }
  }
  &.scrolled {
    .site-head {
      padding: 0rem 2rem;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
}

.site-head-pad {
  height: 45px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .primary-nav {
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
      flex-grow: 2;
      justify-content: flex-end;
    }
    > a {
      letter-spacing: -0.03em;
      font-size: 0.9em;
      color: inherit;

      margin: 0 1em;
      @media (max-width: 767px) {
        margin: 0 1em;
        .fa {
          display: none;
        }
      }
      &:hover,
      &.router-link-active {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.5;
      }
      &.factor-link {
        .fa {
          margin-right: 4px;
          opacity: 0.7;
        }
      }
    }
    .account-menu {
      margin-left: 1em;
    }

    .nav-dropdown-toggle {
      padding: 4px 6px;
      font-weight: 500;
      border-radius: 4px;
      &.active,
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>
