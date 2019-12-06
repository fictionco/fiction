<template>
  <div class="notifications">
    <div class="notify-toast toasty">
      <transition-group name="notification-top">
        <div v-for="e in notification" :key="e.time" class="toast">
          <div v-formatted-text="e.message" class="tx" />
        </div>
      </transition-group>
    </div>
    <div class="error-toast toasty">
      <transition-group name="notification-bottom">
        <div v-for="e in errors" :key="e.time" class="toast">
          <div v-formatted-text="e.message" class="tx" />
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script lang="ts">
import { onEvent } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      errors: [],
      notification: []
    }
  },
  computed: {
    notifications() {
      return this.errors.slice(0).reverse()
    }
  },
  mounted() {
    onEvent("notify", ({ type, message = "", duration = 4000 }) => {
      const time = +new Date()
      if (type == "error") {
        this.errors.push({ time, message })
        setTimeout(() => {
          this.errors.shift()
        }, duration)
      } else if (type == "notify") {
        this.notification.push({ time, message })
        setTimeout(() => {
          this.notification.shift()
        }, duration)
      }
    })
  }
})
</script>

<style lang="less">
.toasty {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  max-width: 375px;
  width: 90%;
  z-index: 1100;
  transition: transform 0.4s ease 0s;

  .toast {
    letter-spacing: -0.03em;

    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0496ff;
    color: #fff;
    border-radius: 6px;
    text-align: center;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 6px 14px 0 rgba(24, 32, 41, 0.12),
      0 12px 34px 0 rgba(24, 32, 41, 0.08);
    margin-bottom: 1em;
    .tx {
      flex-grow: 1;
      padding: 1em;
    }
  }
}
.notify-toast {
  top: 10px;
  .toast {
    background: #0496ff;
    //color: #0496ff;
  }
}
.error-toast {
  bottom: 10px;
  .toast {
    background: #ff0076;
  }
}
</style>
