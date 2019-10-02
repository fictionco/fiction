<template>
  <figure ref="wrapper" class="factor-figure">
    <div class="sketches">
      <div class="sketch intro">
        <img src="./img/sketch-intro.svg" />
      </div>
      <div class="sketch boxes">
        <img src="./img/sketch-boxes.svg" />
      </div>
      <div class="sketch feature">
        <img src="./img/sketch-feature.svg" />
      </div>
    </div>
  </figure>
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="less">
figure.factor-figure {
  //perspective: 2000px;
  position: relative;

  .sketches {
    .sketch {
      max-width: 500px;
      z-index: 10;
      //transform-origin: top center;
      background: #ffffff;
      box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
        0px 50px 100px rgba(27, 34, 60, 0.1);
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
      }
      &.intro {
        padding: 2rem 2rem 0;
        transform: translateZ(-10px) translateX(0) translateY(3rem);
        width: 80%;
      }
      &.feature {
        padding: 1.5rem;
        max-width: 150px;
        transform: translateZ(-10px) translateX(24rem) translateY(-15rem);
      }
      &.boxes {
        padding: 1.5rem;
        position: absolute;
        bottom: 0em;
        left: 8em;
      }
    }
    // @media (max-width: 900px) {
    //   min-height: 250px;
    //   margin: 3em 0;
    //   .sketch {
    //     &.feature {
    //       transform: scale(0.85) translateX(-2em);
    //       top: -2em;
    //       right: auto;
    //       bottom: auto;
    //       left: 0;
    //       box-shadow: 0 4px 35px 0 rgba(23, 55, 87, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.07);
    //     }
    //     &.intro {
    //       transform: scale(0.85) translateX(2em);
    //       top: 3em;
    //       right: 0;
    //       bottom: auto;
    //       left: auto;
    //     }
    //   }
    // }
  }
}
</style>
