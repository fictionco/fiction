<template>
  <figure ref="wrapper" class="stage-container vip-figure">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div class="feature-circle">
          <div class="core">
            <div class="rad">
              <div class="rad-icon">
                <page-icon icon="core" />
              </div>
            </div>
          </div>

          <div class="rotater">
            <div v-for="(vipicon, index) in vipicons" :key="index" class="rad">
              <page-icon v-if="vipicon.icon" :icon="vipicon.icon" class="rad-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"
import { figureMixin } from "./utils"

export default Vue.extend({
  components: {
    "page-icon": () => import("./icon-vip.vue")
  },
  mixins: [figureMixin({ ref: "wrapper", width: 500 })],
  data() {
    return {
      vipicons: [
        {
          icon: "seo"
        },
        {
          icon: "design"
        },
        {
          icon: "dev"
        },
        {
          icon: "node"
        },
        {
          icon: "github"
        },
        {
          icon: "infrastructure"
        },
        {
          icon: "support"
        },
        {
          icon: "cloud"
        }
      ]
    }
  }
})
</script>

<style lang="less">
#feature-vip {
  position: relative;
  z-index: 1;
  .feature-content {
    color: #fff;
  }

  background: var(--color-bg-splash);
  @media (max-width: 900px) {
    .feature-figure-container {
      height: 500px;
      transform: translate(0, -2rem);
    }
  }
}
figure.vip-figure {
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  // .stage-wrap {
  //   transform-origin: center left;
  // }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    perspective: 1000px;

    left: 0;
    top: 0;
  }
  .feature-circle {
    width: 100%;
    height: 100%;
    position: relative;
    transform: rotateY(15deg);
    transition: all 0.5s;
    @media (max-width: 900px) {
      transform: rotateY(0);
    }

    .rad {
      position: absolute;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
    }

    .core,
    .rotater {
      position: absolute;
      top: 45%;
      left: 40%;
    }

    // @keyframes spinOn {
    //   100% {
    //     transform: rotate(15urn);
    //   }
    // }
    // @keyframes spinOff {
    //   100% {
    //     transform: rotate(2turn);
    //   }
    // }

    &:hover {
      transform: rotateY(25deg);
      .rotater {
        //animation: spinOn 30s infinite linear;
        transform: rotate(5turn);
        transition: transform 60s cubic-bezier(0.25, 0.1, 0.25, 1);
      }
    }
    .rotater {
      width: 100px;
      height: 100px;
      //animation: spinOff 1.5s linear;
      transform: rotate(2turn);
      transition: transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1);

      .rad {
        .rad-icon {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        &:nth-child(1) {
          transform: rotate(45deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-45deg);
          }
        }
        &:nth-child(2) {
          transform: rotate(90deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-90deg);
          }
        }
        &:nth-child(3) {
          transform: rotate(135deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-135deg);
          }
        }
        &:nth-child(4) {
          transform: rotate(180deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-180deg);
          }
        }
        &:nth-child(5) {
          transform: rotate(225deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-225deg);
          }
        }
        &:nth-child(6) {
          transform: rotate(270deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-270deg);
          }
        }
        &:nth-child(7) {
          transform: rotate(315deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-315deg);
          }
        }
        &:nth-child(8) {
          transform: rotate(0deg);
          .rad-icon {
            transform: translateY(12rem) rotate(-0deg);
          }
        }
      }
    }
  }
}
</style>
