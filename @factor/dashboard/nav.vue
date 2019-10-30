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
          <div class="nav-group" :class="activeGroup == primary.group ? 'active': ''">
            <div class="primary-item-icon">
              <img class :src="primary.icon || defaultIcon" :alt="`${primary.name} Icon`" />
            </div>
            <factor-link
              class="primary-item"
              :class="primary.class"
              :path="getPath(primary.path, false, 'top')"
              :query="primary.query"
              :action="primary.action"
              :data-test="`app-nav-${slugify(primary.name)}`"
            >
              <span v-formatted-text="primary.name" />
            </factor-link>

            <div v-if="activeGroup == primary.group" class="sub-menu">
              <template v-for="(item, iIndex) in primary.items">
                <factor-link
                  v-if="item.name"
                  :key="iIndex"
                  class="sub-item"
                  :path="getPath(item.path, primary, 'sub')"
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

<script>
import { toLabel, slugify, applyFilters } from "@factor/tools"
export default {
  data() {
    return {
      toggle: false,
      clickHandler: false,
      menus: {}
    }
  },
  computed: {
    firstItem() {
      return this.menus.dashboard[0] || this.menus.admin[0]
    },
    defaultIcon() {
      return require("./resource/generic.svg")
    },
    activeGroup() {
      const { path } = this.$route
      let out = ""
      Object.keys(this.menus).forEach(m => {
        this.menus[m].forEach(primary => {
          const { items = [] } = primary
          if (this.getPath(primary.path, false, "44") == path) {
            out = primary.group
          }
          if (items.length > 0) {
            items.forEach(sub => {
              if (this.getPath(sub.path, primary) == path) {
                out = primary.group
              }
            })
          }
        })
      })

      return out
    }
  },
  watch: {
    $route: function() {
      this.redirectOnDefault()
    }
  },
  async mounted() {
    this.menus = { dashboard: [] }

    // Wait for user, and if logged out don't initialize
    // Initializing a logged out user causes problems with signin redirects
    const user = await this.$user.init()
    if (user._id) this.initializeMenu()
  },
  methods: {
    toLabel,
    slugify,
    initializeMenu() {
      if (this.$user.can({ role: "admin" })) {
        this.$set(this.menus, "admin", [])
      }

      // const {
      //   meta: { format = "dashboard" }
      // } = this.$route.matched.find(_ => _.meta.format) || {}

      Object.keys(this.menus).forEach(format => {
        this.menus[format] = applyFilters(`${format}-menu`, []).map(_ => {
          return {
            ..._,
            items: applyFilters(`${format}-menu-${_.group}`, _.items)
          }
        })
      })

      this.redirectOnDefault()
    },
    redirectOnDefault() {
      if (this.$route.path == "/dashboard") {
        this.$router.replace({ path: this.getPath(this.firstItem.path) })
      }
    },
    getPath(path, parent = false) {
      if (path.startsWith("/")) {
        return path
      } else {
        const base = parent ? this.getPath(parent.path) : this.$route.matched[0].path

        return `${base}/${path}`
      }
    }
  }
}
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
      letter-spacing: -0.01em;
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
        width: 16px;
        display: block;
      }
      // position: absolute;
      // left: 6px;
      // top: 6px;
      // opacity: 0.8;

      // @media (max-width: 960px) {
      //   width: 22px;
      //   top: 10px;
      // }
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