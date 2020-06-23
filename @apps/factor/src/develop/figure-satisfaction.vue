<template>
  <figure ref="wrapper" class="figure-satisfaction">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="satisfaction">
        <div class="screenshot card-satisfaction">
          <img src="./img/card-satisfaction.svg" alt="Client Satisfaction" />
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
figure.figure-satisfaction {
  max-width: 100%;
  @media (max-width: 900px) {
    margin: 1rem auto 4rem;
    //width: 460px;
  }

  .stage-wrap {
    transform-origin: center right;
    perspective: 1000px;
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform-origin: center;
    }
  }
  .satisfaction {
    padding: 34% 0;
    width: 500px;
    position: relative;
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform: scale(1) translate(-0, -0px);
      width: 460px;
    }
    .screenshot {
      background: #fff;
      display: inline-block;
      &.card-satisfaction {
        position: absolute;
        z-index: 0;
        transform: rotateX(5deg) rotateY(20deg);
        box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
          0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 4px;
        right: 0;
        top: -50px;
        @media (max-width: 900px) {
          top: 0;
        }
      }
    }
  }
}
</style>
