<template>
  <figure ref="wrapper" class="themes-figure">
    <div class="stage-wrap" :style="{transform: `scale(${scale})`}">
      <div class="stage">
        <div v-for="(screenshot, i) in screenshots" :key="i" class="screenshot-wrap">
          <img :src="screenshot.img" >
        </div>
      </div>
    </div>
  </figure>
</template>

<script>
export default {
  data() {
    return {
      width: 500,
      screenshots: [
        {
          img: require("./img/screenshot.jpg")
        },
        {
          img: require("./img/screenshot.jpg")
        },
        {
          img: require("./img/screenshot.jpg")
        }
      ]
    }
  },
  computed: {
    scale() {
      return Math.max(Math.min(this.width / 500, 1), 0.5)
    }
  },
  mounted() {
    this.width = this.getWidth()

    window.addEventListener("resize", () => {
      this.width = this.getWidth()
    })
  },
  methods: {
    getWidth() {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    }
  }
}
</script>

<style lang="less">
figure.themes-figure {
  max-width: 100%;
  .stage-wrap {
    transform-origin: center left;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translateX(3em);
    @media (max-width: 767px) {
      transform: translate(-0, -0px);
    }

    perspective: 800px;

    .screenshot-wrap {
      width: 550px;
      top: 0;
      left: 0;
      position: absolute;

      border-radius: 8px;
      box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
        -19px 32.5px 105px -5px rgba(50, 50, 93, 0.3),
        13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      transform-origin: 0 0;
      img {
        width: 100%;
        display: block;
      }
      &:nth-child(1) {
        transform: rotateX(4deg) rotateY(-15deg) translateZ(0em);
        z-index: 10;
      }
      &:nth-child(2) {
        left: 2em;

        z-index: 9;
        transform: rotateX(4deg) rotateY(-15deg) translateZ(-8em)
          translateY(1rem) translateX(1rem);
      }
      &:nth-child(3) {
        left: 4em;
        z-index: 8;
        transform: rotateX(4deg) rotateY(-15deg) translateZ(-16em)
          translateY(2rem) translateX(2rem);
      }
    }
  }
}
</style>