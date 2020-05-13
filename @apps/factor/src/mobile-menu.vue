<template>
  <div class="mobile-menu">
    <div class="menu-panel" @click.stop>
      <div class="menu-panel-pad">
        <site-brand class="mobile-brand" />
        <div
          v-for="menu in menus"
          :key="menu._id"
          class="menu-area"
          :class="activeMenu[menu._id] ? 'active' : ''"
        >
          <div v-if="activeMenu[menu._id]" class="menu-items" @click="clickLink()">
            <div
              v-for="(item, itemIndex) in filteredMenu(menu.items)"
              :key="itemIndex"
              class="menu-item"
            >
              <div v-if="item.group" class="group-title">{{ toLabel(item.group) }}</div>
              <div v-else-if="item.component" class="menu-component">
                <component :is="item.component" />
              </div>
              <factor-link
                v-else
                class="menu-link primary-doc-link"
                :path="item.route"
                :event="item.event"
              >
                <span v-if="item.name" v-formatted-text="item.name" />
              </factor-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { toLabel, emitEvent } from "@factor/api"

import { isLoggedIn } from "@factor/user"
export default {
  components: {
    factorLink,
    siteBrand: () => import("./el/brand.vue"),
  },
  data() {
    return {
      menus: {},
      activeMenu: { docs: true, pages: true },
    }
  },
  computed: {},
  mounted() {
    this.menus = [
      {
        _id: "pages",
        title: "Pages",
        items: [
          {
            event: "sign-in-modal",
            name: "Sign In &rarr;",
            condition: (): boolean => !isLoggedIn(),
          },
          {
            route: "/dashboard",
            name: "View Dashboard &rarr;",
            condition: (): boolean => isLoggedIn(),
          },

          { route: "/install", name: "Get Started" },
          { route: "/themes", name: "Themes" },
          { route: "/plugins", name: "Plugins" },
          { path: "/forum", name: "Forum" },
          { route: "/docs", name: "Develop" },
          { component: () => import("./el/github-stars.vue") },
        ],
      },
    ]
  },
  methods: {
    filteredMenu(items: any) {
      return items.filter((item) => {
        const condition = item.condition ? item.condition() : true

        return condition
      })
    },
    toLabel,
    clickLink(this: any) {
      emitEvent("reset-ui")
    },
    toggleMenuArea(this: any, area: string) {
      const newValue = this.activeMenu[area] ? false : true
      this.$set(this.activeMenu, area, newValue)
    },
  },
}
</script>
<style lang="less">
.mobile-menu {
  position: absolute;
  top: 0;
  width: 325px;
  min-height: 4rem;
  position: absolute;
  right: 1rem;
  top: 0;
  z-index: 1000;
  @media (max-width: 767px) {
    width: calc(~"100% - 1rem");
  }
  .menu-panel {
    font-size: 1.2em;
    margin: 0.25rem 0.5rem;
    min-height: 100px;
    width: 100%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1), 0 15px 35px 0 rgba(49, 49, 93, 0.1),
      0 5px 15px 0 rgba(0, 0, 0, 0.08);

    .menu-panel-pad {
      padding: 1rem 1.5rem;
    }
  }

  .menu-title {
    cursor: pointer;
    &:hover {
      color: var(--color-secondary);
    }
    font-size: 1.2em;
    font-weight: 700;
    margin: 1.5rem 0 0.3rem;
    .factor-icon {
      opacity: 0.3;
    }
  }
  .menu-area {
    margin-top: 2rem;
    a {
      color: inherit;
    }
    .factor-link {
    }
  }
  .menu-link,
  .group-title {
    padding: 0.5em;
  }
  .menu-component {
    padding: 2rem 0;
  }
  .menu-link {
    display: block;

    border-radius: 5px;
    &.active-path {
      background: var(--color-bg-highlight);
      color: var(--color-primary);
    }
  }
  .group-title {
    margin: 1rem 0 0.5rem;
    opacity: 0.2;
    font-weight: 700;
  }
}
</style>
