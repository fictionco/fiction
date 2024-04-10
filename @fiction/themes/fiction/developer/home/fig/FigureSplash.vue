<script lang="ts" setup>
import { vue } from '@fiction/core'

import codeEditor from './img/figure-splash-code-editor.svg'
</script>

<template>
  <figure
    class="figure-splash-container relative transition-opacity"
  >
    <div class="figure-wrap m-auto h-full w-full aspect-square">
      <div class="splash-figure code">
        <div class="stage">
          <div class="main wrap">
            <div
              class="scroller"
              :style="{ backgroundImage: `url(${codeEditor})` }"
            />
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<style lang="less">
figure.figure-splash-container {

  .splash-figure,
  .stage {
    width: 90%;
    height: 90%;
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

}
</style>
