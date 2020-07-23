<template>
  <div class="app-manager" :class="vis ? 'show-mobile' : 'standard'">
    <div class="manager-area manager-header">
      <slot v-if="$scopedSlots.head" name="head" />
      <manager-dropdown v-else />
      <mobile-toggle :vis.sync="vis" class="show-mobile" />
    </div>
    <div class="manager-area manager-content">
      <slot v-if="$scopedSlots.nav" name="nav" />
      <nav-area v-else v-bind="$attrs" />
    </div>
    <manager-dropdown
      v-if="!loading"
      class="manager-area manager-footer"
      :active="active == 'account'"
      :text="getUser(`displayName`)"
      direction="up"
      :menu="accountMenu()"
      @click="active = 'account'"
    >
      <template #icon>
        <factor-avatar :user="getUser()" />
      </template>
    </manager-dropdown>
  </div>
</template>

<script lang="ts">
import { userInitialized, currentUser } from "@factor/user"

import { factorAvatar } from "@factor/ui"
import { applyFilters } from "@factor/api"
export default {
  components: {
    navArea: () => import("./manager-nav.vue"),
    managerDropdown: () => import("./manager-dd.vue"),
    mobileToggle: () => import("./mobile-toggle.vue"),
    factorAvatar,
  },

  data() {
    return {
      mobileVisible: false,
      active: "",
      vis: false,
      loading: true,
    }
  },
  computed: {
    currentUser,
  },
  async mounted() {
    await userInitialized()

    this.loading = false
  },
  methods: {
    getUser(this: any, field: string) {
      if (!field) {
        return this.currentUser
      }
      return this.currentUser ? this.currentUser[field] : undefined
    },
    accountMenu(this: any) {
      return applyFilters("action-menu", [])
    },
  },
}
</script>
<style lang="less">
.app-manager {
  background: #fff;
  height: 100vh;
  display: grid;
  grid-template-rows: minmax(3rem, auto) 1fr minmax(4rem, auto);
  grid-gap: 1rem;
  overflow: auto;
  padding: 0.5rem;
  position: relative;
  border-right: 1px solid var(--panel-border-color);
  .manager-area {
    min-width: 0;
    padding: 3px; /* Fix overflow outside */
  }
  .manager-content {
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }

  .show-mobile {
    display: none;
  }
  @media (max-width: 900px) {
    height: auto;
    display: block;
    border-bottom: 1px solid var(--panel-border-color);
    .show-mobile {
      display: block;
    }
    .manager-header {
      display: grid;
      grid-template-columns: 1fr 5rem;
    }

    .manager-footer,
    .manager-content {
      display: none;
    }

    &.show-mobile {
      max-height: 90vh;
      border-bottom: none;
      box-shadow: var(--menu-shadow);
      display: grid;
      .manager-footer,
      .manager-content {
        display: block;
      }
    }
  }
}
</style>
