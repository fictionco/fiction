<template>
  <div class="dashboard-head">
    <div class="dashboard-head-pad">
      <factor-link path="https://factor.dev" class="factor-docs">
        <div class="icon">
          <dashboard-icon></dashboard-icon>
        </div>
      </factor-link>
      <factor-link path="/" class="brand">
        <div class="name">
          {{ appName }}
          <span class="arrow">&rarr;</span>
        </div>
      </factor-link>
      <div class="nav">
        <slot />
        <div class="mobile-nav-toggle-wrap" @click.stop>
          <div
            class="mobile-nav-toggle"
            :class="toggle ? 'active' : 'inactive'"
            @click="toggleNav()"
          >
            <factor-avatar :post-id="getUser('avatar')" width="2rem" />

            <div class="bars">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="toggle" class="mobile-nav">
        <mobile-menu />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink, factorAvatar } from "@factor/ui"
import { getDashboardMenu } from "@factor/dashboard/menu"
import { setting, toLabel } from "@factor/api"
import { currentUser, isLoggedIn } from "@factor/user"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    dashboardIcon: () => import("../el/logo.vue"),
    factorAvatar,
    mobileMenu: () => import("./nav-mobile.vue")
  },
  data() {
    return {
      toggle: false
    }
  },
  computed: {
    currentUser,
    iconUrl() {
      return setting("app.icon")
    },
    appName(): string {
      return setting("app.name")
    },
    menu(this: any) {
      return getDashboardMenu(this.$route.path)
    }
  },
  methods: {
    isLoggedIn,
    toLabel,
    getUser(this: any, field: string) {
      return this.currentUser ? this.currentUser[field] : undefined
    },
    toggleNav(this: any, toggle?: boolean) {
      if (!document) return

      if (typeof toggle == "undefined") {
        this.toggle = !this.toggle
      } else {
        this.toggle = toggle
      }

      this.clickHandler = () => {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      }

      if (this.toggle) {
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
  position: absolute;
  right: 0;
  top: 0;
  @media (max-width: 767px) {
    width: 100%;
  }
}

.mobile-nav-toggle-wrap {
  margin-left: 1rem;
  cursor: pointer;

  position: relative;
  z-index: 1000;
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
    .avatar {
      opacity: 0;
    }
    .bars {
      width: 2rem;
      .bar {
        transform: translateY(0);
        margin: 0;
        position: absolute;
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
  grid-template-columns: 1fr minmax(150px, 1fr) 1fr;
  height: 100%;
  .factor-docs {
    .icon {
      margin-right: 1rem;
      display: block;
      width: 2rem;
      height: 2rem;
      box-shadow: 0 0 0 1px var(--panel-border-color);
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f6fafd;
      transition: all 0.1s;
      svg.pin {
        width: 70%;
        height: 70%;
        display: block;
        transform: translate(-4%, -4%);
        .pin-path {
          transition: fill 0.1s;
          fill: rgba(200, 204, 228, 1);
        }
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .brand {
    color: inherit;
    transition: opacity 0.2s;
    text-align: center;
    &:hover {
      opacity: 0.9;
      color: inherit;
    }

    .name {
      font-weight: var(--font-weight-bold);
      .arrow {
        opacity: 0.4;
        transition: all 0.2s;
      }
      &:hover {
        .arrow {
          margin-left: 3px;
        }
      }
    }
  }
  .nav {
    font-weight: var(--font-weight-bold);
    display: flex;
    align-items: center;
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
        color: #0496ff;
      }
      &:active {
        color: #ff0076;
      }
    }
    .account-menu {
      margin-left: 1em;
      // .avatar {
      //   background-color: rgba(38, 67, 89, 0.06);
      // }
    }
    // > a,
    // .nav-dropdown {
    //   margin-left: 0.5em;
    // }
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
