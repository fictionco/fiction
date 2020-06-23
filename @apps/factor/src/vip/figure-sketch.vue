<template>
  <figure ref="wrapper" class="factor-figure figure-sketch">
    <div class="stage-wrap">
      <div v-for="(sketch, index) in sketches" :key="index" class="sketch" :class="sketch.class">
        <img :src="sketch.image" :alt="sketch.alt" />
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  components: {},
  data() {
    return {
      sketches: [
        {
          class: `intro`,
          image: require("./img/sketch-intro.svg"),
          alt: `Sketch - Intro`,
        },
        {
          class: `feature`,
          image: require("./img/sketch-feature.svg"),
          alt: `Sketch - Feature`,
        },
        {
          class: `boxes`,
          image: require("./img/sketch-boxes.svg"),
          alt: `Sketch - Boxes`,
        },
      ],
    }
  },
}
</script>

<style lang="less">
figure.figure-sketch {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 4rem;

  @media (max-width: 900px) {
    padding: 2rem 0;
  }

  .stage-wrap {
    position: relative;
    padding: 25%;
    transform-origin: center right;
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .sketch {
    position: absolute;
    background: #fff;
    box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
      0px 50px 100px rgba(27, 34, 60, 0.1);
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
    }

    &.intro {
      top: 0;
      left: 0;
      padding: 2rem 2rem 0;
      transform-origin: top left;
      transform: scale(0.95);
    }
    &.feature {
      top: 0;
      right: 0;
      padding: 1.5rem;
      transform: scale(0.9) translateX(0rem) translateY(-3rem);

      @media (max-width: 900px) {
        transform: scale(0.8) translateX(0rem) translateY(-3rem);
      }
    }
    &.boxes {
      right: 0;
      bottom: 0;
      padding: 1.5rem;
      transform: scale(0.8) translateX(2rem) translateY(3rem);

      @media (max-width: 900px) {
        transform: scale(0.8) translateX(2rem) translateY(6rem);
      }
    }
  }
}
</style>
