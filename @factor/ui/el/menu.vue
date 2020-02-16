<template>
  <div ref="toggle" class="quick-menu toggle" :class="toggle? 'active': 'not-active'" @click.stop>
    <div class="toggle-btn" :class="[toggleClass ]" data-test="menu-toggle" @click="setToggle()">
      <slot v-if="$slots.default" />
      <factor-icon v-else icon="fas fa-ellipsis-h" />
    </div>
    <div v-if="toggle" class="toggle-content" :class="ddClass">
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
<script lang="ts">
import { factorIcon } from "@factor/ui"
import DOM from "jquery"
import { parseList } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorIcon },
  props: {
    toggleClass: { type: String, default: "" },
    list: { type: Array, default: () => [] },
    dropDirection: { type: String, default: "down" },
    itemKey: { type: [String, Number], default: "" }
  },
  data() {
    return {
      toggle: false,
      clickHandler: "",
      el: false
    }
  },
  computed: {
    ddClass(this: any) {
      return `drop-${this.dropDirection}`
    }
  },
  mounted() {
    this.el = this.$refs.toggle
  },
  methods: {
    parseList,
    sendEvent(this: any, value: string) {
      this.$emit("action", value)
      this.toggle = false
    },
    setToggle(this: any) {
      // removeListener only works with named functions

      this.clickHandler = () => {
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
    },
    nearBottom(this: any) {
      if (this.el && window.innerHeight - this.el.getBoundingClientRect().bottom < 150) {
        return true
      } else {
        return false
      }
    }
  }
})
</script>
<style lang="less">
.quick-menu {
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

    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.4), 0 6px 14px 0 rgba(24, 32, 41, 0.08),
      0 12px 34px 0 rgba(24, 32, 41, 0.06);
    z-index: 100;
    font-weight: 500;
    width: 200px;
    background: var(--menu-el-bg, #fff);
    border-radius: 6px;
    right: 0;
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
