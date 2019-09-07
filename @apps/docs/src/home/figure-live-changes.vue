<template>
  <figure ref="wrapper" class="live-changes">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div class="annotation">
          <img src="./img/live-changes.svg" >
        </div>
        <div class="screenshot theme">
          <img src="./img/theme.svg" >
        </div>
        <div class="screenshot edit-post">
          <img src="./img/post.svg" >
        </div>
      </div>
    </div>
  </figure>
</template>

<script>
export default {
  data() {
    return {
      width: 500
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
figure.live-changes {
  --color-wire: #e6ebf1;
  --color-shaded: #ced2dd;
  max-width: 100%;
  .stage-wrap {
    transform-origin: center left;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translate(-120px, -50px) scale(1.1);
    transform-style: preserve-3d;
    @media (max-width: 767px) {
      transform: translate(-0, -0px);
    }
    .annotation {
      position: absolute;
      top: 0;
      left: 15%;
      transform: translateZ(10px);
      img {
        width: 300px;
      }
    }
    .screenshot {
      top: 35px;
      background: #fff;
      display: inline-block;
      img {
        max-width: 100%;
      }
      &.theme {
        position: absolute;
        right: 0;
        z-index: 0;
        padding: 5px;
        transform: scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)
          translateZ(-40px);
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          19px 25.5px 15px -25px rgba(50, 50, 93, 0.3),
          13.4px 25.5px 75px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 4px;
      }
      &.edit-post {
        position: absolute;
        top: 110px;
        left: 0;
        padding: 5px;
        transform: scale(1) perspective(1050px) rotateY(11deg) rotateX(-2deg)
          rotate(-2deg);
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          -19px 32.5px 105px -5px rgba(50, 50, 93, 0.3),
          13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 4px;
      }
    }
    perspective: 1000px;
  }
}
</style>
