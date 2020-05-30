<template>
  <figure ref="wrapper" class="figure-vip">
    <div class="stage-wrap">
      <div class="stage" :style="{ transform: `scale(${scale})` }">
        <div class="feature-circle">
          <div class="core">
            <img :src="require(`./img/vip-bolt.svg`)" alt="Factor VIP Bolt" />
          </div>

          <div class="rotator">
            <div v-for="(vipicon, index) in vipicons" :key="index" class="rad">
              <div
                v-if="vipicon.icon"
                class="icon"
                :style="{backgroundImage: `url(${vipicon.icon})`}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import { figureMixin } from "./utils"

export default {
  mixins: [figureMixin({ ref: "wrapper", width: 500 })],
  data() {
    return {
      vipicons: [
        {
          icon: require("./img/icon-forum.svg"),
        },
        {
          icon: require("./img/icon-forms.svg"),
        },
        {
          icon: require("./img/icon-chat-bubbles.svg"),
        },
        {
          icon: require("./img/icon-analytics.svg"),
        },
        {
          icon: require("./img/icon-seo.svg"),
        },
        {
          icon: require("./img/icon-gallery.svg"),
        },
        {
          icon: require("./img/icon-themes.svg"),
        },
        {
          icon: require("./img/icon-socialize.svg"),
        },
      ],
    }
  },
}
</script>

<style lang="less">
figure.figure-vip {
  align-self: center;
  justify-self: center;
  width: 100%;
  height: 100%;
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }

  .feature-circle {
    width: 100%;
    height: 100%;
    position: relative;
    transform: rotateY(-5deg);
    transition: all 0.5s;

    @media (max-width: 900px) {
      transform: rotateY(0);
    }

    .rad {
      position: absolute;
      width: 80px;
      height: 80px;
    }
    .core {
      z-index: 10;
      display: grid;
      justify-content: center;
      align-items: center;
      height: 100%;
      height: 100%;

      img {
        width: 100%;
      }
    }
    .rotator {
      position: absolute;
      top: 40%;
      left: 43%;
      @media (max-width: 900px) {
        left: 40%;
      }
    }

    &:hover {
      transform: rotateY(-15deg);
      .rotator {
        transform: rotate(5turn);
        transition: transform 60s cubic-bezier(0.25, 0.1, 0.25, 1);
      }
    }
    .rotator {
      width: 80px;
      height: 80px;
      transform: rotate(2turn);
      transition: transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1);

      .rad {
        .icon {
          background-size: cover;
          background-position: 50%;
          border-radius: 50%;
          box-shadow: 0 2px 3px rgba(50, 50, 93, 0.13), 0 2px 5px rgba(50, 50, 93, 0.11),
            0 5px 15px rgba(0, 0, 0, 0.07);
          padding: 50%;
        }

        &:nth-child(1) {
          transform: rotate(45deg);
          .icon {
            transform: translateY(12rem) rotate(-45deg);
          }
        }
        &:nth-child(2) {
          transform: rotate(90deg);
          .icon {
            transform: translateY(12rem) rotate(-90deg);
          }
        }
        &:nth-child(3) {
          transform: rotate(135deg);
          .icon {
            transform: translateY(12rem) rotate(-135deg);
          }
        }
        &:nth-child(4) {
          transform: rotate(180deg);
          .icon {
            transform: translateY(12rem) rotate(-180deg);
          }
        }
        &:nth-child(5) {
          transform: rotate(225deg);
          .icon {
            transform: translateY(12rem) rotate(-225deg);
          }
        }
        &:nth-child(6) {
          transform: rotate(270deg);
          .icon {
            transform: translateY(12rem) rotate(-270deg);
          }
        }
        &:nth-child(7) {
          transform: rotate(315deg);
          .icon {
            transform: translateY(12rem) rotate(-315deg);
          }
        }
        &:nth-child(8) {
          transform: rotate(0deg);
          .icon {
            transform: translateY(12rem) rotate(-0deg);
          }
        }
      }
    }
  }

  @media (max-width: 900px) {
    height: 420px;
    margin: 2rem 0;
  }
}
</style>
