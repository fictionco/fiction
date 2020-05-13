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
  }
  .extensions {
    padding: 34% 0;
    width: 500px;
    position: relative;
    transform: scale(1);
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform: scale(1) translate(-0, -0px);
    }
    .screenshot {
      background: #fff;
      display: inline-block;
      &.card-extension-list {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 0;
        transform: translateY(-45px) rotateX(2deg) rotateY(10deg);
        box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
        overflow: hidden;
        border-radius: 4px;
      }
      &.card-extension-page {
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(1) translateZ(-50px) translateX(-90px) rotateX(2deg)
          rotateY(12deg) perspective(1050px);
        background: #ffffff;
        box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
        overflow: hidden;
        border-radius: 4px;
      }
    }
    perspective: 1000px;
  }
}
</style>
