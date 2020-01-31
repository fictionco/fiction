<template>
  <figure ref="wrapper" class="splash-figure">
    <div class="stage">
      <img src="./img/alpha.jpg" alt="Alpha Theme" class="top-right" />
      <img src="./img/dashboard.jpg" alt="Dashboard" class="main" />
      <img src="./img/zeno.jpg" alt="Zeno Theme" class="bottom-left" />
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      width: 500
    }
  },
  computed: {
    scale(this: any) {
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
    getWidth(this: any) {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    }
  }
})
</script>

<style lang="less">
figure.splash-figure {
  .stage {
    position: relative;
    transform-origin: center center;
    perspective: 1400px;
    .main {
      max-width: 80%;
      margin: 50px auto 0 auto;
      border-radius: 4px;
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
      //transform: rotateX(10deg) rotateY(5deg) rotate(0deg) scale(1.1);
      // transform: rotate3d(0.5, -0.836, 0, 19deg);
      transform-style: preserve-3d;
      z-index: 10;
    }
    .top-right,
    .bottom-left {
      position: absolute;
      max-width: 40%;
      border-radius: 4px;
    }
    .top-right {
      top: -100px;
      right: 0;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.17), 0px 7px 14px rgba(50, 50, 93, 0.14);
      //transform: rotateX(5deg) rotateY(15deg) rotate(0deg);
      transform: rotateY(-10deg) rotateZ(1deg);
      transform-style: preserve-3d;

      @media (max-width: 900px) {
        top: -40px;
        right: 1em;
      }
    }
    .bottom-left {
      bottom: -50px;
      left: 0;
      box-shadow: 0px 7px 14px rgba(50, 50, 93, 0.14), 0px 3px 6px rgba(0, 0, 0, 0.1);
      //transform: rotateX(5deg) rotateY(15deg) rotate(0deg);
      //transform: rotate3d(-11.5, 5, 0, -12deg);
      transform: rotateY(4deg);
      transform-style: preserve-3d;

      @media (max-width: 900px) {
        bottom: -30px;
        left: 1em;
      }
    }
  }
}
</style>
