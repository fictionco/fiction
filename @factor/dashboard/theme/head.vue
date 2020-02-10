<template>
  <div class="dashboard-head">
    <div class="dashboard-head-pad">
      <div class="icon-nav" @click.stop>
        <div
          class="menu-factor menu-toggle"
          :class="toggle == 'on' && menuType == 'factor' ? 'open': 'closed'"
          @click="toggleNav(`toggle`, `factor`)"
        >
          <div v-if="toggle == 'on' && menuType == 'factor'" class="menu-items">
            <div v-for="(item, index) in dashboardMenu" :key="index" class="menu-item">
              <factor-link v-formatted-text="item.name" :path="item.path" class="menu-item-name" />
            </div>
          </div>
          <div class="menu-icon">
            <dashboard-icon icon="pin" />
          </div>
          <div v-if="toggle == 'on' && menuType == 'factor'" class="app-name">
            Factor JS
            <toggle-caret />
          </div>
        </div>
        <div
          class="menu-app menu-toggle"
          :class="toggle == 'on' && menuType == 'app' ? 'open': 'closed'"
          @click="toggleNav(`toggle`, `app`)"
        >
          <div v-if="toggle == 'on' && menuType == 'app'" class="menu-items">
            <div v-for="(item, index) in dashboardMenu" :key="index" class="menu-item">
              <factor-link v-formatted-text="item.name" :path="item.path" class="menu-item-name" />
            </div>
          </div>
          <div class="menu-icon">
            <dashboard-icon icon="globe" />
          </div>
          <div v-if="toggle == 'off' || (toggle == 'on' && menuType == 'app')" class="app-name">
            <span v-formatted-text="appName" class="name-text" />
            <toggle-caret />
          </div>
        </div>
      </div>
      <div class="filler" />
      <div class="nav">
        <slot />
        <div class="mobile-nav-toggle-wrap" @click.stop>
          <div
            class="mobile-nav-toggle"
            :class="toggle == 'on' && menuType == 'dashboard' ? 'active' : 'inactive'"
            @click="toggleNav(`toggle`, `dashboard`)"
          >
            <factor-avatar :post-id="getUser('avatar')" width="2rem" />

            <div class="bars">
              <div class="bar" />
              <div class="bar" />
              <div class="bar" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="toggle == 'on' && menuType == 'dashboard'"
        class="mobile-nav"
        :class="[`menu-panel-${menuType}`]"
      >
        <mobile-menu class="menu-panel" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorAvatar, factorLink } from "@factor/ui"
import { getDashboardMenu, dashboardSiteMenu } from "@factor/dashboard/menu"
import { setting, toLabel } from "@factor/api"
import { currentUser, isLoggedIn } from "@factor/user"
import Vue from "vue"
export default Vue.extend({
  components: {
    dashboardIcon: () => import("../el/logo.vue"),
    factorAvatar,
    factorLink,
    mobileMenu: () => import("./nav-mobile.vue"),
    toggleCaret: () => import("../el/caret.vue")
  },
  data() {
    return {
      toggle: "off",
      menuType: "menu"
    }
  },
  computed: {
    currentUser,
    iconUrl() {
      const rawIconPath = setting("app.icon")

      return typeof rawIconPath == "function" ? rawIconPath() : rawIconPath
    },
    appName(): string {
      return setting("app.name") ?? "No Name"
    },
    menu(this: any) {
      return getDashboardMenu(this.$route.path)
    },
    dashboardMenu(this: any) {
      return dashboardSiteMenu(this.$route.path, this.menuType)
    }
  },
  methods: {
    isLoggedIn,
    toLabel,

    getUser(this: any, field: string) {
      return this.currentUser ? this.currentUser[field] : undefined
    },
    toggleNav(this: any, toggle: "on" | "off" | "toggle", menuType: "dashboard" | "app") {
      if (!document) return

      const oldMenuType = this.menuType

      this.menuType = menuType

      if (toggle === "toggle") {
        this.toggle =
          !this.toggle || this.toggle == "off" || menuType !== oldMenuType ? "on" : "off"
      } else {
        this.toggle = toggle
      }

      this.clickHandler = () => {
        this.toggle = "off"
        document.removeEventListener("click", this.clickHandler, false)
      }

      if (this.toggle == "on") {
        document.addEventListener("click", this.clickHandler, false)
      } else {
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
})
</script>
<style lang="less">
.dashboard-head {
  position: relative;
  z-index: 10;
}
.mobile-nav {
  width: 325px;
  min-height: 4rem;
  position: absolute;
  right: 1rem;
  top: 0;
  z-index: 1;
  &.menu-panel-app,
  &.menu-panel-factor {
    left: 0;
    right: auto;
  }
  @media (max-width: 767px) {
    width: calc(~"100% - 1rem");
  }

  .menu-panel {
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
}

.mobile-nav-toggle-wrap {
  margin-left: 1rem;
  cursor: pointer;

  position: relative;
}
.mobile-nav-toggle {
  display: grid;
  grid-template-columns: auto 1rem;
  transition: all 0.2s;
  grid-gap: 0.5rem;
  .avatar {
    transition: all 0.2s;
  }
  .bars {
    display: flex;
    flex-direction: column;
    width: 1.5rem;
    height: 2rem;
    justify-content: center;
    position: relative;
    .bar {
      background: var(--panel-border-color);
      height: 0.25rem;
      width: 1rem;
      border-radius: 4px;
      left: 0%;
      position: absolute;
      transition: all 0.2s;

      &:first-child {
        transform: translateY(-8px);
      }
      &:last-child {
        transform: translateY(8px);
      }
    }
  }

  &.active {
    z-index: 10;
    .avatar {
      opacity: 0;
    }
    .bars {
      z-index: 10;
      width: 2rem;
      .bar {
        transform: translateY(0);
        margin: 0;
        width: 1.75rem;
      }
      .bar:first-child {
        transform: translateX(-50%) rotate(45deg);
      }
      .bar:nth-child(2) {
        transform: translateX(-50%) rotate(-45deg);
      }
      .bar:last-child {
        display: none;
      }
    }
  }
}

.dashboard-head-pad {
  padding: 0 1rem;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100%;

  .icon-nav {
    display: grid;
    grid-template-columns: min-content min-content;

    grid-gap: 1rem;
  }

  .menu-icon {
    display: block;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
      width: 70%;
      height: 70%;
      display: block;
      &.pin {
        transform: translate(-4%, -4%);
      }
      .icon-path {
        transition: fill 0.1s;
        fill: rgba(200, 204, 228, 1);
      }
    }
  }
  .menu-app,
  .menu-factor {
    padding: 0 0.25rem;
    color: inherit;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    background: #f6fafd;
    box-shadow: 0 0 0 1px var(--panel-border-color);
    border-radius: 5px;
    position: relative;
    .menu-items {
      position: absolute;
      width: 275px;
      min-height: 1rem;
      background: #fff;
      overflow: hidden;
      border-radius: 5px;
      box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1), 0 15px 35px 0 rgba(49, 49, 93, 0.1),
        0 5px 15px 0 rgba(0, 0, 0, 0.08);
      z-index: 5;
      top: -4px;
      left: -4px;
      padding-top: 2.5rem;
      .menu-item {
        margin: 0 1rem;

        user-select: none;
        &:last-child {
          margin-bottom: 1rem;
        }
        .menu-item-name {
          padding: 0.5rem 1.75rem;
          display: block;
          color: inherit;
          &:hover {
            background: #f6fafd;
            cursor: pointer;
          }
        }
      }
      @media (max-width: 900px) {
        padding-top: 3rem;
        .menu-item {
          font-size: 1.2em;
        }
      }
    }

    &.open {
      .menu-icon,
      .app-name {
        position: relative;
        z-index: 10;
      }
      .caret {
        transform: rotate(180deg);
      }
    }

    .app-name {
      user-select: none;
      padding-left: 0.25rem;
      padding-right: 0.5rem;
      font-weight: 700;
      transition: all 0.1s;
      white-space: nowrap;
      display: flex;
      align-items: center;
      cursor: pointer;
      .caret {
        margin-top: 3px;
        margin-left: 0.5rem;
        opacity: 0.45;
        transition: all 0.2s;
        width: 0.8rem;
      }
      &:hover {
        opacity: 0.7;
        color: inherit;
      }
    }
  }
  .nav {
    font-weight: var(--font-weight-bold);
    display: flex;
    align-items: center;
    justify-self: flex-end;
    @media (max-width: 767px) {
      flex-grow: 2;
      justify-content: flex-end;
    }
    > a {
      font-size: 0.9em;
      color: #506677;
      margin: 0 1em;
      @media (max-width: 767px) {
        margin: 0 1em;
        .fa {
          display: none;
        }
      }
      &:hover,
      &.active {
        color: #0471ff;
      }
      &:active {
        color: #ff0076;
      }
    }
    .account-menu {
      margin-left: 1em;
    }

    .nav-dropdown-toggle {
      padding: 4px 6px;
      font-weight: 500;
      border-radius: 4px;
      &.active,
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>
