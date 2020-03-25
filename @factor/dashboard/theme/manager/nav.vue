<template>
  <div class="app-nav-pad">
    <div class="nav-list">
      <template v-for="area in menu">
        <div v-if="area.menu.length > 0" :key="area.name" class="nav-area" :class="area.name">
          <div class="area-title">{{ toLabel(area.name) }}</div>

          <template v-for="(_, key) in area.menu">
            <div :key="key" class="nav-group" :class="_.active ? 'active': ''">
              <factor-link
                :path="_.path"
                :query="_.query"
                :action="_.action"
                class="menu-link"
                :class="_.active ? 'active': 'not-active'"
                @click="(_.click) ? _.click() : ''"
              >
                <div class="item-icon">
                  <img class :src="_.icon" />
                </div>
                <div class="item-text">
                  <span v-formatted-text="_.name" />
                </div>
              </factor-link>
              <div v-if="_.active && _.items.length > 0" class="sub-menu">
                <div class="sub-menu-links">
                  <template v-for="__ in _.items">
                    <factor-link
                      v-if="__.name"
                      :key="__.name"
                      class="menu-link-sub"
                      :path="__.path"
                      :query="__.query"
                      :action="__.action"
                      :data-test="`app-subnav-${slugify(__.name)}`"
                    >
                      <i />
                      <span v-formatted-text="__.name" />
                    </factor-link>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
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
      menu: {},
      loading: false
    }
  },
  computed: {},
  watch: {
    $route: function(this: any, to: Route, from: Route) {
      if (to.path != from.path) {
        this.setMenu()
      }
    }
  },
  async mounted(this: any) {
    this.loading = true
    await this.setMenu()
    this.loading = false
  },
  methods: {
    toLabel,
    slugify,
    async setMenu(this: any) {
      this.menu = await getDashboardMenu()
    }
  }
})
</script>
<style lang="less">
.nav-list {
  .nav-area {
    margin-bottom: 0.75em;
    padding-bottom: 0.75em;
    .area-title {
      font-size: 0.9em;
      margin: 1rem 1rem 0.5rem;
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
  .nav-group {
    border-radius: 5px;

    position: relative;

    .menu-link,
    .menu-link-sub {
      padding: 0.6rem 1.5rem 0.5rem;
      margin: 2px 0;
      border-radius: 4px;
      display: grid;
      grid-template-columns: 2rem 1fr;
      &.active-path,
      &:hover {
        background: var(--color-bg-highlight);
      }
    }
    .menu-link {
      display: grid;
      grid-template-areas: "icon primary";
    }

    .item-icon {
      grid-area: icon;
      img {
        margin-top: 0.15rem;
        width: 1rem;
        display: block;
      }
    }

    // .sub-menu {
    //   display: grid;
    //   grid-template-areas: ". sub";
    //   .sub-menu-links {
    //     grid-area: sub;
    //     padding: 0.5rem 0;
    //   }
    // }
    .item-text {
      grid-area: primary;
      line-height: 1.4;
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
    color: inherit;
    display: block;
    transition: all 0.2s;

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
