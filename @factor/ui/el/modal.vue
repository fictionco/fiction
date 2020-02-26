<template>
  <transition name="scaleInModal">
    <div v-if="vis && appended" class="el-modal" :class="modalClass" data-test="modal-window">
      <div class="el-modal-wrap">
        <div v-show="vis" class="el-modal-content" @click.stop>
          <div class="el-modal-pad modal-content" data-test="modal-content">
            <span class="close" @click.stop="close">
              <factor-icon icon="fas fa-times" />
            </span>
            <div class="modal-text">
              <div class="modal-text-content">
                <div v-if="title" class="modal-header">
                  <h3 class="title">{{ title }}</h3>
                  <div class="sub-title">{{ sub }}</div>
                </div>

                <slot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { factorIcon } from "@factor/ui"
import { emitEvent } from "@factor/api/events"
import Vue from "vue"
import { Route } from "vue-router"
export default Vue.extend({
  components: { factorIcon },
  inheritAttrs: false,
  props: {
    vis: { type: Boolean, default: false },
    title: { type: String, default: "" },
    sub: { type: String, default: "" },
    modalClass: { type: String, default: "" }
  },
  data() {
    return {
      appended: false
    }
  },
  watch: {
    $route(this: any, to: Route, from: Route) {
      if (to.path != from.path && this.vis) {
        this.$emit("update:vis", false)
      }
    },
    vis: function(this: any, v: boolean) {
      this.handleCloseEvents(v)
      emitEvent("modal", v)
    }
  },
  mounted() {
    this.$nextTick(() => {
      // Append to Body
      this.$el.parentNode.removeChild(this.$el)
      const appEl = document.querySelector("#app")
      if (appEl) {
        appEl.append(this.$el)
      }

      this.appended = true
    })
  },
  methods: {
    escapeHandler(e: KeyboardEvent) {
      if (e.keyCode === 27) {
        this.close()
        window.removeEventListener("keydown", this.escapeHandler)
      }
    },
    clickHandler() {
      this.close()
      window.removeEventListener("click", this.clickHandler)
    },
    close: function(this: any) {
      this.$emit("update:vis", false)
      this.$emit("close")
    },
    handleCloseEvents(visible: boolean) {
      if (visible) {
        setTimeout(() => {
          window.addEventListener("keydown", this.escapeHandler)
          window.addEventListener("click", this.clickHandler)
        }, 200)
      } else {
        window.removeEventListener("keydown", this.escapeHandler)
        window.removeEventListener("click", this.clickHandler)
      }
    }
  }
})
</script>
<style lang="less">
.scaleInModal-enter-active,
.scaleInModal-leave-active {
  transition: all 0.3s ease;
  .el-modal-pad {
    transition: all 0.2s ease;
  }
}
.scaleInModal-enter,
.scaleInModal-leave-to {
  opacity: 0;
  .el-modal-pad {
    opacity: 0;
    transform: scale(0.7) rotateX(90deg);
  }
}
.scaleInModal-enter-to,
.scaleInModal-leave {
  .el-modal-pad {
    transform: scale(1) rotateX(0deg);
  }
}
.el-modal {
  position: fixed;
  z-index: 5000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  -webkit-transform: translate3d(0, 0, 0);

  //background-color: rgba(0, 0, 0, 0.75);
  background-color: rgba(22, 22, 25, 0.8);
  .el-modal-wrap {
    height: 100%;
  }
  .el-modal-content {
    border-radius: 5px;

    padding: 4em 0;
    margin: 0 auto;
    width: 90%;
    max-width: 500px;
    min-height: 300px;
    font-weight: 600;
    @media screen and (max-width: 550px) {
      width: 100%;
      min-height: 100%;
      padding: 0;
      .el-modal-pad.modal-content {
        border-radius: 0;
        height: 100%;
      }
    }
    .el-modal-pad {
      position: relative;
      padding: 3rem 3rem 2rem;
      background: #fff;
      border-radius: 0.5em;
      box-shadow: 1px 1px 4px 0 rgba(22, 22, 25, 0.4),
        -9px 22.5px 65px -5px rgba(22, 22, 25, 0.8);
      .close {
        position: absolute;
        z-index: 50;
        right: 0.5em;
        top: 0.5em;
        display: block;

        opacity: 0.3;
        font-size: 1.7em;
        line-height: 1;
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          opacity: 1;
          color: #ff0076;
          transform: rotate(90deg);
        }
      }
    }
    .modal-text {
      text-align: left;
      display: flex;
      &.center {
        margin: 3em auto;
        padding: 0;
      }
      .modal-text-icon {
        flex-basis: 100px;
        margin-right: 2em;
      }
      .modal-text-content {
        flex-basis: 100%;
        text-align: center;
        max-width: 100%;
        .errors {
          text-align: center;
        }
      }

      .actions {
        margin-top: 2em;
        .fi-btn {
          margin-right: 1em;
        }
      }
    }
    textarea {
      border: none;
      width: 100%;
      resize: none;
      padding: 1em;
      height: 10em;
      font-size: 1.1em;
    }
    .footer {
      //position: absolute;
      bottom: 0;
      text-align: right;
      width: 100%;
      left: 0;
      padding: 8px;
      border-top: 1px solid #eee;
    }
  }
}

@media screen and (max-width: 767px) {
  .el-modal {
    .el-modal-content {
      border-radius: 0;
      max-width: none;
      .el-modal-pad {
        padding: 2rem 1rem;
      }
    }
  }
}
</style>
