<template>
  <div class="dashboard-head">
    <div class="dashboard-head-pad">
      <factor-link path="/" class="brand">
        <div class="icon">
          <img :src="iconUrl" alt="Dashboard Icon" />
        </div>
        <div class="name">{{ appName }}</div>
      </factor-link>
      <div class="nav">
        <slot />
        <account-menu />
        <div class="mobile-nav-toggle-wrap" @click.stop>
          <div
            class="mobile-nav-toggle"
            :class="toggle ? 'active' : 'inactive'"
            @click="toggleNav()"
          >
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        </div>
      </div>
      <div v-if="toggle" class="mobile-nav">
        <div class="mobile-nav-content">
          <dashboard-nav />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { accountMenu } from "@factor/dashboard"
import { setting } from "@factor/api"

import Vue from "vue"
export default Vue.extend({
  components: { factorLink, accountMenu, dashboardNav: () => import("./nav.vue") },
  data() {
    return {
      toggle: false
    }
  },
  computed: {
    iconUrl() {
      return setting("app.icon")
    },
    appName() {
      return setting("app.name")
    }
  },
  methods: {
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

.mobile-nav-toggle {
  display: flex;
  flex-direction: column;
  width: 1.75rem;
  height: 2rem;
  justify-content: center;
  .bar {
    background: var(--panel-border-color);
    height: 3px;

    width: 1.75rem;
    border-radius: 4px;

    position: absolute;
    transition: all 0.2s;
    &:first-child {
      transform: translateY(-8px);
    }
    &:last-child {
      transform: translateY(8px);
    }
  }
  &.active {
    .bar {
      transform: translateY(0);
      margin: 0;
      position: absolute;
    }
    .bar:first-child {
      transform: rotate(45deg);
    }
    .bar:nth-child(2) {
      transform: rotate(-45deg);
    }
    .bar:last-child {
      display: none;
    }
  }
}

.mobile-nav-toggle-wrap {
  margin-left: 1rem;
  cursor: pointer;
  display: none;
  position: relative;
  z-index: 1000;
  @media (max-width: 960px) {
    display: block;
  }
}

.mobile-nav {
  width: 100%;

  position: absolute;
  left: 0;
  top: 0;
  .mobile-nav-content {
    margin: 0.25rem 0.5rem;
    min-height: 100px;

    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1), 0 15px 35px 0 rgba(49, 49, 93, 0.1),
      0 5px 15px 0 rgba(0, 0, 0, 0.08);
    padding: 1rem;
  }
}

// .app-wrap {
//   .mobile-nav {
//     display: none;

//     @media (max-width: 960px) {
//       &.toggle-nav {
//         display: block;
//       }
//       display: block;
//       position: fixed;
//       width: 270px;

//       padding: 1.5em;
//       top: 0;
//       bottom: 0;
//       left: 0;
//       min-height: 100vh;
//       z-index: 100;

//       overflow-y: scroll;
//       background: #fff;
//       box-shadow: var(--pane-shadow);
//       &.active {
//         transform: translate3d(0, 0, 0);
//       }
//     }
//   }
// }

.dashboard-head-pad {
  padding: 0 1rem;
  align-items: center;
  display: flex;
  justify-content: space-between;
  height: 100%;
  .brand {
    display: flex;
    flex-grow: 1;
    align-items: center;
    color: inherit;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.9;
      color: inherit;
    }
    .icon {
      margin-right: 0.5em;
      display: block;
      width: 2rem;
      img {
        width: 100%;
        display: block;
        border-radius: 5px;
        box-shadow: 0 2px 5px 0 rgba(60, 66, 87, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.07);
      }
    }
    .name {
      font-weight: var(--font-weight-bold);
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
