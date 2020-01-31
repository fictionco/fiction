<template>
  <figure ref="wrapper" class="splash-figure">
    <div class="stage active">
      <div class="stage-icons">
        <img src="./img/plugin-jobs.svg" alt="Plugin Jobs" class="icon-1" />
        <img src="./img/plugin-email.svg" alt="Plugin Email" class="icon-2" />
        <img src="./img/plugin-ssr.svg" alt="Plugin SSR" class="icon-3" />
        <img src="./img/plugin-blog.svg" alt="Plugin Blog" class="icon-4" />
        <img src="./img/plugin-notify.svg" alt="Plugin Notify" class="icon-5" />
        <img src="./img/plugin-highlight-code.svg" alt="Plugin Highlight Code" class="icon-6" />
      </div>
      <img src="./img/dashboard.svg" alt="Dashboard" class="main" />
      <img src="./img/mobile-device.svg" alt="Mobile Device" class="mobile-device" />
      <p class="splash-content">Content Management</p>
    </div>
    <div class="stage2">
      <div class="stage-pages">
        <img src="./img/zeno-team.svg" alt="Zeno Theme Team" class="page-2" />
        <img src="./img/zeno-pricing.svg" alt="Zeno Theme Pricing" class="page-3" />
      </div>
      <img src="./img/zeno-theme.svg" alt="Zeno Factor Theme" class="main" />
      <img src="./img/tablet-dashboard.svg" alt="Tablet Device" class="tablet" />
      <p class="splash-content">Themes</p>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      width: 500
    }
  },
  computed: {
    scale(this: any) {
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
    getWidth(this: any) {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    }
  }
})
</script>

<style lang="less">
figure.splash-figure {
  .stage,
  .stage2 {
    display: none;
    &.active {
      display: block;
    }

    position: relative;
    padding: 3em 0 2em;
    transform-origin: center;
    perspective: 1400px;
  }
  .stage2 {
    .main {
      margin: 50px auto 0;
      border-radius: 4px;
      z-index: 10;
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);

      //Animation
      animation: themeTransform 1s 1 forwards;
    }
    .stage-pages {
      position: relative;
      max-width: 100%;
      right: -5rem;
    }
    .tablet,
    .page-2,
    .page-3 {
      position: absolute;
      border-radius: 4px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05), 0px 7px 14px rgba(50, 50, 93, 0.1);
    }
    .tablet {
      max-width: 310px;
      border-radius: 8px;
      bottom: 6rem;
      left: 0;
      animation: tabletTransform 1s 1 forwards;
    }
    .page-2 {
      max-width: 240px;
      top: -1rem;
      right: 0rem;
    }
    .page-3 {
      max-width: 240px;
      top: -1rem;
      right: 16rem;
    }

    @keyframes themeTransform {
      from {
        transform: scale(0.9);
      }
      to {
        transform: scale(0.9) perspective(500px) rotateX(1deg) rotateY(-2deg)
          rotateZ(0deg) translateZ(-15px);
      }
    }

    @keyframes tabletTransform {
      from {
        transform: scale(0.9);
      }
      to {
        transform: perspective(1040px) rotate(-2deg) rotateX(-2deg) rotateY(11deg)
          translateZ(20px) scale(1);
      }
    }
  }
  .stage {
    .stage-icons {
      position: relative;
      max-width: 100%;
      perspective: 1400px;
      transform: rotate3d(1, 1, 1, -13deg);
      .icon-1,
      .icon-2,
      .icon-3,
      .icon-4,
      .icon-5,
      .icon-6 {
        position: absolute;
        border-radius: 50%;
        box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
          0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
      }
      .icon-1 {
        top: 0rem;
        left: 3rem;
        transform: scale(0.5) translateZ(100px);
      }
      .icon-2 {
        top: -1rem;
        left: 14rem;
        transform: scale(0.8) translateZ(225px);
      }
      .icon-3 {
        top: -1rem;
        left: 24rem;
        transform: scale(1) translateZ(450px);
      }
      .icon-4 {
        top: 1.4rem;
        right: 14.5rem;
        transform: scale(1.1) translateZ(860px);
      }
      .icon-5 {
        top: 1.4rem;
        left: 18rem;
        transform: scale(1.2) translateZ(150px);
      }
      .icon-6 {
        top: 1.4rem;
        left: 30rem;
        transform: translateZ(350px);
      }
    }
    .main {
      margin: 50px auto 0;
      border-radius: 4px;
      z-index: 10;
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);

      //Animation
      animation: mainTransform 1s 1 forwards;
    }
    .mobile-device {
      max-width: 110px;
      position: absolute;
      left: 20px;
      bottom: 110px;
      border-radius: 12px;
      box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
        0px 50px 100px rgba(27, 34, 60, 0.1), 20px -20px 35px rgba(80, 102, 119, 0.15);
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);

      //Animation
      animation: mobileTransform 1s 1 forwards;

      &:hover {
        box-shadow: 0px 5px 15px rgba(4, 150, 255, 0.3),
          0px 15px 35px rgba(4, 150, 255, 0.1), 0px 50px 100px rgba(27, 34, 60, 0.1),
          20px -20px 35px rgba(80, 102, 119, 0.15);

        transform: rotate(0deg) rotateX(0deg) rotateY(0deg) translateX(2em)
          translateZ(60px) scale(1.2);
      }
    }

    @keyframes mainTransform {
      from {
        transform: scale(0.9);
      }
      to {
        transform: scale(0.9) perspective(500px) rotateX(1deg) rotateY(-2deg)
          rotateZ(0deg) translateZ(-15px);
      }
    }

    @keyframes mobileTransform {
      from {
        transform: scale(0.9);
      }
      to {
        transform: perspective(1040px) rotate(-2deg) rotateX(-2deg) rotateY(11deg)
          translateZ(20px) scale(1);
      }
    }
  }
  .splash-content {
    margin-top: 3rem;
    font-size: 1.3em;
    font-weight: 600;
    letter-spacing: -0.03em;
    text-align: center;
    color: #8ba8bf;
  }
}
</style>
