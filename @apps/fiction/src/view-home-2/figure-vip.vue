<template>
  <figure ref="wrapper" class="stage-container vip-figure">
    <div class="stage-wrap" :style="{transform: `scale(${scale})`}">
      <div class="stage">
        <div class="grid">
          <div v-for="(feature, i) in 12" :key="i" class="cell">some text</div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script>
import pageUtils from "./utils"
export default {
  mixins: [pageUtils().figureMixin({ ref: "wrapper", width: 500 })]
}
</script>

<style lang="less">
#feature-vip {
  .feature-content {
    color: #fff;
  }

  background: var(--color-bg-splash);
  // @media (max-width: 767px) {
  //   .feature-figure-container {
  //     height: 500px;
  //   }
  // }
}
figure.vip-figure {
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .stage-wrap {
    transform-origin: center left;
  }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    perspective: 1000px;

    left: 0;
    top: 0;
    .grid {
      --row-height: 80px;
      height: 100%;
      display: grid;

      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 0.5rem;
      .cell {
        background: #fff;
      }
    }
  }
}
</style>