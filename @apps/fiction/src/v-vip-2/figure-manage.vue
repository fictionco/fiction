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

<script>
export default {
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
}
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
        background: #32394f;
        padding: 0 0.7rem;
        border-radius: 4px;
        .point-text {
          font-size: 1.6rem;
          line-height: 1.4;
          transform: skew(7deg, 0);
        }
      }
      &:nth-child(1) {
        .point {
          transform: skew(-7deg, 0) translateY(-7rem) translateX(0rem);
        }
      }
      &:nth-child(2) {
        .point {
          transform: skew(-7deg, 0) translateY(-10rem) translateX(9rem);
        }
      }
      &:nth-child(3) {
        .point {
          transform: skew(-7deg, 0) translateY(1rem) translateX(9rem);
        }
      }
      &:nth-child(4) {
        .point {
          transform: skew(-7deg, 0) translateY(-9rem) translateX(-10rem);
        }
      }
      &:nth-child(5) {
        .point {
          transform: skew(-7deg, 0) translateY(5rem) translateX(-1rem);
        }
      }
      &:nth-child(6) {
        .point {
          transform: skew(-7deg, 0) translateY(-1rem) translateX(-13rem);
        }
      }
    }
  }
}
</style>
