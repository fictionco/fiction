<template>
  <figure ref="wrapper" class="figure-dashboard lg:mr-auto">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div class="screenshot dashboard-tabs-mockup">
          <img src="../img/figure-dashboard-tabs.svg" alt="Dashboard Tabs" />
        </div>
        <div class="screenshot dashboard-mockup">
          <img
            src="../img/figure-dashboard-mockup.svg"
            alt="Dashboard Mockup"
          />
        </div>
        <div class="screenshot code-mockup">
          <img src="../img/figure-dashboard-code.svg" alt="Dashboard Code" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
const wrapper = ref()
const width = ref<number>(500)

/**
 * Get figure width
 */
const getWidth = () => {
  return wrapper.value ? wrapper.value.clientWidth : 100
}
/**
 * Scale figure based on width
 */
const scale = computed(() => {
  return Math.max(Math.min(width.value / 500, 1), 0.5)
})

onMounted(() => {
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
figure.figure-dashboard {
  --color-wire: #e6ebf1;
  --color-shaded: #ced2dd;
  max-width: 100%;
  .stage-wrap {
    transform-origin: center left;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translate(80px, -50px) scale(1.1);
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform: translate(-0, -0px);
    }
    .annotation {
      position: absolute;
      top: 0;
      left: 15%;
      z-index: 10;
      img {
        width: 300px;
      }
    }
    .screenshot {
      top: 35px;
      background: #fff;
      position: absolute;
      img {
        max-width: 100%;
        // filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
      }
      &.code-mockup {
        transform: translateZ(-50px);
        //z-index: 0;

        top: 0;
        left: 0px;

        right: auto;
      }
      &.dashboard-mockup {
        top: 15px;
        //z-index: 1;
        right: 0;
        top: 50px;
        padding: 5px;
        transform: scale(1) perspective(2040px) rotateY(-11deg) rotateX(2deg)
          rotate(2deg) translateZ(0);
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          19px 25.5px 15px -25px rgba(50, 50, 93, 0.3),
          13.4px 25.5px 75px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 4px;
      }
      &.dashboard-tabs-mockup {
        //z-index: 5;
        top: 110px;
        left: 0;
        padding: 5px;
        transform: scale(1) perspective(1040px) rotateY(11deg) rotateX(-2deg)
          rotate(-2deg) translateZ(20px);
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          -19px 32.5px 105px -5px rgba(50, 50, 93, 0.3),
          13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 4px;
      }
    }
    perspective: 1000px;
  }
}
</style>
