<template>
  <div
    ref="menuWrap"
    class="el-menu toggle"
    :class="toggle ? 'active' : 'not-active'"
    @click.stop
  >
    <div
      class="toggle-btn"
      :class="[toggleClass]"
      data-test="menu-toggle"
      @click="setToggle()"
    >
      <slot v-if="$slots.default" />
      <ElemIcon v-else icon="fas fa-ellipsis-h" />
    </div>
    <div v-if="toggle" class="toggle-content" :class="ddClass">
      <div
        v-for="(action, i) in normalizeList(list)"
        :key="i"
        class="toggle-item"
        :data-test="`menu-${action.value}`"
        @click.stop="sendEvent(action.value)"
      >
        {{ action.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { normalizeList } from "@factor/api"
import { computed, ref } from "vue"

import ElemIcon from "./ElemIcon.vue"

export default {
  components: { ElemIcon },
  props: {
    toggleClass: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    dropDirection: { type: String, default: "down" },
    itemKey: { type: [String, Number], default: "" },
  },
  emits: ["action"],
  setup(props, context) {
    const menuWrap = ref<boolean>(false)
    const toggle = ref<boolean>(false)

    /**
     * Set menu direction (up/down)
     */
    const ddClass = computed(() => {
      return "drop-" + props.dropDirection
    })
    /**
     * Get action value from menu item
     */
    const sendEvent = (value: string): void => {
      context.emit("action", value)
      toggle.value = false
    }
    /**
     * Toggle menu and set listeners
     */
    const setToggle = () => {
      // removeListener only works with named functions
      const clickHandler = () => {
        if (toggle.value) {
          toggle.value = false
          document.removeEventListener("click", clickHandler, false)
        }
      }

      if (!toggle.value) {
        toggle.value = true
        document.addEventListener("click", clickHandler, false)
      } else {
        toggle.value = false
        document.removeEventListener("click", clickHandler, false)
      }
    }

    return {
      menuWrap,
      toggle,
      ddClass,
      sendEvent,
      setToggle,
      normalizeList,
    }
  },
}
</script>
<style lang="less">
.el-menu {
  display: inline-block;
  position: relative;
  &:hover .toggle-btn {
    cursor: pointer;
  }
  &.active .toggle-btn {
    opacity: 0.5;
  }
  .toggle-content {
    user-select: none;
    position: absolute;
    top: 100%;
    bottom: auto;
    &.drop-up {
      bottom: 100%;
      top: auto;
    }

    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.4),
      0 6px 14px 0 rgba(24, 32, 41, 0.08), 0 12px 34px 0 rgba(24, 32, 41, 0.06);
    z-index: 100;
    font-weight: 600;
    width: 160px;
    background: var(--menu-el-bg, #fff);
    border-radius: 6px;
    left: 0;
    text-align: left;
    overflow: hidden;
    .toggle-item {
      padding: 0.5em 1em;
      border-bottom: 1px solid var(--menu-el-border, #eee);
      &:hover {
        background: var(--menu-el-hover, #f7f7f7);
        cursor: pointer;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
