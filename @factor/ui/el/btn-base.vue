<template>
  <button v-if="scope" :class="buttonClass" :type="type" v-on="$listeners">
    <span class="wrap-items">
      <span class="btn-content">
        <img v-if="image" :src="image" alt="btn image" />
        <slot />
        <span v-if="text" v-formatted-text="text" class="txt" />
      </span>
      <transition v-if="loading" name="fade">
        <div v-if="loading" class="waitload">
          <factor-loading-ring :class="circleClass" width="1.2em" />
        </div>
      </transition>
    </span>
  </button>
</template>

<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: { factorLoadingRing },
  props: {
    image: { type: String, default: "" },
    text: { type: String, default: "" },
    type: { type: String, default: "button" },
    loading: { type: Boolean, default: false },
    circle: { type: String, default: "" },
    btn: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: "" }
  },
  data() {
    return {
      backupCircleClass: "lightcolor"
    }
  },
  computed: {
    scope(this: any): boolean {
      return this.btn == "test" && !this.$testing.isTest ? false : true
    },
    buttonClass() {
      const btnClass = ["factor-btn", "factor-btn-load"]

      if (this.loading) {
        btnClass.push("loading")
      }

      if (this.image) {
        btnClass.push("with-img")
      }

      if (this.disabled) {
        btnClass.push("disabled")
      }

      if (this.btn) {
        btnClass.push(this.btn)
      } else {
        btnClass.push("default")
      }

      if (this.size) {
        btnClass.push(this.size)
      }

      return btnClass
    },
    circleClass(this: any): string {
      if (this.circle) {
        return this.circle
      }

      let out = "lightcolor"
      const dark = ["google", "default", "subtle"]

      dark.forEach(_ => {
        if (
          (this.$el && this.$el.classList.contains(_)) ||
          this.buttonClass.includes(_)
        ) {
          out = "darkcolor"
        }
      })

      return out
    }
  }
})
</script>

<style lang="less">
.factor-btn-load {
  transition: 0.2s all;
  position: relative;
  overflow: hidden;
  .wrap-items {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.with-img .btn-content {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      display: block;
      width: 1em;
      left: 1em;
      margin-right: 1em;
    }
  }

  .btn-content {
    transition: opacity 0.2s;
  }
  &.loading {
    .btn-content {
      opacity: 0;
    }
  }
  .waitload {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.factor-btn {
  -webkit-appearance: none;
  background: transparent;
  color: inherit;
  display: inline-block;
  margin-bottom: 0; // For input.btn
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  line-height: 1;
  font-size: 0.9em;
  &.disabled {
    cursor: not-allowed;
    pointer-events: none; // Future-proof disabling of clicks
    opacity: 0.6;
  }
}
</style>
