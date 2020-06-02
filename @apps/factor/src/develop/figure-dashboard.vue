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
    perspective: 1000px;
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform-origin: center;
    }
  }
  .dashboard {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform-style: preserve-3d;
    @media (max-width: 900px) {
      transform: translate(-0, -0px);
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
        transform: rotateY(38deg) rotateX(6deg) rotate(0deg) translateZ(-50px);

        box-shadow: 0px 20px 90px rgba(50, 50, 93, 0.13),
          0 15px 35px rgba(50, 50, 93, 0.11), 0 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 4px;
      }
      &.magnify {
        display: none;
        position: absolute;
        top: 40px;
        left: 0;
        transform: translateX(-30px) rotateY(-10deg) rotateX(5deg);
        background: #ffffff;
        box-shadow: 0px 20px 90px rgba(50, 50, 93, 0.13),
          0 15px 35px rgba(50, 50, 93, 0.11), 0 5px 15px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        border-radius: 50%;
        img {
          height: 120px;
          width: 120px;
          box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
            0px 15px 35px rgba(50, 50, 93, 0.11), 0px -5px 15px rgba(0, 0, 0, 0.07);
        }
      }
      &.phone {
        position: absolute;
        bottom: -15%;
        right: -6%;
        width: 114px;
        transform: translateZ(50px) translateY(1%) rotateY(-29deg) rotateX(9deg)
          rotate(3deg);
        background: #fff;
        box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
          -19px 32.5px 95px -5px rgba(50, 50, 93, 0.3),
          13.4px 37.5px 55px -37.5px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border-radius: 20px;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
