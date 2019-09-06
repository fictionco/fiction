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
              <page-icon v-if="vipicon.icon" class="rad-icon" :icon="vipicon.icon" />
            </div>
            <!-- <div v-for="i in 8" :key="i" class="rad">
              <div class="rad-icon">
                <page-icon icon="powered" />
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script>
import pageUtils from "./utils"
export default {
  components: {
    "page-icon": () => import("./icon-vip.vue")
  },
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
          icon: "infrastructure2"
        }
      ]
    }
  },
  mixins: [pageUtils().figureMixin({ ref: "wrapper", width: 500 })]
}
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
      transform: translate(1rem, -2rem);
      .stage {
      }
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
    @keyframes spin {
      100% {
        transform: rotate(1turn);
      }
    }
    transform: rotateY(15deg);
    transition: all 0.5s;
    &:hover {
      transform: rotateY(25deg);
      .rotater {
        animation: spin 30s infinite linear;
      }
    }
    .rotater {
      width: 100px;
      height: 100px;

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
