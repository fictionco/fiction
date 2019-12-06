<template>
  <figure ref="wrapper" class="factor-figure figure-manage">
    <img :src="require(`./img/traffic.svg`)" alt="Sparkline Traffic" />
    <div class="sparkline">
      <div v-for="(point, index) in points" :key="index" class="point-wrap">
        <div class="point">
          <div class="point-text">{{ point.text }}</div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: {},
  data() {
    return {
      points: [
        {
          text: `Social`
        },
        {
          text: `SEO`
        },
        {
          text: `DevOps`
        },
        {
          text: `Support`
        },
        {
          text: `Debugging`
        },
        {
          text: `Scaling`
        }
      ]
    }
  }
})
</script>

 <style lang="less">
figure.figure-manage {
  position: relative;
  height: auto;
  padding-bottom: 4rem;
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
        background: rgba(0, 0, 0, 0.1);
        padding: 0.2rem 1rem;
        border-radius: 8px;
        .point-text {
          font-size: 1.6rem;
          line-height: 1.4;
        }
      }
      &:nth-child(1) {
        .point {
          transform: translateY(-7rem) translateX(0rem);
          @media (max-width: 900px) {
            transform: translateY(-6rem) translateX(-1rem);
          }
        }
      }
      &:nth-child(2) {
        .point {
          transform: translateY(-10rem) translateX(15vw);
        }
      }
      &:nth-child(3) {
        .point {
          transform: translateY(1rem) translateX(9rem);
          @media (max-width: 900px) {
            transform: translateY(0rem) translateX(6rem);
          }
        }
      }
      &:nth-child(4) {
        .point {
          transform: translateY(-9rem) translateX(-20vw);
        }
      }
      &:nth-child(5) {
        .point {
          transform: translateY(5rem) translateX(-1rem);
        }
      }
      &:nth-child(6) {
        .point {
          transform: translateY(-1rem) translateX(-24vw);
          @media (max-width: 900px) {
            transform: translateY(-3rem) translateX(-36vw);
          }
        }
      }
    }
  }
}
</style>
