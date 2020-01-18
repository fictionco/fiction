<template>
  <div class="app-nav-pad">
    <div class="nav-list">
      <template v-for="area in ['account', 'dashboard', 'admin']">
        <div
          v-if="menu && menu[area] && menu[area].length > 0"
          :key="area"
          class="nav-area"
          :class="area"
        >
          <div v-if="area != 'action' && area != 'account'" class="area-title">{{ toLabel(area) }}</div>

          <template v-for="(item, key) in menu[area]">
            <div :key="key" class="nav-group" :class="item.active ? 'active': ''">
              <factor-link
                :path="item.path"
                :query="item.query"
                :action="item.action"
                class="menu-item-link"
                :class="item.active ? 'active': 'not-active'"
                @click="(item.click) ? item.click() : ''"
              >
                <div class="item-icon">
                  <img class :src="item.icon || defaultIcon" :alt="`${item.name} Icon`" />
                </div>
                <div class="item-text">
                  <span v-formatted-text="item.name" />
                </div>
              </factor-link>
              <div v-if="item.active && item.items.length > 0" class="sub-menu">
                <div class="sub-menu-links">
                  <template v-for="(subItem) in item.items">
                    <factor-link
                      v-if="subItem.name"
                      :key="subItem.name"
                      class="sub-item"
                      :path="subItem.path"
                      :query="subItem.query"
                      :action="subItem.action"
                      :data-test="`app-subnav-${slugify(subItem.name)}`"
                    >
                      <span v-formatted-text="subItem.name" />
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
      this.menu = await getDashboardMenu(this.$route.path)
    }
  }
})
</script>
<style lang="less">
.app-nav-pad .nav-list {
  .nav-area {
    font-size: 1.2em;
    margin-bottom: 0.75em;
    padding-bottom: 0.75em;
    .area-title {
      margin-bottom: 0.5rem;
      padding: 0 1rem;
      opacity: 0.4;
      font-weight: var(--font-weight-bold);
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }
  .nav-group {
    padding: 0.6rem 1rem 0.5rem;
    border-radius: 5px;
    &.active {
      background: #f6fafd;
    }
    position: relative;
    .menu-item-link,
    .sub-menu {
      grid-template-columns: 2rem 1fr;
    }
    .menu-item-link {
      display: grid;
      grid-template-areas: "icon primary";

      padding: 0.1em 0;
    }

    .item-icon {
      grid-area: icon;
      //  align-self: center;
      img {
        margin-top: 0.16rem;
        width: 1.25rem;
        display: block;
      }
    }
    .sub-menu {
      display: grid;
      grid-template-areas: ". sub";
      .sub-menu-links {
        grid-area: sub;
        padding: 0.5rem 0;
      }
    }
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
