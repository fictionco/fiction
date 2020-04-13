<template>
  <figure ref="wrapper" class="factor-figure figure-sketch">
    <div class="sketches">
      <div
        v-for="(sketch, index) in sketches"
        :key="index"
        class="sketch"
        :class="sketch.class"
      >
        <img :src="sketch.image" :alt="sketch.alt" />
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {},
  data() {
    return {
      sketches: [
        {
          class: `feature`,
          image: require("./img/sketch-feature.svg"),
          alt: `Sketch - Feature`,
        },
        {
          class: `intro`,
          image: require("./img/sketch-intro.svg"),
          alt: `Sketch - Intro`,
        },
        {
          class: `boxes`,
          image: require("./img/sketch-boxes.svg"),
          alt: `Sketch - Boxes`,
        },
      ],
    }
  },
})
</script>

<style lang="less">
figure.figure-sketch {
  position: relative;

  .sketches {
    padding: 0 0 7rem;
    .sketch {
      z-index: 10;
      background: #ffffff;
      box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
        0px 50px 100px rgba(27, 34, 60, 0.1);
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
      }
      &.feature {
        width: 150px;
        max-width: 150px;
        padding: 1.5rem;
        position: absolute;
        top: 0;
        right: 0;
      }
      &.intro {
        width: 430px;
        max-width: 430px;
        padding: 2rem 2rem 0;
      }
      &.boxes {
        width: 430px;
        max-width: 430px;
        padding: 1.5rem;
        position: absolute;
        //top: 17rem;
        right: -2rem;
        bottom: 0;
      }
    }
    @media (max-width: 900px) {
      padding: 2rem 0 4rem;
      .sketch {
        &.feature {
          width: 28%;
          padding: 1rem;
        }
        &.intro {
          width: 80%;
          padding: 1rem 1rem 0;
        }
        &.boxes {
          width: 80%;
          padding: 1rem;
        }
      }
    }
  }
}
</style>
