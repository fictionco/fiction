<template>
  <dashboard-wrapper class="dashboard-view">
    <template #head>
      <div class="darwin-logo">
        <dash-logo scheme="standard" />
      </div>
    </template>
    <template #nav>
      <slot v-if="$slots.nav" name="nav" />
      <div v-else class="dash-menu-area">
        <manager-dropdown text="Factor.dev">
          <template #menu>Hi</template>
        </manager-dropdown>
        <div class="dash-menu">
          <div v-for="(group, i) in appMenu" :key="i" class="menu-group">
            <div v-if="group.group" class="title">{{ toLabel(group.group) }}</div>
            <div class="menu-items">
              <factor-link
                v-for="(subItem, ii) in group.items"
                :key="ii"
                class="item"
                :path="`/${subItem.value}`"
              >
                <div class="icon-wrap">
                  <dash-svg :icon="subItem.icon" />
                </div>
                <div class="text">{{ subItem.name || toLabel(subItem.value) }}</div>
              </factor-link>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="$scopedSlots.page" #page>
      <slot name="page" />
    </template>
  </dashboard-wrapper>
</template>
<script lang="ts">
import { factorLink, dashboardWrapper, managerDropdown } from "@factor/ui"
import { toLabel } from "@factor/api"

export default {
  components: {
    factorLink,
    dashboardWrapper,
    managerDropdown,
    dashLogo: () => import("../el/logo.vue"),
    dashSvg: () => import("../el/dash-svg.vue"),
  },
  props: {
    menu: { type: Array, default: () => [] },
  },
  data() {
    return {}
  },
  computed: {
    appMenu() {
      return this.menu.length > 0
        ? this.menu
        : [
            {
              items: [{ icon: "performance", name: "Dashboard", value: "" }],
            },
            {
              group: "behavior",
              items: [
                { icon: "replay", value: "replay" },
                { icon: "heatmaps", value: "heatmap" },
                { icon: "optimize", value: "optimize" },
              ],
            },
            {
              group: "settings",
              items: [{ icon: "settings", value: "settings" }],
            },
          ]
    },
  },
  mounted() {},
  methods: { toLabel },
}
</script>
<style lang="postcss">
.dashboard-view {
  .manager-header {
    .darwin-logo {
      text-align: center;
      svg {
        width: 100px;
        margin-right: 0.75rem;
      }
    }
  }
  .dash-menu-area {
    padding: 3px;
  }
  .manager-dropdown .manager-dropdown-pad .menu-name .name {
    font-size: 1.1em;
    font-weight: var(--font-weight-semibold);
  }
  .dash-menu {
    padding: 1rem 0;
    .title {
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      font-size: 0.85em;
      letter-spacing: 0.02em;
    }
    .menu-items {
      margin: 1rem 0;

      .item {
        color: inherit;
        padding: 0.5rem;
        display: grid;
        grid-template-columns: 2rem 1fr;
        grid-gap: 0.5rem;
        .icon-wrap {
          display: inline-block;
          width: 1.2rem;
          height: 1.2rem;
          text-align: center;
          line-height: 1.5rem;
          .factor-icon {
            font-size: 0.8em;
          }
          svg {
            vertical-align: middle;
            color: #8798ad;
          }
        }
        .text {
          font-size: 1.1em;
        }

        &.active-path {
          background: var(--color-bg-contrast);
          color: var(--color-primary);
          font-weight: var(--font-weight-semibold);
          svg {
            color: var(--color-primary);
          }
        }
      }
    }
  }
  .dpg .title-bar .page-title {
    font-weight: var(--font-weight-bold);
    letter-spacing: initial;
  }
}
</style>
