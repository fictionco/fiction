<template>
  <div class="forum-sidebar">
    <div class="new-discussion">
      <factor-link btn="primary" :path="`${setting('forum.indexRoute')}/add-new`">Start A Discussion</factor-link>
    </div>
    <div class="forum-nav">
      <factor-input-select
        class="show-mobile"
        :list="navItems"
        :value="$route.query.category || ''"
        @input="navigate($event)"
      ></factor-input-select>
      <div v-for="(item, index) in navItems" :key="index" class="nav-item show-desktop">
        <factor-link
          class="menu-item-link"
          :path="setting(`forum.indexRoute`)"
          :query="{category: item.home ? null : item.value}"
        >
          <div class="item-icon">
            <nav-icon class="nav-icon" :icon="item.value" />
          </div>
          <div class="item-text">{{ toLabel(item.name || item.value) }}</div>
        </factor-link>
        <div v-if="item == 2" class="sub-menu">
          <div class="sub-menu-links">
            <factor-link>Nav</factor-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { toLabel } from "@factor/api/utils"
import { setting } from "@factor/api/settings"
import { factorLink, factorInputSelect } from "@factor/ui"
import Vue from "vue"

interface NavItem {
  value: string
  name?: string
  path?: string
  home?: boolean
}
export default Vue.extend({
  components: {
    factorLink,
    navIcon: () => import("./el/nav-icon.vue"),
    factorInputSelect
  },
  data() {
    return {
      selectNav: "",
      navItems: [
        {
          name: "All Discussions",
          value: "",
          path: setting("forum.indexRoute"),
          home: true
        },
        {
          value: "support"
        },
        {
          value: "plugin"
        },
        {
          value: "themes"
        },
        {
          value: "feedback"
        },
        {
          value: "performance"
        },
        {
          value: "integrations"
        }
      ] as NavItem[]
    }
  },
  computed: {},
  methods: {
    setting,
    toLabel,
    navigate(this: any, category: string | null) {
      const path = setting(`forum.indexRoute`)
      let query = { ...this.$route.query, category }

      // remove category from url if no val
      if (!category) delete query.category

      this.$router.push({ path, query })
    }
  }
})
</script>

<style lang="less">
.forum-sidebar {
  .new-discussion {
    .factor-btn {
      font-size: 1.1em;
      width: 100%;
      max-width: 200px;
    }
  }

  .forum-nav {
    margin: 2rem 0;
    @media (max-width: 900px) {
      margin: 1rem 0;
    }
    .show-mobile {
      display: none;
      @media (max-width: 900px) {
        display: block;
      }
    }

    .show-desktop {
      display: block;
      @media (max-width: 900px) {
        display: none;
      }
    }
  }
  .nav-item {
    letter-spacing: -0.02em;
    font-size: 1.2em;
    font-weight: 600;
    display: grid;
    margin-bottom: 0.75rem;

    .menu-item-link,
    .sub-menu {
      grid-template-columns: 2rem 1fr;
      grid-gap: 0.5rem;
    }

    .menu-item-link {
      line-height: 1.2;
      display: grid;
      grid-template-areas: "icon primary";

      padding: 0.1em 0;
      color: inherit;
      &.router-link-exact-active {
        color: var(--color-primary);
        .item-icon svg .primary-color {
          fill: var(--color-primary);
        }
      }
      &:hover {
        color: var(--color-primary);
        .item-icon .primary-color {
          fill: var(--color-primary);
        }
      }
      .item-icon {
        grid-area: icon;
        svg {
          width: 1.5em;
          display: block;
        }
      }
    }

    .item-text {
      grid-area: primary;
    }

    .sub-menu {
      display: grid;
      grid-template-areas: ". sub";
      .sub-menu-links {
        grid-area: sub;
        opacity: 0.6;
      }
    }
  }
}
</style>
