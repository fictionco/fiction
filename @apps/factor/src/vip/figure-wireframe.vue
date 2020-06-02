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
export default {
  data() {
    return {
      wireframes: [
        {
          class: `steps`,
          image: require("./img/wireframe-process.svg"),
          alt: `Wireframe - Process Steps`,
        },
        {
          class: `intro`,
          image: require("./img/wireframe-intro.svg"),
          alt: `Wireframe - Intro`,
        },
      ],
    }
  },
}
</script>

<style lang="less">
figure.figure-wireframe {
  position: relative;
  max-width: 500px;
  margin: 0 auto;

  .stage-wrap {
    position: relative;
    //padding: 25%;
    transform-origin: center right;
    perspective: 1000px;
    transform-style: preserve-3d;
    padding: 0 0 5rem;
  }

  .wireframe {
    width: 430px;
    max-width: 430px;
    z-index: 10;
    background: #fff;
    box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
      0px 50px 100px rgba(27, 34, 60, 0.1);
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
    }

    &.steps {
      width: 85%;
      padding: 2rem 2rem 0;
      transform: translateY(-3rem);
    }
    &.intro {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 85%;
      z-index: 11;
      transform: translateY(1rem);
    }
  }
}
</style>
