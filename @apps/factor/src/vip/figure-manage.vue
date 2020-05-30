<template>
  <figure ref="wrapper" class="factor-figure figure-manage-wrap">
    <div class="graph">
      <div class="screenshot">
        <img :src="require(`./img/traffic.svg`)" alt="Sparkline Traffic" />
        <div class="sparkline">
          <div v-for="(point, index) in points" :key="index" class="point-wrap">
            <div class="point">
              <div class="point-text">{{ point.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  components: {},
  data() {
    return {
      points: [
        {
          text: `Social`,
        },
        {
          text: `SEO`,
        },
        {
          text: `DevOps`,
        },
        {
          text: `Support`,
        },
        {
          text: `Debugging`,
        },
        {
          text: `Scaling`,
        },
      ],
    }
  },
}
</script>

<style lang="less">
figure.figure-manage-wrap {
  position: relative;
  height: auto;
  padding-bottom: 4rem;
  transform-origin: center right;
  perspective: 1000px;
  transform-style: preserve-3d;
  .graph {
    padding: 34% 0;
    width: 500px;
    position: relative;
    transform-style: preserve-3d;

    .screenshot {
      position: absolute;
      z-index: 0;
      transform: rotateX(5deg) rotateY(20deg);
      box-shadow: 0 50px 100px rgba(50, 50, 93, 0.13), 0 15px 35px rgba(50, 50, 93, 0.11),
        0 5px 15px rgba(0, 0, 0, 0.07);
      overflow: hidden;
      border-radius: 4px;
      right: 0;
      top: -50px;
    }
  }
  img {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  .sparkline {
    position: absolute;
    top: 45%;
    left: 40%;
    height: 33px;
    .point-wrap {
      position: absolute;
      width: auto;
      height: 33px;
      .point {
        padding: 0.2rem 1rem;
        border-radius: 8px;
        font-weight: 700;
        color: #fff;

        .point-text {
          font-size: 1.2rem;
          line-height: 1.4;
        }
      }
      &:nth-child(1) {
        .point {
          transform: translateY(-2rem) translateX(0);
          background: #020f46;
          @media (max-width: 900px) {
            transform: translateY(-6rem) translateX(-1rem);
          }
        }
      }
      &:nth-child(2) {
        .point {
          background: #0471ff;
          transform: translateY(-8rem) translateX(14vw);
        }
      }
      &:nth-child(3) {
        .point {
          transform: translateY(4rem) translateX(9rem);
          background: #40cf8f;
          @media (max-width: 900px) {
            transform: translateY(0rem) translateX(6rem);
          }
        }
      }
      &:nth-child(4) {
        .point {
          transform: translateY(-6rem) translateX(-11vw);
          background: #814ae6;
        }
      }
      &:nth-child(5) {
        .point {
          transform: translateY(9rem) translateX(-1rem);
          background: #ff5b66;
        }
      }
      &:nth-child(6) {
        .point {
          transform: translateY(3rem) translateX(-13vw);
          //transform: translateY(-1rem) translateX(-24vw);
          background: #0471ff;
          @media (max-width: 900px) {
            transform: translateY(-3rem) translateX(-36vw);
          }
        }
      }
    }
  }
}
</style>
