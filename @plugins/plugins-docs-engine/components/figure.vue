<template>
  <div class="search-figure">
    <div class="stage">
      <!-- <div class="main-icon">
        <figure-icon icon="search" />
      </div>-->
      <div class="figure">
        <div v-for="(item, i) in icons" :key="i" class="icon-wrap">
          <figure-icon :icon="item.icon" :color="item.color" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {
    figureIcon: () => import("./figure-icon.vue")
  },
  data() {
    return {
      icons: [
        { icon: "widgets" },
        { icon: "search" },
        { icon: "touch" },
        { icon: "user" },
        { icon: "email" },
        { icon: "layout" },
        { icon: "settings" },
        { icon: "image" },
        { icon: "doc", color: "primary" }
      ]
    }
  }
})
</script>

<style lang="less">
.search-figure {
  // top: 0;
  // left: 0;
  // position: absolute;
  // width: 100%;
  // height: 100%;
  .stage {
    perspective: 500px;
  }
  .figure {
    transform-style: preserve-3d;
    display: grid;
    grid-gap: 1rem;
    //grid-template-columns: repeat(3, 120px);
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);
    justify-content: center;
    transform: rotateY(-15deg);
    .icon-wrap {
      justify-self: center;
      align-self: center;
    }
    .icon-wrap {
      // &:nth-child(1) {
      //   grid-column: ~"-1/-2";
      //   grid-row: ~"1/2";
      // }

      // &:nth-child(2) {
      //   grid-column: ~"-3/-4";
      //   grid-row: ~"-3/-4";
      // }

      // &:nth-child(3) {
      //   grid-column: ~"3/4";
      //   grid-row: ~"3/4";
      // }

      // &:nth-child(4) {
      //   grid-column: ~"1/2";
      //   grid-row: ~"2/3";
      // }
      // &:nth-child(5) {
      //   grid-column: ~"-1/-2";
      //   grid-row: ~"-1/-2";
      // }
      // &:nth-child(6) {
      //   grid-column: ~"1/2";
      //   grid-row: ~"-1/-2";
      // }

      // &:nth-child(7) {
      //   grid-column: ~"3/4";
      //   grid-row: ~"3/4";
      // }

      // &:nth-child(8) {
      //   grid-column: ~"2/3";
      //   grid-row: ~"1/2";
      // }

      // &:nth-child(9) {
      //   grid-column: ~"2/3";
      //   grid-row: ~"3/4";
      // }

      // &:nth-child(5) {
      //   grid-column: ~"3/4";
      //   grid-row: ~"-3/-1";
      //   transform: scale(0.8);
      // }

      // &:nth-child(9) {
      //   // grid-column: ~"4/4";
      //   // grid-row: ~"-4/-1";
      //   transform: translateZ(100px) scale(1.3);
      // }
      background: #fff;
      box-shadow: var(--panel-shadow);
      transition: 0.2s all;
      &:nth-child(9),
      &:hover {
        // transform-origin: center bottom;
        box-shadow: none;

        background: var(--color-primary);
        .filler {
          fill: #fff;
        }
      }
      &:hover {
        transform: rotateX(-25deg);
      }
      // &.primary {
      //   background: var(--color-primary);
      // }
      // &.secondary {
      //   background: var(--color-secondary);
      // }
      // &.tertiary {
      //   background: #ff0076;
      // }
      // &.purple {
      //   background: #3d0c85;
      // }

      border-radius: 6px;
      padding: 1rem;

      svg {
        display: block;
        width: 2rem;
        height: 2rem;
      }
    }
  }
  .main-icon {
    z-index: 100;
    background: #fff;
    box-shadow: var(--panel-shadow);
    transform: translate(-50%, -50%) translateZ(100px) rotateY(15deg);
    border-radius: 6px;
    padding: 1rem;
    position: absolute;
    left: 50%;
    top: 50%;
    svg {
      display: block;
      width: 12rem;
      height: 12rem;
    }
  }
}
</style>
