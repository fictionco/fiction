<template>
  <figure ref="wrapper" class="splash-figure-container" @click="nextSlide()">
    <div class="figure-wrap">
      <div v-if="activeSlide.id == 'dashboard'" class="splash-figure dashboard">
        <div class="stage-icons-wrap">
          <div class="stage-icons">
            <img src="./img/plugin-jobs.svg" alt="Plugin Jobs" class="flying-icon icon-1" />
            <img src="./img/plugin-email.svg" alt="Plugin Email" class="flying-icon icon-2" />
            <img src="./img/plugin-ssr.svg" alt="Plugin SSR" class="flying-icon icon-3" />
            <img src="./img/plugin-blog.svg" alt="Plugin Blog" class="flying-icon icon-4" />
            <img src="./img/plugin-notify.svg" alt="Plugin Notify" class="flying-icon icon-5" />
            <img
              src="./img/plugin-highlight-code.svg"
              alt="Plugin Highlight Code"
              class="flying-icon icon-6"
            />
          </div>
        </div>
        <div class="stage">
          <img src="./img/dashboard.svg" alt="Dashboard" class="main" />
          <img src="./img/mobile-device.svg" alt="Mobile Device" class="mobile-device" />
        </div>
      </div>
      <div v-if="activeSlide.id == 'themes'" class="splash-figure themes">
        <div class="stage">
          <!-- <img src="./img/zeno-pricing.svg" alt="Zeno Theme Pricing" class="pricing" /> -->
          <img src="./img/zeno-theme.svg" alt="Zeno Factor Theme" class="main" />
          <img src="./img/zeno-team.svg" alt="Zeno Theme Team" class="team" />
          <!-- <img src="./img/tablet-dashboard.svg" alt="Tablet" class="tablet" /> -->
        </div>
      </div>
    </div>

    <div class="splash-caption">
      <div class="prev">&larr;</div>
      <div class="text">{{ activeSlide.caption }}</div>
      <div class="next">&rarr;</div>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      width: 500,
      active: 0,
      figures: [
        { id: "dashboard", caption: "Your CMS Dashboard" },
        { id: "themes", caption: "Themes you'll love" }
      ],
      timer: false,
      animationInterval: 7000
    }
  },
  computed: {
    scale(this: any) {
      return Math.max(Math.min(this.width / 900, 1), 0.5)
    },
    activeSlide(this: any) {
      return this.figures[this.active]
    }
  },

  mounted() {
    this.width = window.innerWidth

    window.addEventListener("resize", () => {
      this.width = window.innerWidth < 900 ? window.innerWidth : 900
    })

    this.runTimer()
  },
  methods: {
    getWidth(this: any) {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    },

    nextSlide(this: any) {
      if (this.active == this.figures.length - 1) {
        this.active = 0
      } else {
        this.active++
      }

      this.runTimer()
    },

    runTimer(this: any) {
      // clearTimeout(this.timer)
      // this.timer = setTimeout(() => this.nextSlide(), this.animationInterval)
    }
  }
})
</script>

<style lang="less">
figure.splash-figure-container {
  position: relative;

  .figure-wrap {
    margin: 0 auto;
    width: 900px;
    height: 600px;
    transform-origin: left center;
    @media (max-width: 1200px) {
      width: 600px;
      height: 400px;
    }
    @media (max-width: 900px) {
      margin: 4rem auto 2rem;
      width: 450px;
      height: 300px;
    }
  }

  .splash-figure,
  .stage {
    width: 100%;
    height: 100%;
  }

  .splash-figure {
    position: relative;
    transform-origin: center;
    perspective: 1400px;
  }
  .stage {
    perspective: 800px;
  }

  .splash-figure.themes {
    img {
      position: absolute;
    }
    .main {
      border-radius: 4px;
      z-index: 10;
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
      animation: themeTransform 1s 1 forwards;
    }

    .tablet,
    .pricing,
    .team {
      position: absolute;
      border-radius: 4px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05), 0px 7px 14px rgba(50, 50, 93, 0.1);
    }
    .tablet {
      max-width: 410px;
      border-radius: 8px;
      bottom: 0;
      left: 0;
      //    animation: tabletTransform 1s 1 forwards;
      // transform: perspective(1040px) rotate(-2deg) rotateX(-2deg) rotateY(11deg)
      //    translateZ(20px) scale(1);
    }
    .team {
      max-width: 35%;
      z-index: 100;
      bottom: 9%;
      left: 0rem;
      animation: tabletTransform 1s 1 forwards;
    }
    .pricing {
      max-width: 240px;
      top: 0;
      right: 0;

      animation: themeTransform 1s 1 forwards;
      //  transform: rotateY(-13deg);
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
  .stage-icons-wrap {
    position: absolute;
    width: 120%;
    height: 10%;
    top: 1rem;

    //transform-style: preserve-3d;
    .stage-icons {
      width: 100%;
      height: 100%;
      perspective: 500px;
      transform: translateX(-3em) rotateZ(-6deg);
    }
    .flying-icon {
      transform-origin: center;
      opacity: 0;
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
      position: absolute;
      border-radius: 50%;
      box-shadow: 0px 30px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
    }
    .icon-1 {
      top: 0;
      left: 5%;
      transform: scale(0.5) rotate3d(0, 0, 0, 18deg) translate3d(47%, 0px, 0);
      animation: iconTransform 0.3s 0s forwards;
    }
    .icon-2 {
      top: 0;
      left: 16%;
      transform: scale(0.8) rotate3d(-1, -1, 0, -18deg) translate3d(56%, -75%, 0);
      animation: iconTransform 0.3s 0.1s forwards;
    }
    .icon-3 {
      top: 0;
      left: 49%;
      transform: scale(1.4) rotate3d(1, 0, 1, 49deg) translateY(-40%);
      animation: iconTransform 0.3s 0.3s forwards;
    }
    .icon-4 {
      top: 0;
      left: 83%;
      transform: scale(2.4) rotate(20deg) rotateY(-50deg);
      animation: iconTransform 0.3s 0.6s forwards;
    }
    .icon-5 {
      top: 0;
      left: 36%;
      transform: scale(1.3) translateY(-36%) rotateY(17deg) rotate3d(1, 0, 1, 34deg);
      animation: iconTransform 0.3s 0.2s forwards;
    }
    .icon-6 {
      top: 0;
      left: 66%;
      transform: scale(1.6) translateY(-61%) rotateY(-61deg) rotate(-15deg);
      animation: iconTransform 0.3s 0.4s forwards;
    }
  }
  .splash-figure.dashboard .stage {
    .main {
      border-radius: 4px;
      z-index: 10;
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);

      animation: mainTransform 1s 1 forwards;
    }
    .mobile-device {
      max-width: 18%;
      position: absolute;
      left: 32px;
      bottom: 10px;
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

    @keyframes iconTransform {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
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
  .splash-caption {
    font-size: 1.5em;
    letter-spacing: -0.02em;
    text-align: center;
    color: #8ba8bf;

    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    width: 70%;

    .next,
    .prev {
      font-size: 1.3em;
      opacity: 0.1;
      cursor: pointer;
      &:hover {
        opacity: 1;
        color: #0471ff;
      }
    }
  }
}
</style>
