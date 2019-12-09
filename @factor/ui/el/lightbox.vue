<template>
  <transition name="fade">
    <div v-if="visible" class="img-swiper modal" @click.self="closeDialog">
      <div :class="{transition: imgTransitionStatus}" :style="imgStyle" class="img-wrapper">
        <!-- START: Imgs -->
        <img :src="imgList[imgIndex]" class="img" alt draggable="false" />
        <!-- END: Imgs -->
      </div>
      <!-- START: btns -->
      <div class="btns">
        <div v-if="imgList.length !== 1" class="btn__prev" @click="prev">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-prev" />
          </svg>
        </div>
        <div v-if="imgList.length !== 1" class="btn__next" @click="next">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next" />
          </svg>
        </div>
        <div class="btn__close" @click="closeDialog">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
      </div>
      <!-- END: btns -->
      <!-- START: total -->
      <div v-if="imgList.length !== 1" class="pagination-total">{{ imgIndex + 1 }}/{{ imgTotal }}</div>
      <!-- END: total -->
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue"
// Code from:
// https://github.com/XiongAmao/vue-easy-lightbox
import { emitEvent } from "@factor/api/events"
export default Vue.extend({
  components: {},
  props: {
    imgs: { type: [Array, String], default: "" },
    visible: { type: Boolean, default: false },
    index: { type: Number, default: 0 }
  },
  data() {
    return {
      scale: 1,
      rotateDeg: 0,
      imgIndex: 0,
      imgTransitionStatus: true,
      top: 0,
      left: 0,
      lastX: 0,
      lastY: 0,
      isDraging: false
    }
  },
  computed: {
    imgList() {
      if (Object.prototype.toString.call(this.imgs) === "[object Array]") {
        return this.imgs.map(img => {
          if (img.url) {
            return img.url
          } else {
            return img
          }
        })
      } else {
        return [this.imgs]
      }
    },
    imgTotal() {
      return this.imgList.length || 0
    },
    imgStyle: {
      get() {
        return {
          transform: `translate(-50%, -50%)
      scale(${this.scale})
      rotate(-${this.rotateDeg}deg)`,
          top: `calc(50% + ${this.top}px)`,
          left: `calc(50% + ${this.left}px)`
        }
      }
    }
  },
  watch: {
    visible(visible) {
      if (visible === true) {
        this.init()
      }

      emitEvent("modal", visible)
    }
  },
  mounted() {
    require("./img/iconfont")

    this.$nextTick(() => {
      this.$el.remove()

      document.querySelector("#app").append(this.$el)
    })
  },
  destroyed() {
    this.$el.remove()
  },
  methods: {
    checkBtn(btn) {
      if (btn === 0) return true
      return false
    },
    handleMouseDown(e) {
      if (!this.checkBtn(e.button)) return
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.isDraging = true
      e.stopPropagation()
    },
    handleMouseUp(e) {
      if (!this.checkBtn(e.button)) return
      this.isDraging = false
      this.lastX = this.lastY = 0
    },
    handleMouseMove(e) {
      if (!this.checkBtn(e.button)) return
      if (this.isDraging) {
        this.top = this.top - this.lastY + e.clientY
        this.left = this.left - this.lastX + e.clientX
        this.lastX = e.clientX
        this.lastY = e.clientY
      }
      e.stopPropagation()
    },
    zoomIn() {
      this.scale += 0.25
    },
    zoomOut() {
      if (this.scale !== 0) this.scale -= 0.25
    },
    rotate() {
      this.rotateDeg += 90
    },
    next() {
      this.reset()
      if (this.imgIndex === this.imgList.length - 1) {
        this.imgIndex = 0
      } else {
        this.imgIndex += 1
      }

      setTimeout(() => {
        this.imgTransitionStatus = !this.imgTransitionStatus
      }, 0)
    },
    prev() {
      if (this.imgIndex === 0) {
        this.imgIndex = this.imgList.length + 1
      } else {
        this.imgIndex -= 1
      }
      this.reset()

      setTimeout(() => {
        this.imgTransitionStatus = !this.imgTransitionStatus
      }, 0)
    },
    reset() {
      this.imgTransitionStatus = !this.imgTransitionStatus
      this.scale = 1
      this.rotateDeg = 0
    },
    closeDialog() {
      this.$emit("update:visible", false)
    },
    init() {
      this.imgIndex = this.index
      this.imgTransitionStatus = true
      this.scale = 1
      this.rotateDeg = 0
      this.top = 0
      this.left = 0
    }
  }
})
</script>

    <style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.img-swiper {
  position: relative;
}
.modal {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
}
.img-wrapper {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50% -50%);
  cursor: move;
}
.img-wrapper.transition {
  transition: transform 0.3s ease-in-out;
}
.img {
  max-width: 80vw;
  max-height: 80vh;
  vertical-align: middle;
  position: relative;
}

.btn__prev,
.btn__next,
.btn__close {
  cursor: pointer;
  position: absolute;
  font-size: 60px;
  color: #fff;
  opacity: 0.6;
  transition: 0.15s linear;
}
.btn__prev:hover,
.btn__next:hover,
.btn__close:hover {
  opacity: 1;
}
.btn__prev.disable:hover,
.btn__next.disable:hover,
.btn__prev.disable,
.btn__next.disable {
  cursor: default;
  opacity: 0.2;
}
.btn__next {
  top: 50%;
  right: 20px;
  font-size: 40px;
}
.btn__prev {
  top: 50%;
  left: 20px;
  font-size: 40px;
}
.btn__close {
  top: 10px;
  right: 10px;
  font-size: 40px;
}
.pagination-total {
  position: absolute;
  font-size: 16px;
  top: 16px;
  left: 16px;
  color: #000;
}
.toolbar-btns {
  user-select: none;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  background: rgba(45, 45, 44, 0.8);
  border-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 6px 24px 0;
}
.toobar-btn {
  cursor: pointer;
  display: inline-block;
  padding: 6px;
}
.toobar-btn .icon {
  width: 32px;
  height: 32px;
  fill: #fff;
}
.toobar-btn:hover .icon {
  fill: #54b4ee;
}
</style>
