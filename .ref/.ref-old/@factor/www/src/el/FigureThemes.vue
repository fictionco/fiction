<template>
  <figure ref="wrapper" class="figure-themes lg:mr-auto">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div
          v-for="(screenshot, i) in screenshots"
          :key="i"
          class="screenshot-wrap"
        >
          <img :src="screenshot.img" :alt="screenshot.alt" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts" setup>
import { vue } from "@factor/api"
import themeAlpha from "../img/theme-alpha.jpg"
import themeYellow from "../img/theme-alpha-yellow.jpg"
import themeUltra from "../img/theme-ultra.jpg"
const wrapper = vue.ref<HTMLElement>()
const width = vue.ref<number>(500)
const screenshots = vue.ref([
  {
    img: themeAlpha,
    alt: "Alpha Theme",
  },
  {
    img: themeUltra,
    alt: "Ultra Theme",
  },
  {
    img: themeYellow,
    alt: "Alpha Theme (yellow)",
  },
])

/**
 * Get figure width
 */
const getWidth = (): number => {
  return wrapper.value ? wrapper.value.clientWidth : 100
}
/**
 * Scale figure based on width
 */
const scale = vue.computed(() => {
  return Math.max(Math.min(width.value / 500, 1), 0.5)
})

vue.onMounted(() => {
  /**
   * Get figure width
   */
  width.value = getWidth()
  /**
   * Update stage width on window resize
   */
  window.addEventListener("resize", () => {
    width.value = getWidth()
  })
})
</script>

<style lang="less">
figure.figure-themes {
  max-width: 100%;
  .stage-wrap {
    transform-origin: 0;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translateX(3em);
    @media (max-width: 900px) {
      width: 300px;
      transform: translate(-4em, 3em);
    }

    perspective: 800px;

    .screenshot-wrap {
      width: 535px;
      top: 0;
      left: 0;
      position: absolute;

      border-radius: 8px;
      box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
        -19px 32.5px 105px -5px rgba(50, 50, 93, 0.3),
        13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
      overflow: hidden;

      img {
        width: 100%;
        display: block;
      }
      &:nth-child(1) {
        z-index: 10;
        transform: rotate(-5deg) rotateY(12deg) translateZ(152px);
      }
      &:nth-child(2) {
        left: 4em;

        z-index: 9;
        transform: rotate(5deg) rotateY(-12deg) translateZ(22px);
        top: -3em;
      }
      &:nth-child(3) {
        left: 7em;
        z-index: 8;
        top: -7em;
        transform: rotate(8deg) rotateY(-18deg) translateZ(-102px);
      }
    }
  }
}
</style>
