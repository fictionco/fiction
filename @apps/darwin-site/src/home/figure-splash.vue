<template>
  <figure ref="wrapper" class="darwin-splash">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div class="screenshot rectangle" />
        <div class="screenshot graph">
          <img src="./img/figure-graph.svg" alt="Recurring Revenue Analytics" />
        </div>
        <div class="screenshot data-bar-list">
          <img src="./img/figure-data-list.svg" alt="Top Events" />
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
    scale() {
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
    getWidth() {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    },
  },
}
</script>

<style lang="less">
figure.darwin-splash {
  display: flex;
  justify-content: center;
  max-width: 100%;

  @media (max-width: 900px) {
    margin: 0 auto;
    width: 450px;
  }
  .stage-wrap {
    transform-origin: center center;
  }
  .stage {
    position: relative;
    width: 450px;
    padding: 20% 0;
    transform: scale(1);
    transform-style: preserve-3d;
    perspective: 1000px;

    .screenshot {
      display: block;
      background: #fff;
      padding: 0.5rem;
      border-radius: 0.5em;
      box-shadow: var(--box-shadow);
      img {
        max-width: 100%;
      }
      &.rectangle {
        width: 100%;
        height: 280px;
        background: var(--color-primary);
      }
      &.graph {
        position: absolute;
        z-index: 0;
        bottom: 40px;
        left: -40px;
        width: 100%;
        padding: 0.5rem 0.5rem 0;
        transform: scale(1.05);
      }
      &.data-bar-list {
        position: absolute;
        width: 80%;
        top: 20px;
        right: -40px;
        padding: 1.5rem;
      }
    }
  }
}
</style>
