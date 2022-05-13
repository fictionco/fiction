<template>
  <figure
    ref="wrapper"
    class="figure-splash-container relative transition-opacity"
    :class="loaded ? 'opacity-100' : 'opacity-0'"
  >
    <div class="figure-wrap m-auto mt-8 mb-4 md:mb-0" @click="nextSlide()">
      <div v-if="activeSlide.id == 'dashboard'" class="splash-figure dashboard">
        <div class="stage-icons-wrap">
          <div class="stage-icons">
            <img
              src="../img/icon-plugin-job-board.svg"
              alt="Plugin Jobs"
              class="flying-icon icon-1 h-12 w-12"
            />
            <img
              src="../img/icon-plugin-email-list.svg"
              alt="Plugin Email"
              class="flying-icon icon-2 h-16 w-16"
            />
            <img
              src="../img/figure-splash-ssr.svg"
              alt="Plugin SSR"
              class="flying-icon icon-3"
            />
            <img
              src="../img/icon-plugin-blog.svg"
              alt="Plugin Blog"
              class="flying-icon icon-4 h-16 w-16"
            />
            <img
              src="../img/figure-splash-notify.svg"
              alt="Plugin Notify"
              class="flying-icon icon-5"
            />
            <img
              src="../img/icon-plugin-syntax-highlight.svg"
              alt="Plugin Highlight Code"
              class="flying-icon icon-6 h-16 w-16"
            />
          </div>
        </div>
        <div class="stage">
          <img
            src="../img/figure-splash-dashboard.svg"
            alt="Dashboard"
            class="main"
          />
          <img
            src="../img/figure-splash-mobile-device.svg"
            alt="Mobile Device"
            class="mobile-device"
          />
        </div>
      </div>
      <div v-if="activeSlide.id == 'themes'" class="splash-figure themes">
        <div class="stage">
          <img
            src="../img/figure-splash-zeno-theme.svg"
            alt="Zeno Factor Theme"
            class="main"
          />
          <img
            src="../img/figure-splash-zeno-team.svg"
            alt="Zeno Theme Team"
            class="team"
          />
        </div>
      </div>
      <div v-if="activeSlide.id == 'code'" class="splash-figure code">
        <div class="stage">
          <div class="main wrap">
            <div
              class="scroller"
              :style="{ backgroundImage: `url(${codeEditor})` }"
            />
          </div>
          <img
            src="../img/figure-splash-terminal.svg"
            alt="Terminal"
            class="team"
          />
        </div>
      </div>
    </div>

    <div
      class="-mt-4 flex flex-col items-center justify-center md:flex-row md:space-x-3"
    >
      <div
        v-for="(fig, i) in figures"
        :key="i"
        class="mb-2 cursor-pointer rounded-md border px-4 py-1 text-xs font-semibold hover:border-primary-500 hover:text-primary-500"
        :class="
          activeSlide.id == fig.id
            ? 'border-primary-500 text-primary-500'
            : 'border-color-200 text-slate-500 '
        "
        @click="setActive(i)"
      >
        {{ fig.caption }}
      </div>
    </div>
  </figure>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue"

import codeEditor from "../img/figure-splash-code-editor.svg"

const loaded = ref(false)

onMounted(() => (loaded.value = true))
const figures = ref([
  { id: "dashboard", caption: "Build Apps" },
  { id: "themes", caption: "Build Sites" },
  { id: "code", caption: "Clean and Minimal Code" },
])
/**
 * Initial Active figure
 */
const active = ref<number>(0)
/**
 * Current Active figure
 */
const activeSlide = computed(() => {
  return figures.value[active.value]
})
/**
 * Switch Figure timer
 */
let timer: NodeJS.Timeout | undefined = undefined
const animationInterval = ref<number>(20_000)

/**
 * Next Figure
 */
const nextSlide = (): void => {
  if (active.value == figures.value.length - 1) {
    active.value = 0
  } else {
    active.value++
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  runTimer()
}

const setActive = (ind: number): void => {
  active.value = ind
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  runTimer()
}

const runTimer = (): void => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => nextSlide(), animationInterval.value)
}
</script>

<style lang="less">
figure.figure-splash-container {
  .figure-wrap {
    width: 700px;
    height: 500px;
    transform-origin: left center;
    @media (max-width: 1200px) {
      width: 600px;
      height: 400px;
    }
    @media (max-width: 900px) {
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
    .main {
      width: 100%;
    }
  }
  .stage {
    perspective: 800px;
  }

  .splash-figure.themes,
  .splash-figure.code {
    img {
      position: absolute;
    }

    .main {
      border-radius: 12px;
      z-index: 10;
      box-shadow: 10px 10px 6px rgb(50 50 93 / 7%), 0px 2px 3px rgb(0 0 0 / 22%);
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
      animation: themeTransform 1s 1 forwards;
      overflow: hidden;
      &.wrap {
        width: 100%;
        height: 90%;
        .scroller {
          overflow: hidden;
          box-shadow: none;
          width: 100%;
          height: 1000%;
          animation: codeScrollTransform 60s 0s linear;
          background-size: contain;
        }
      }
      img {
        animation: codeScrollTransform 60s 1s linear;
        width: 100%;
      }
    }

    .tablet,
    .pricing,
    .team {
      position: absolute;
      border-radius: 4px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05),
        0px 7px 14px rgba(50, 50, 93, 0.1);
    }
    .tablet {
      max-width: 410px;
      border-radius: 8px;
      bottom: 0;
      left: 0;
    }
    .team {
      max-width: 35%;
      z-index: 100;
      bottom: 12%;
      left: 0rem;
      animation: tabletTransform 1s 1 forwards;
      box-shadow: 6px 6px 6px rgb(50 50 93 / 7%), 0px 2px 3px rgb(0 0 0 / 22%);
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
        transform: scale(1) perspective(500px) rotateX(1deg) rotateY(-2deg)
          rotateZ(0deg) translateZ(-35px);
      }
    }

    @keyframes tabletTransform {
      from {
        transform: scale(0.9);
      }
      to {
        transform: perspective(1040px) rotate(-2deg) rotateX(-2deg)
          rotateY(11deg) translateZ(20px) scale(1);
      }
    }
  }
  .stage-icons-wrap {
    position: absolute;
    width: 120%;
    height: 10%;
    top: 1rem;
    .stage-icons {
      width: 100%;
      height: 100%;
      perspective: 700px;
      transform: translateX(-4em) rotate(-2.5deg);
    }
    .flying-icon {
      transform-origin: center;
      opacity: 0;
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
      position: absolute;
      border-radius: 50%;
      box-shadow: 6px 6px 6px rgb(50 50 93 / 7%), 0px 2px 3px rgb(0 0 0 / 22%);
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
      transform: scale(0.8) rotate3d(-1, -1, 0, -18deg)
        translate3d(56%, -75%, 0);
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
      transform: scale(1.3) translateY(-36%) rotateY(17deg)
        rotate3d(1, 0, 1, 34deg);
      animation: iconTransform 0.3s 0.2s forwards;
    }
    .icon-6 {
      top: 0;
      left: 66%;
      transform: scale(1.6) translateY(-41%) rotateY(-61deg) rotate(-15deg);
      animation: iconTransform 0.3s 0.4s forwards;
    }
  }
  .splash-figure.dashboard .stage {
    .main {
      border-radius: 4px;
      z-index: 10;
      box-shadow: 8px 8px 6px rgb(50 50 93 / 7%), 0px 2px 3px rgb(0 0 0 / 22%);

      animation: mainTransform 1s 1 forwards;
    }
    .mobile-device {
      max-width: 18%;
      position: absolute;
      left: 32px;
      bottom: 50px;
      border-radius: 12px;
      box-shadow: 6px 6px 6px rgb(50 50 93 / 7%), 0px 2px 3px rgb(0 0 0 / 22%);
      transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
      animation: mobileTransform 1s 1 forwards;

      &:hover {
        transform: rotate(0deg) rotateX(0deg) rotateY(0deg) translateX(2em)
          translateZ(60px) scale(1.2);
      }
    }

    @keyframes codeScrollTransform {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(-50%);
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
        transform: scale(1) perspective(500px) rotateX(1deg) rotateY(-2deg)
          rotateZ(0deg) translateZ(-45px);
      }
    }

    @keyframes mobileTransform {
      from {
        transform: scale(0.9);
      }
      to {
        transform: perspective(1040px) rotate(-2deg) rotateX(-2deg)
          rotateY(11deg) translateZ(20px) scale(1);
      }
    }
  }
  // .splash-caption {
  //   text-align: center;

  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   margin: 0 auto;
  //   width: 70%;

  //   .next,
  //   .prev {
  //     font-size: 1.3em;
  //     opacity: 0.1;
  //     cursor: pointer;
  //     &:hover {
  //       opacity: 1;
  //       color: var(--color-primary);
  //     }
  //   }
  // }
}
</style>
