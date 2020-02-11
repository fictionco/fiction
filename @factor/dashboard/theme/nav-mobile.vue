<template>
  <div class="mobile-nav-content">
    <div class="user-menu menu-area">
      <factor-avatar :post-id="getUser('avatar')" width="2rem" />
      <div class="content" :data-uid="getUser('_id')">
        <div class="name">{{ getUser('displayName') || getUser('email') }}</div>
        <div v-if="getUser('role')" class="name-sub">
          <span class="status">{{ toLabel(getUser('role')) }}</span>
        </div>
      </div>
    </div>
    <div class="nav-menus">
      <template v-for="(area, index) in ['account', 'dashboard', 'admin', 'action']">
        <div
          v-if="menu[area] && menu[area].length > 0"
          :key="index"
          class="menu-area"
          :class="area"
        >
          <div v-if="area != 'action' && area != 'account'" class="area-title">{{ toLabel(area) }}</div>
          <div class="menu-area-items">
            <template v-for="(primary, key) in menu[area]">
              <factor-link
                :key="key"
                :path="primary.path"
                :query="primary.query"
                :action="primary.action"
                class="menu-item-link"
                :class="primary.active ? 'active': 'not-active'"
                @click="(primary.click) ? primary.click() : ''"
              >
                <div class="item-icon">
                  <img class :src="primary.icon || defaultIcon" :alt="`${primary.name} Icon`" />
                </div>
                <div class="item-text">
                  <span v-formatted-text="primary.name" />
                </div>
              </factor-link>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { toLabel } from "@factor/api"
import { factorLink, factorAvatar } from "@factor/ui"
import { getDashboardMenu } from "@factor/dashboard/menu"
import { currentUser } from "@factor/user"
import Vue from "vue"
import { Route } from "vue-router"
export default Vue.extend({
  components: {
    factorLink,
    factorAvatar
  },
  data() {
    return {
      menu: {},
      loading: false
    }
  },
  computed: {
    currentUser
  },
  watch: {
    $route: function(this: any, to: Route, from: Route) {
      if (to.path != from.path) {
        this.setMenu()
      }
    }
  },
  async mounted() {
    this.loading = true
    await this.setMenu()
    this.loading = false
  },
  methods: {
    toLabel,

    getUser(this: any, field: string) {
      return this.currentUser ? this.currentUser[field] : undefined
    },
    async setMenu(this: any) {
      this.menu = await getDashboardMenu(this.$route.path)
    }
  }
})
</script>

<style lang="less">
.mobile-nav-content {
  .user-menu {
    padding-right: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0.5rem;
    .avatar {
      width: 2rem;
    }
    .content {
      .name {
        font-weight: bold;
      }
      .name-sub {
        opacity: 0.7;
      }
    }
  }
  .menu-area {
    font-size: 1.2em;
    padding: 1rem 1.5rem;

    &.action {
      border-top: 1px solid rgba(136, 152, 170, 0.2);
    }
    &.account {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: none;
    }
    .area-title {
      margin-bottom: 0.5rem;
      font-weight: var(--font-weight-bold);
    }

    @media (min-width: 961px) {
      &.dashboard,
      &.admin {
        display: none;
      }
    }
  }
  .menu-area-items {
    display: grid;
    grid-template-columns: 1fr;

    .menu-item-link {
      display: grid;
      grid-template-columns: 1rem 1fr;
      grid-gap: 0.5rem;
      color: inherit;
      padding: 0.5rem 0.75rem;
      transition: all 0.2s;
      border-radius: 6px;
      margin-left: -0.75rem;
      margin-right: -0.75rem;
      &:hover,
      &.active {
        background: #f6fafd;
      }
    }
  }
}
</style>
