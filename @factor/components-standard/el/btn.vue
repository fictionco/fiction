<template>
  <button v-if="scope" :class="buttonClass" :type="type" v-on="$listeners">
    <span class="wrap-items">
      <span class="btn-content">
        <img v-if="image" :src="image">
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

<script>
export default {
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
    scope() {
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
    circleClass() {
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
}
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
  display: inline-block;
  margin-bottom: 0; // For input.btn
  user-select: none;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  padding: 0.5em 1em;
  font-size: 14px;
  line-height: 1;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
    0 2px 5px 0 rgba(43, 45, 80, 0.08), 0 1px 1.5px 0 rgba(0, 0, 0, 0.07),
    0 1px 2px 0 rgba(0, 0, 0, 0.08);
  color: #506677;
  transition: 0.15s all;
  opacity: 0.95;
  &.tiny {
    font-size: 11px;
    padding: 2px 4px;
    font-weight: 500;
  }
  &.small {
    font-size: 12px;
    padding: 0.35em 0.75em;
  }
  &.large {
    font-size: 1.2em;
  }
  &.disabled {
    cursor: not-allowed;
    pointer-events: none; // Future-proof disabling of clicks
    opacity: 0.6;
  }

  &.subtle {
    box-shadow: none;
    opacity: 0.6;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-0.5px);
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
      0 2.5px 5px 0 rgba(43, 45, 80, 0.08), 0 1.5px 1.5px 0 rgba(0, 0, 0, 0.07),
      0 1.5px 2px 0 rgba(0, 0, 0, 0.08);
  }
  &:active {
    opacity: 0.8;
    transition: 0s all;
  }
  &.primary {
    color: hsla(0, 0%, 100%, 0.9);
    background: #0496ff;
    box-shadow: 0 0 0 1px #0496ff, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
      0 2px 5px 0 rgba(43, 45, 80, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08),
      0 0 0 0 transparent;
    &:hover {
      color: #fff;
      box-shadow: 0 0 0 1px #0496ff, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
        0 2.5px 5px 0 rgba(43, 45, 80, 0.1), 0 1.5px 2px 0 rgba(0, 0, 0, 0.08),
        0 0 0 0 transparent;
    }
  }
  &.secondary {
    color: hsla(0, 0%, 100%, 0.9);
    background: #ff0076;
    box-shadow: 0 0 0 1px #ff0076, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
      0 2px 5px 0 rgba(43, 45, 80, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08),
      0 0 0 0 transparent;
    &:hover {
      color: #fff;
      box-shadow: 0 0 0 1px #ff0076, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
        0 2.5px 5px 0 rgba(43, 45, 80, 0.1), 0 1.5px 2px 0 rgba(0, 0, 0, 0.08),
        0 0 0 0 transparent;
    }
  }
  &.selected {
    color: hsla(0, 0%, 100%, 0.9);
    background: #506677;
    box-shadow: 0 0 0 1px #506677, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
      0 2px 5px 0 rgba(43, 45, 80, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08),
      0 0 0 0 transparent;
    &:hover {
      color: #fff;
      box-shadow: 0 0 0 1px #506677, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
        0 2.5px 5px 0 rgba(43, 45, 80, 0.1), 0 1.5px 2px 0 rgba(0, 0, 0, 0.08),
        0 0 0 0 transparent;
    }
  }
  + .factor-btn,
  + .is-btn {
    margin-left: 0.5em;
  }
}
.is-btn + .factor-btn,
.is-btn + .is-btn {
  margin-left: 0.5em;
}
</style>
