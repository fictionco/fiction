<template>
  <div class="mobile-nav-toggle-wrap" @click.stop>
    <div
      class="mobile-nav-toggle"
      :class="vis ? 'active' : 'inactive'"
      @click="toggleNav()"
    >
      <factor-avatar :user="getUser()" />

      <div class="bars">
        <div class="bar" />
        <div class="bar" />
        <div class="bar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorAvatar } from "@factor/ui"

import { currentUser } from "@factor/user"
export default Vue.extend({
  components: { factorAvatar },
  props: {
    vis: { type: Boolean, default: false },
  },
  data() {
    return {
      active: "",
    }
  },
  computed: { currentUser },
  methods: {
    getUser(this: any, field: string) {
      if (!field) {
        return this.currentUser
      }
      return this.currentUser ? this.currentUser[field] : undefined
    },

    toggleNav(this: any, toggle: boolean | undefined) {
      if (!document) return

      if (typeof toggle == "undefined") {
        this.$emit("update:vis", !this.vis)
      } else {
        this.$emit("update:vis", toggle)
      }

      /**
       * A setTimeout is needed because synced parameters are not sync'd
       * This causes inconsistent behavior
       */
      setTimeout(() => {
        this.clickHandler = () => {
          this.$emit("update:vis", false)
          document.removeEventListener("click", this.clickHandler)
        }

        if (this.vis) {
          document.addEventListener("click", this.clickHandler)
        } else {
          document.removeEventListener("click", this.clickHandler)
        }
      }, 100)
    },
  },
})
</script>
<style lang="less">
.mobile-nav-toggle-wrap {
  justify-self: center;
  align-self: center;
}
.mobile-nav-toggle {
  display: grid;
  grid-template-columns: auto 1rem;
  transition: all 0.2s;
  grid-gap: 0.5rem;
  .avatar {
    transition: all 0.2s;
    width: 2.25rem;
  }

  .bars {
    display: flex;
    flex-direction: column;
    width: 1.5rem;
    height: 2rem;
    justify-content: center;
    position: relative;
    align-self: center;
    .bar {
      background: var(--panel-border-color);
      height: 0.25rem;
      width: 1.25rem;
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
</style>
