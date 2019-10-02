<template>
  <figure ref="wrapper" class="factor-figure">
    <div class="wireframes">
      <div class="wireframe steps">
        <img src="./img/wireframe-process.svg" />
      </div>
      <div class="wireframe intro">
        <img src="./img/wireframe-intro.svg" />
      </div>
    </div>
  </figure>
</template>

<script>
//import pageUtils from "./utils"
export default {
  components: {}
}
</script>

<style lang="less">
//#feature-factor {
//   .feature-figure-container {
//     align-self: center;
//     height: auto;
//     min-width: 0;
//   }
//   @media (max-width: 900px) {
//     .feature-figure-container {
//       transform-origin: center center;
//       figure {
//         transform: none;
//       }
//     }
//   }
// }
figure.factor-figure {
  //perspective: 2000px;
  position: relative;
  //transform: translateX(-3rem);

  .wireframes {
    padding: 4rem 0;
    .wireframe {
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
      &.steps {
        padding: 2rem 2rem 0;
        transform: translateZ(-10px) translateX(0rem) translateY(-2rem);
        width: 80%;
      }
      &.intro {
        padding: 0;
        //transform: translateZ(-10px) translateX(9rem) translateY(-7rem);
        width: 80%;
        z-index: 11;
        position: absolute;
        bottom: 0em;
        left: 8em;
      }
    }
    // @media (max-width: 900px) {
    //   min-height: 250px;
    //   margin: 3em 0;
    //   .sketch {
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
