<template>
  <figure ref="wrapper" class="figure-support">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="support">
        <div class="screenshot card-support-nav">
          <img src="./img/card-support-nav.svg" alt="Support Nav" />
        </div>
        <div class="screenshot card-support-page">
          <img src="./img/card-support-page.svg" alt="Support Page" />
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
figure.figure-support {
  max-width: 100%;
  @media (max-width: 900px) {
    margin: 6rem auto 4rem;
  }

  .stage-wrap {
    transform-origin: center left;
  }
  .support {
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
      &.card-support-nav {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        transform: translateY(-80px);
        box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
        overflow: hidden;
        border-radius: 4px;
      }
      &.card-support-page {
        position: absolute;
        top: 20px;
        right: 0;
        transform: translateZ(-50px) translateX(95px) scale(1) perspective(1050px);
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
