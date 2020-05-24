<template>
  <figure ref="wrapper" class="figure-extensions">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="extensions">
        <div class="screenshot card-extension-list">
          <img src="./img/card-extensions-list.svg" alt="Extensions List" />
        </div>
        <div class="screenshot card-extension-page">
          <img src="./img/card-extensions-page.svg" alt="Extensions Page" />
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
figure.figure-extensions {
  max-width: 100%;
  @media (max-width: 900px) {
    margin: 1rem auto 4rem;
    width: 450px;
  }

  .stage-wrap {
    transform-origin: center right;
    perspective: 1000px;
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform-origin: center;
    }
  }
  .extensions {
    padding: 34% 0;
    width: 500px;
    position: relative;
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform: translate(-0, -0px);
    }
    .screenshot {
      background: #fff;
      display: inline-block;
      &.card-extension-list {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 0;
        transform: rotateX(2deg) rotateY(-20deg);
        box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
          0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 4px;
      }
      &.card-extension-page {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotateX(2deg) rotateY(20deg) translateZ(-100px) translateY(10%);
        background: #ffffff;
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          -19px 32.5px 105px -5px rgba(50, 50, 93, 0.3),
          13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 4px;
      }
    }
  }
}
</style>
