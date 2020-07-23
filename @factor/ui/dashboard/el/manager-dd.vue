<template>
  <div class="manager-dropdown" @click.stop>
    <div class="manager-dropdown-pad" @click="toggle()">
      <div class="menu-grid-item menu-media">
        <template v-if="$scopedSlots.icon">
          <slot name="icon" />
        </template>

        <div v-else class="app-brand" :style="iconBackground" />
      </div>
      <div class="menu-grid-item menu-name">
        <div class="name">{{ text }}</div>
      </div>
      <div class="menu-grid-item action-icon">
        <factor-icon
          :icon="`fas fa-angle-up`"
          :class="(direction == 'up' && !active) || (active && direction == 'down') ? 'up' : 'down'"
        />
      </div>
    </div>

    <transition :name="`slide-${direction}`">
      <div v-if="active" class="slide-menu" :class="direction">
        <template v-if="$scopedSlots.menu">
          <slot name="menu" />
        </template>
        <template v-if="menu.length > 0">
          <factor-link
            v-for="(item, i) in menu"
            :key="i"
            class="item"
            :path="item.path"
            :query="item.query"
            @click="handleItemClick(item)"
          >{{ item.name }}</factor-link>
        </template>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { factorIcon, factorLink } from "@factor/ui"
import { setting, toLabel } from "@factor/api"
import { currentUser } from "@factor/user"
const iconSetting = setting(`app.icon`)

const appIcon = typeof iconSetting == "function" ? iconSetting() : iconSetting

interface ActionMenuItem {
  path?: string
  click?: () => any
  query?: any
  name: string
}
export default {
  components: {
    factorIcon,
    factorLink,
  },
  props: {
    direction: { type: String, default: "down" },
    text: { type: String, default: "" },
    icon: { type: String, default: appIcon },
    menu: { type: Array, default: () => [] },
  },
  data() {
    return { active: false }
  },
  computed: {
    currentUser,

    iconBackground(this: any) {
      return {
        backgroundImage: `url(${this.icon})`,
      }
    },
  },
  methods: {
    toLabel,
    handleItemClick(this: any, item: ActionMenuItem) {
      item.click ? item.click() : ""
      this.active = false

      document.body.click()
    },
    escapeHandler(e: KeyboardEvent) {
      if (e.keyCode === 27) {
        this.close()
      }
    },
    clickHandler: function () {
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
  },
}
</script>
<style lang="less">
.manager-dropdown {
  position: relative;
  --panel-movement: cubic-bezier(0.52, 0.01, 0.16, 1);
  perspective: 100px;
  .slide-down-enter-active,
  .slide-down-leave-active,
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
  .slide-down-enter,
  .slide-down-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
  .slide-up-enter-to,
  .slide-up-leave,
  .slide-down-enter-to,
  .slide-down-leave {
    transform: translateY(0px);
    opacity: 1;
  }

  .slide-menu {
    transform-origin: 0 100%;
    position: absolute;
    top: 100%;
    bottom: auto;
    &.up {
      bottom: 100%;
      top: auto;
    }

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
  .manager-dropdown-pad {
    cursor: pointer;
    color: inherit;
    border-radius: 5px;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 2rem 1fr 1rem;
    padding: 0.4rem 0.5rem;
    align-items: center;
    box-shadow: 0 0 0 1px var(--color-border);
    .menu-grid-item {
      min-width: 0;
    }
    .action-icon {
      text-align: center;
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
        width: 2rem;
        .thumb {
          border-radius: 5px;
        }
      }
      .app-brand {
        background-color: #fff;
        background-size: cover;
        background-position: 50%;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
        border-radius: 5px;
        width: 2rem;
        height: 2rem;
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
