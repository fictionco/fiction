<template>
  <div class="app-nav-pad">
    <div class="nav-list">
      <div v-for="(items, menu) in menus" :key="menu" class="nav-scope" :class="menu">
        <div class="scope-title">{{ toLabel(menu) }}</div>
        <div
          v-for="(primary, index) in items"
          :key="index"
          class="nav-set"
          :class="primary.title ? 'has-title' : ''"
        >
          <div v-if="primary.title" class="group-title">{{ primary.title }}</div>
          <div class="nav-group" :class="primary.active ? 'active' : ''">
            <div class="primary-item-icon">
              <img class :src="primary.icon || defaultIcon" :alt="`${primary.name} Icon`" />
            </div>
            <factor-link
              class="primary-item"
              :class="primary.class"
              :path="primary.path"
              :query="primary.query"
              :action="primary.action"
              :data-test="`app-nav-${slugify(primary.name)}`"
            >
              <span v-formatted-text="primary.name" />
            </factor-link>

            <div v-if="primary.active" class="sub-menu">
              <template v-for="(item, iIndex) in primary.items">
                <factor-link
                  v-if="item.name"
                  :key="iIndex"
                  class="sub-item"
                  :path="item.path"
                  :query="item.query"
                  :action="item.action"
                  :data-test="`app-subnav-${slugify(item.name)}`"
                >
                  <span v-formatted-text="item.name" />
                </factor-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { userCan, userInitialized } from "@factor/user"
import { toLabel, slugify } from "@factor/api"
import { getDashboardMenu } from "@factor/dashboard/menu"
import { Route } from "vue-router"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  data() {
    return {
      toggle: false,
      clickHandler: false,
      menus: {}
    }
  },
  computed: {},
  watch: {
    $route: function(this: any, to: Route) {
      this.initializeMenu(to.path)
    }
  },
  async mounted() {
    const user = await userInitialized()

    if (user && user._id) {
      this.initializeMenu(this.$route.path)
    }
  },
  methods: {
    toLabel,
    slugify,
    initializeMenu(this: any, currentPath: string): void {
      const { dashboard, admin } = getDashboardMenu(currentPath)

      this.$set(this.menus, "dashboard", dashboard)

      if (userCan({ role: "admin" })) {
        this.$set(this.menus, "admin", admin)
      }
    }
  }
})
</script>
<style lang="less">
.app-nav-pad .nav-list {
  font-size: 0.95em;
  .nav-scope {
    margin-bottom: 0.75em;
    padding-bottom: 0.75em;
    .scope-title {
      margin-bottom: 10px;
      opacity: 0.2;
      font-size: 0.9em;

      font-weight: var(--font-weight-bold);
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }
  .nav-group {
    display: grid;
    grid-template-columns: 25px 1fr;
    grid-template-areas:
      "icon primary"
      ".    sub";
    margin-bottom: 0.3em;
    position: relative;
    .primary-item-icon {
      grid-area: icon;
      align-self: center;
      img {
        width: 1em;
        display: block;
      }
    }
    .primary-item {
      grid-area: primary;
    }
    .sub-menu {
      grid-area: sub;
    }
    .primary-item-icon {
      opacity: 0.6;
    }
    &.active {
      .primary-item-icon {
        filter: initial;
        position: absolute;

        opacity: 1;
      }
    }
  }
  .nav-set.has-title {
    margin: 1em 0;
  }

  @media (max-width: 960px) {
    .nav-set {
      display: grid;
      grid-template-columns: 1fr 1fr;
      .nav-group {
        font-size: 1.3em;
        .primary-item {
          padding: 0.5em 0.25em;
        }
      }
    }
  }

  a {
    padding: 0.25em;
    font-weight: 500;
    color: inherit;
    display: block;
    transition: opacity 0.2s, color 0.2s;
    opacity: 0.75;
    &:hover {
      opacity: 0.85;
    }

    &.active-path {
      font-weight: 700;

      opacity: 1;
    }
  }
}
</style>
