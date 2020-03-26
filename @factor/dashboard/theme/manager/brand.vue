<template>
  <div class="manager-brand" @click.stop>
    <factor-link
      class="manager-brand-pad"
      :path="mode == 'brand' ? currentUrl() : ''"
      @click="toggle()"
    >
      <div class="menu-grid-item menu-media">
        <factor-avatar v-if="mode == 'account'" :user="getUser()" />
        <div v-else class="app-brand" :style="brandBackground" />
      </div>
      <div class="menu-grid-item menu-name">
        <div class="name">{{ menuName }}</div>
        <div v-if="menuSubName" class="sub">{{ menuSubName }}</div>
      </div>
      <div class="menu-grid-item action-icon">
        <factor-icon
          v-if="mode == 'account'"
          :icon="`fas fa-angle-up`"
          :class="active ? 'down': 'up'"
        />
      </div>
    </factor-link>

    <transition name="slide-up">
      <div v-if="active" class="slide-menu">
        <factor-link
          v-for="(item, i) in actionMenu"
          :key="i"
          class="item"
          :path="getDashboardRoute(item.path)"
          :query="item.query"
          @click="item.click ? item.click(): ''; active = false"
        >{{ item.name }}</factor-link>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { getDashboardRoute } from "@factor/dashboard"
import { factorAvatar, factorIcon, factorLink } from "@factor/ui"
import { setting, applyFilters, productionUrl, currentUrl, toLabel } from "@factor/api"
import { currentUser } from "@factor/user"
export default Vue.extend({
  components: {
    factorAvatar,
    factorIcon,
    factorLink
  },
  props: {
    mode: { type: String, default: "brand" }
  },
  data() {
    return { active: false }
  },
  computed: {
    currentUser,
    actionMenu(this: any) {
      return applyFilters("action-menu", [])
    },
    brandBackground(this: any) {
      const iconSetting = setting(`app.icon`)

      const icon = typeof iconSetting == "function" ? iconSetting() : iconSetting

      return {
        backgroundImage: `url(${icon})`
      }
    },
    menuName(this: any) {
      if (this.mode == "brand") {
        return setting("app.name") || "Factor"
      } else {
        return this.getUser("displayName")
      }
    },
    menuSubName(this: any) {
      if (this.mode == "account") {
        return toLabel(this.getUser("role"))
      } else {
        return productionUrl({ domainOnly: true })
      }
    }
  },
  methods: {
    currentUrl,
    setting,
    toLabel,
    getDashboardRoute,
    escapeHandler(e: KeyboardEvent) {
      if (e.keyCode === 27) {
        this.close()
      }
    },
    clickHandler: function() {
      this.close()
    },
    toggle(this: any) {
      if (this.mode == "brand") {
        this.$router.push({ path: "/" })
      } else {
        this.active = !this.active
        this.toggleActive()
      }
    },
    close(this: any) {
      this.active = false
    },
    toggleActive(this: any) {
      if (this.active) {
        setTimeout(() => {
          window.addEventListener("keydown", this.escapeHandler)
          window.addEventListener("click", this.clickHandler)
        }, 200)
      } else {
        window.removeEventListener("keydown", this.escapeHandler)
        window.removeEventListener("click", this.clickHandler)
      }
    },
    getUser(this: any, field: string) {
      if (!field) {
        return this.currentUser
      }
      return this.currentUser ? this.currentUser[field] : undefined
    }
  }
})
</script>
<style lang="less">
.manager-brand {
  position: relative;
  --panel-movement: cubic-bezier(0.52, 0.01, 0.16, 1);
  perspective: 100px;
  .slide-up-enter-active,
  .slide-up-leave-active {
    transform-origin: 0 100%;
    transition: all 0.2s var(--panel-movement);
  }
  .slide-up-enter,
  .slide-up-leave-to {
    transform: translateY(10px);
    opacity: 0;
  }
  .slide-up-enter-to,
  .slide-up-leave {
    transform: translateY(0px);
    opacity: 1;
  }

  .slide-menu {
    transform-origin: 0 100%;
    position: absolute;
    bottom: 100%;
    width: 100%;

    padding: 1rem;
    will-change: margin;
    z-index: 100;
    background: #fff;
    box-shadow: var(--menu-shadow);
    border-radius: 5px;
    .factor-link {
      display: block;
      cursor: pointer;
      color: inherit;
      padding: 0.5rem;
      border-radius: 5px;
      margin: 2px 0;
      &:hover {
        background-color: var(--color-bg-highlight);
      }
      &.active-path {
        background-color: var(--color-bg-contrast);
      }
    }
  }
  .manager-brand-pad {
    cursor: pointer;
    color: inherit;
    border-radius: 5px;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 2rem 1fr 1rem;
    padding: 0.4rem 0.5rem;
    align-items: center;

    .menu-grid-item {
      min-width: 0;
    }
    .action-icon {
      text-align: right;
      opacity: 0.4;
      svg {
        width: 1.2rem;
      }
      .factor-icon {
        transition: 0.2s all;
      }
      .factor-icon.down {
        transform: rotateZ(180deg);
      }
    }
    &:hover {
      background-color: var(--color-bg-contrast);
      .action-icon {
        opacity: 1;
      }
    }
    .menu-name {
      user-select: none;
      .name {
        font-size: 1em;
        font-weight: var(--font-weight-bold);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .sub {
        opacity: 0.5;
        font-size: 12px;
      }
    }
    .menu-media {
      .avatar {
        width: 2.25rem;
        .thumb {
          border-radius: 5px;
        }
      }
      .app-brand {
        background-color: #fff;
        background-size: cover;
        background-position: 50%;
        box-shadow: var(--box-shadow-input);
        border-radius: 5px;
        width: 2.25rem;
        height: 2.25rem;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          display: block;
          width: 1.3rem;
          height: 1.3rem;
          margin: -0.1rem 0 0 -0.1rem;
          .icon-path {
            fill: var(--color-text);
          }
        }
      }
    }
  }
}
</style>


