<template>
  <figure ref="wrapper" class="figure-upgrade">
    <div class="stage-wrap">
      <div class="upgrade">
        <div class="screenshot card-blue">
          <img src="./img/card-blue.svg" alt="Dashboard Blue" />
        </div>
        <div class="screenshot card-install">
          <img src="./img/card-install.svg" alt="Install" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  data() {
    return {
      width: 500,
    }
  },
  computed: {
    scale(this: any) {
      return Math.max(Math.min(this.width / 500, 1), 0.5)
    },
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
    },
  },
}
</script>

<style lang="less">
figure.figure-upgrade {
  max-width: 100%;

  .stage-wrap {
    transform-origin: center left;
  }
  .upgrade {
    padding: 40% 0;
    width: 170px;
    position: relative;
    transform: scale(1);
    transform-style: preserve-3d;

    .screenshot {
      background: #fff;
      display: inline-block;
      &.card-blue {
        position: absolute;
        bottom: 0;
        left: 0;
        right: auto;
        z-index: 0;
        transform: rotateX(2deg) rotateY(15deg) translateY(36px) translateZ(-50px)
          scale(1) perspective(1050px);
        box-shadow: 0px 20px 90px rgba(50, 50, 93, 0.13),
          0 15px 35px rgba(50, 50, 93, 0.11), 0 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 4px 4px 0 0;
      }
      &.card-install {
        position: absolute;
        bottom: 0px;
        left: 60px;
        transform: rotateX(2deg) rotateY(15deg) translateY(36px) translateX(-30px)
          scale(1) perspective(1050px);
        background: #ffffff;
        box-shadow: -5px -5px 27px rgba(0, 0, 0, 0.1), -1px -1px 3px rgba(50, 50, 93, 0.2);
        overflow: hidden;
        border-radius: 4px 4px 0 0;
      }
    }
    perspective: 1000px;
  }
}
</style>
