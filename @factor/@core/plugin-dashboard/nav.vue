<template>
  <div class="app-nav-pad">
    <div class="nav-list">
      <div
        v-for="(primary, index) in appMenu"
        :key="index"
        class="nav-set"
        :class="primary.title ? 'has-title' : ''"
      >
        <div v-if="primary.title" class="group-title">{{ primary.title }}</div>
        <div class="nav-group">
          <factor-link
            class="primary-item"
            :class="primary.class"
            :path="getPath(primary.path, false, 'top')"
            :query="primary.query"
            :action="primary.action"
            :data-test="`app-nav-${$utils.slugify(primary.name)}` "
          >
            <img
              class="primary-item-icon"
              :src="primary.icon || defaultIcon"
              :alt="`${primary.name} Icon`"
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
                :data-test="`app-subnav-${$utils.slugify(item.name)}`"
              >
                <span v-formatted-text="item.name" />
              </factor-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggle: false,
      clickHandler: false
    }
  },
  computed: {
    defaultIcon() {
      return require("./resource/generic.svg")
    },
    activeGroup() {
      const { path } = this.$route
      let out = ""

      this.appMenu.forEach(primary => {
        const { group, items = [] } = primary
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

      return out
    }
  },
  created() {
    const {
      meta: { format = "dashboard" }
    } = this.$route.matched.find(_ => _.meta.format) || {}

    this.appMenu = this.$filters.applyFilters(`${format}-menu`, []).map(_ => {
      return {
        ..._,
        items: this.$filters.applyFilters(`${format}-menu-${_.group}`, _.items)
      }
    })
  },
  methods: {
    getPath(path, parent = false, from = "") {
      if (path.startsWith("/")) {
        return path
      } else {
        const base = parent
          ? this.getPath(parent.path)
          : this.$route.matched[0].path

        return `${base}/${path}`
      }
    }
  }
}
</script>
<style lang="less">
.app-nav-pad {
  .nav-group {
    margin-bottom: 0.3em;
    position: relative;
    .primary-item-icon {
      position: absolute;
      left: 0;
      top: 6px;
      opacity: 0.8;
      width: 16px;
      @media (max-width: 767px) {
        width: 24px;
      }
    }
  }
  .nav-set.has-title {
    margin: 1em 0;
  }
  .group-title {
    font-size: 0.9em;
    opacity: 0.2;
  }
  a {
    margin-left: 1.5em;
    padding: 0.3em;

    font-weight: 500;
    color: inherit;
    opacity: 0.7;
    display: block;
    transition: opacity 0.2s, color 0.2s;
    @media (max-width: 767px) {
      margin-left: 0;
      padding: 2em 1em;
      img {
        position: relative;
        width: 26px;
      }
      span {
        display: none;
      }
    }

    &:hover {
      opacity: 0.85;
    }

    &.active-path {
      font-weight: 600;

      opacity: 1;
      .primary-item-icon {
        filter: initial;
        position: absolute;
        left: 0;
        opacity: 1;
      }
    }
    .external {
      opacity: 0.8;
      transition: all 0.2s;
      transform: rotate(45deg) translate(-4px, 0px);
      display: inline-block;
    }
    &:hover .external {
      transform: rotate(45deg) translate(-3px, -4px);
    }
  }
}
</style>