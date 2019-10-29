<template>
  <div class="quick-menu toggle" :class="toggle? 'active': 'not-active'" @click.stop>
    <div class="toggle-btn" :class="toggleClass" data-test="menu-toggle" @click="setToggle()">
      <factor-icon icon="ellipsis-h" />
    </div>
    <div v-if="toggle" class="toggle-content">
      <div
        v-for="(action, i) in parseList(list)"
        :key="i"
        class="toggle-item"
        :data-test="`menu-${action.value}`"
        @click.stop="sendEvent(action.value)"
      >{{ action.name }}</div>
    </div>
  </div>
</template>
<script>
import { DOM, parseList } from "@factor/tools"
export default {
  props: {
    toggleClass: { type: String, default: "" },
    list: { type: Array, default: () => [] },

    itemKey: { type: [String, Number], default: "" }
  },
  data() {
    return {
      toggle: false,
      clickHandler: ""
    }
  },
  methods: {
    parseList,
    sendEvent(value) {
      this.$emit("action", value)
      this.toggle = false
    },
    setToggle() {
      // removeListener only works with named functions
      const that = this
      this.clickHandler = e => {
        if (this.toggle) {
          this.toggle = false
          document.removeEventListener("click", this.clickHandler, false)
        }
      }

      if (!this.toggle) {
        DOM("body").click()
        this.toggle = true

        document.addEventListener("click", this.clickHandler, false)
      } else {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
}
</script>
<style lang="less">
.quick-menu {
  display: inline-block;
  position: relative;
  &:hover .toggle-btn {
    cursor: pointer;
  }
  &.active .toggle-btn {
  }
  .toggle-content {
    position: absolute;
    bottom: 100%;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3), 0 6px 14px 0 rgba(24, 32, 41, 0.06),
      0 12px 34px 0 rgba(24, 32, 41, 0.04);
    z-index: 100;
    font-weight: 500;
    width: 200px;
    background: #fff;
    border-radius: 4px;
    right: 0;
    text-align: left;
    .toggle-item {
      padding: 0.5em 1em;
      border-bottom: 1px solid #eee;
      &:hover {
        background: #f7f7f7;
        cursor: pointer;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>