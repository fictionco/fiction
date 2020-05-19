<template>
  <figure ref="wrapper" class="figure-dashboard">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="dashboard">
        <div class="screenshot card-dashboard">
          <img src="./img/dashboard.svg" alt="Dashboard" />
        </div>
        <div class="screenshot phone">
          <img src="./img/card-phone.svg" alt="Dashboard Mobile" />
        </div>
        <div class="screenshot magnify">
          <img src="./img/magnify.jpg" alt="Dashboard Magnify" />
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
figure.figure-dashboard {
  max-width: 100%;
  @media (max-width: 900px) {
    margin: 1rem auto 4rem;
    width: 450px;
  }

  .stage-wrap {
    transform-origin: center right;
  }
  .dashboard {
    padding: 30% 0;
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
      &.card-dashboard {
        position: absolute;
        top: 0;
        left: 0;
        right: auto;
        z-index: 0;
        transform: scale(1) perspective(1040px) rotateY(-6deg) rotateX(3deg) rotate(2deg)
          translateZ(-50px);
        box-shadow: 0px 20px 90px rgba(50, 50, 93, 0.13),
          0 15px 35px rgba(50, 50, 93, 0.11), 0 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 4px;
      }
      &.magnify {
        position: absolute;
        top: 40px;
        left: 0;
        transform: translateX(-30px) scale(1) perspective(1050px);
        background: #ffffff;
        box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
        overflow: hidden;
        border-radius: 50%;
        img {
          height: 150px;
          width: 150px;
          box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
            0px 15px 35px rgba(50, 50, 93, 0.11), 0px -5px 15px rgba(0, 0, 0, 0.07);
        }
      }
      &.phone {
        position: absolute;
        top: 70px;
        right: 90px;
        transform: scale(1) translateZ(50px) translateY(1%) rotateY(-15deg) rotateX(10deg)
          rotate(4deg);
        background: #ffffff;
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          -19px 32.5px 95px -5px rgba(50, 50, 93, 0.3),
          13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 20px;
      }
    }
    perspective: 1000px;
  }
}
</style>
