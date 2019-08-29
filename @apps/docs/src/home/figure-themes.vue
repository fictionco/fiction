<template>
  <figure ref="wrapper" class="themes-figure">
    <div class="stage-wrap" :style="{transform: `scale(${scale})`}">
      <div class="stage">
        <div class="plugin-icon">
          <img src="./img/icon-google-analytics.svg" >
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
      return this.width / 500
    }
  },
  mounted() {
    this.width = this.$refs.wrapper.clientWidth

    window.addEventListener("resize", () => {
      this.width = this.$refs.wrapper.clientWidth
    })
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
    transform: translate(80px, -50px) scale(1.1);
    @media (max-width: 767px) {
      transform: translate(-0, -0px);
    }

    .plugin-icon {
      background: blue;
    }
    perspective: 1000px;
  }
}
</style>