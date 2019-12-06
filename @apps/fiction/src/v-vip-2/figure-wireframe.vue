<template>
  <figure ref="wrapper" class="factor-figure figure-wireframe">
    <div class="wireframes">
      <div
        v-for="(wireframe, index) in wireframes"
        :key="index"
        class="wireframe"
        :class="wireframe.class"
      >
        <img :src="wireframe.image" :alt="wireframe.alt" />
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
      wireframes: [
        {
          class: `steps`,
          image: require("./img/wireframe-process.svg"),
          alt: `Wireframe - Process Steps`
        },
        {
          class: `intro`,
          image: require("./img/wireframe-intro.svg"),
          alt: `Wireframe - Intro`
        }
      ]
    }
  }
})
</script>

<style lang="less">
figure.figure-wireframe {
  position: relative;

  .wireframes {
    padding: 0 0 5rem;
    .wireframe {
      width: 430px;
      max-width: 430px;
      z-index: 10;
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
      }
      &.intro {
        padding: 0;
        //transform: translateZ(-10px) translateX(9rem) translateY(-7rem);
        z-index: 11;
        position: absolute;
        top: 5rem;
        right: -2rem;
      }
    }
    @media (max-width: 900px) {
      .wireframe {
        &.steps,
        &.intro {
          width: 90%;
        }
      }
    }
  }
}
</style>
