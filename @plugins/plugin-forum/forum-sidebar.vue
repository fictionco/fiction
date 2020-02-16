<template>
  <div class="forum-sidebar">
    <div class="new-discussion">
      <factor-link btn="primary" :path="`${setting('forum.indexRoute')}/add-new`">Start A Discussion</factor-link>
    </div>
    <div class="forum-nav">
      <div v-for="(item, index) in navItems" :key="index" class="nav-item">
        <factor-link
          class="menu-item-link"
          :path="setting(`forum.indexRoute`)"
          :query="{category: item.home ? null : item.id}"
        >
          <div class="item-icon">
            <nav-icon class="nav-icon" :icon="item.id" />
          </div>
          <div class="item-text">{{ toLabel(item.text || item.id) }}</div>
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
import { factorLink } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, navIcon: () => import("./el/nav-icon.vue") },
  data() {
    return {
      navItems: [
        {
          text: "All Discussions",
          id: "discussion",
          path: setting("forum.indexRoute"),
          home: true
        },
        {
          id: "support"
        },
        {
          id: "plugin"
        },
        {
          id: "themes"
        },
        {
          id: "feedback"
        },
        {
          id: "performance"
        },
        {
          id: "integrations"
        }
      ]
    }
  },
  methods: {
    setting,
    toLabel
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
