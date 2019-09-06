<template>
  <figure ref="wrapper" class="stage-container pro-figure">
    <div class="stage-wrap" :style="{transform: `scale(${scale})`}">
      <div class="stage">
        <div class="grid">
          <div class="cell">Pro Extensions</div>
          <div class="cell">Enhanced Support</div>
          <div class="cell">Community</div>
          <div class="cell">eCommerce</div>
          <div class="cell">White Label</div>
          <div class="cell">Client Tools</div>
          <div class="cell">SEO and Social</div>
          <div class="cell">Developer Options</div>
          <div class="cell">Community</div>
          <div class="cell">Business</div>
          <div class="cell">Developer</div>
          <div class="cell">Community</div>
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
#feature-pro {
  background: var(--color-bg-alt);
  position: relative;
  z-index: 0;
  .feature-figure-container {
    width: 170%;
  }
  @media (max-width: 767px) {
    .feature-figure-container {
      height: 500px;
    }
  }
}
figure.pro-figure {
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  transform: translateY(6rem);
  left: 0;
  // .stage-wrap {
  //   transform-origin: center left;
  // }
  // &:after {
  //   content: "";
  //   -webkit-mask-image: linear-gradient(transparent, #fff 70%);
  //   mask-image: linear-gradient(transparent, #fff 70%);
  //   bottom: 0;
  //   position: absolute;
  //   left: 0;
  //   width: 100%;
  //   height: 40%;
  // }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    left: 0;
    top: 0;
    perspective: 500px;
    // -webkit-mask-image: linear-gradient(90deg, #000, #000, transparent 99%);
    .grid {
      //  -webkit-mask-image: linear-gradient(#000, #000, transparent 99%);
      --row-height: 80px;
      height: 100%;
      display: grid;

      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;

      transform: rotateY(-4deg);
      .cell {
        transition: all 0.3s;
        border-radius: 0.5rem;
        background: #fff;
        box-shadow: 0 22.5px 25px -25px rgba(50, 50, 93, 0.2),
          0 2px 3px rgba(50, 50, 93, 0.1);

        font-size: 1.1em;
        text-transform: uppercase;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          color: #ff0076;
          box-shadow: 0 22.5px 25px -25px rgba(50, 50, 93, 0.5),
            0 3px 2px rgba(50, 50, 93, 0.2);
        }
      }
    }
  }
}
</style>