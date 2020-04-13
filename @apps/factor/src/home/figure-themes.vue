<template>
  <figure ref="wrapper" class="themes-graph">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div v-for="(screenshot, i) in screenshots" :key="i" class="screenshot-wrap">
          <img :src="screenshot.img" alt="theme" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      width: 500,
      screenshots: [
        {
          img: require("./img/theme-alpha.jpg"),
        },
        {
          img: require("./img/theme-ultra.jpg"),
        },
        {
          img: require("./img/theme-alpha-yellow.jpg"),
        },
      ],
    }
  },
  computed: {
    scale(this: any) {
      return Math.max(Math.min(this.width / 500, 1), 0.5)
    },
  },
  mounted(this: any) {
    this.width = this.getWidth()

    window.addEventListener("resize", () => {
      this.width = this.getWidth()
    })
  },
  methods: {
    getWidth(this: any) {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    },
  },
})
</script>

<style lang="less">
figure.themes-graph {
  max-width: 100%;
  .stage-wrap {
    transform-origin: 0;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translateX(3em);
    @media (max-width: 900px) {
      width: 300px;
      transform: translate(-4em, 3em);
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

      img {
        width: 100%;
        display: block;
      }
      &:nth-child(1) {
        z-index: 10;
        transform: rotate(-5deg) rotateY(12deg) translateZ(152px);
      }
      &:nth-child(2) {
        left: 4em;

        z-index: 9;
        transform: rotate(5deg) rotateY(-12deg) translateZ(22px);
        top: -3em;
      }
      &:nth-child(3) {
        left: 7em;
        z-index: 8;
        top: -7em;
        transform: rotate(8deg) rotateY(-18deg) translateZ(-102px);
      }
    }
  }
}
</style>
