<template>
  <div :style="barStyle" class="progress" :class="canSuccess ? 'working' : 'failed'" />
</template>
<script lang="ts">
import { onEvent } from "@factor/api/events"
import Vue from "vue"
export default Vue.extend({
  name: "SsrBar",
  data() {
    return {
      percent: 0,
      show: false,
      canSuccess: true,
      duration: 3000,
      height: "3px"
    }
  },
  computed: {
    barStyle(this: any) {
      return {
        width: `${this.percent}%`,
        height: this.height,
        opacity: this.show ? 1 : 0
      }
    }
  },
  mounted() {
    onEvent("ssr-progress", (action: string) => {
      this[action]()
    })
  },
  methods: {
    start(this: any) {
      this.show = true
      this.canSuccess = true
      if (this._timer) {
        clearInterval(this._timer)
        this.percent = 0
      }
      this._cut = 10000 / Math.floor(this.duration)
      this._timer = setInterval(() => {
        this.increase(this._cut * Math.random())
        if (this.percent > 95) {
          this.finish()
        }
      }, 100)
      return this
    },
    set(this: any, num: number) {
      this.show = true
      this.canSuccess = true
      this.percent = Math.floor(num)
      return this
    },
    get(this: any) {
      return Math.floor(this.percent)
    },
    increase(this: any, num: number) {
      this.percent = this.percent + Math.floor(num)
      return this
    },
    decrease(this: any, num: number) {
      this.percent = this.percent - Math.floor(num)
      return this
    },
    finish(this: any) {
      this.percent = 100
      this.hide()
      return this
    },
    pause(this: any) {
      clearInterval(this._timer)
      return this
    },
    hide(this: any) {
      clearInterval(this._timer)
      this._timer = null
      setTimeout(() => {
        this.show = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.percent = 0
          }, 200)
        })
      }, 500)
      return this
    },
    fail(this: any) {
      this.canSuccess = false
      return this
    }
  }
})
</script>

<style lang="less">
.progress {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 5px;
  width: 0%;
  transition: width 0.2s, opacity 0.4s;
  opacity: 1;
  background-color: var(--color-primary);
  z-index: 999999;
  &.failed {
    background-color: var(--color-secondary);
  }
}
</style>
