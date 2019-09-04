<template>
  <figure ref="wrapper" class="powered-by">
    <div class="stage-wrap" :style="{transform: `scale(${scale})`}">
      <div class="stage">
        <div class="factor-stack">
          <img src="./img/factor-stack.svg" >
        </div>
        <div class="scene">
          <div class="box-1 icon-box">
            <div class="line depart" />
            <div class="line arrive" />
            <div class="box a">
              <img src="./img/vue.svg" >
              <caption>Vue.js</caption>
            </div>
          </div>
          <div class="box-2 icon-box">
            <div class="line depart" />
            <div class="line arrive" />
            <div class="box b">
              <img src="./img/nodejs.svg" >
              <caption>Node.js</caption>
            </div>
          </div>
          <div class="box-3 icon-box">
            <div class="line depart" />

            <div class="box">
              <img src="./img/mongodb.svg" >
              <caption>MongoDB</caption>
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script>
export default {
  data() {
    return {
      width: 500
    }
  },
  computed: {
    scale() {
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
    getWidth() {
      return this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 100
    }
  }
}
</script>

<style lang="less">
figure.powered-by {
  --color-wire: #e6ebf1;
  --color-shaded: #ced2dd;
  max-width: 100%;
  .stage-wrap {
    transform-origin: center left;
  }
  .stage {
    padding: 30% 0;
    width: 500px;
    position: relative;
    transform: translateX(-70px) scale(1.3);
    .factor-stack {
      position: absolute;
      left: 80%;
      bottom: 53%;
      z-index: 100;
      transform: translateX(-46px);
    }
    perspective: 1000px;
    .scene {
      background-image: url("./img/dot.svg");
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transform: rotateX(60deg) rotateY(0deg) rotate(45deg) scale(1.2)
        translate(124px, -45px);
      transform-style: preserve-3d;

      .icon-box {
        position: absolute;
        transform: translateZ(1px);
        transform-style: preserve-3d;
        .box {
          transform-style: preserve-3d;
          text-align: center;
          background: #fff;
          box-shadow: 0 0 1px var(--color-wire);
          overflow: visible;

          padding: 10px 15px;

          z-index: 5;
          img {
            max-width: 48px;
            display: inline-block;
          }
          caption {
            display: block;
            font-size: 0.8em;
            text-align: center;
          }

          &:after {
            background-color: var(--color-shaded);
            bottom: 0;
            content: "";
            right: 0;
            position: absolute;
            top: 0;
            width: 5px;
            z-index: -10;
            transform: translateX(50%) rotateY(-90deg) translateX(-2.5px);
          }
          &:before {
            background-color: var(--color-wire);

            content: "";
            bottom: 0;
            left: 0;
            right: 0;
            position: absolute;
            height: 5px;
            width: 100%;
            z-index: -10;
            transform: translateY(50%) rotateX(-90deg) translateY(2.5px);
          }
        }
        .line {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 1;
          border: 0 solid var(--color-wire);
        }

        &.box-1 {
          bottom: 10%;
          left: 15%;
          .line.depart {
            width: 2em;
            height: 2em;
            border-left-width: 2px;
            border-top-width: 2px;
            border-top-left-radius: 7px;
            transform: translateY(-100%);
          }
          .line.arrive {
            width: 2.5em;
            height: 4.5em;
            border-right-width: 2px;
            border-bottom-width: 2px;
            border-bottom-right-radius: 7px;
            transform: translateY(-100%) translateY(-2em) translateY(2px)
              translateX(7px);
          }
        }
        &.box-2 {
          bottom: 0%;
          left: 40%;
          .line {
            left: auto;
            right: 50%;
          }
          .line.depart {
            width: 2em;
            height: 2em;
            border-right-width: 2px;
            border-top-width: 2px;
            border-top-right-radius: 7px;
            transform: translateY(-100%);
          }
          .line.arrive {
            width: 3em;
            height: 6em;
            border-left-width: 2px;
            border-bottom-width: 2px;
            border-bottom-left-radius: 7px;
            transform: translateY(-100%) translateY(-2em) translateY(2px)
              translateX(-7px);
          }
        }
        &.box-3 {
          bottom: 5%;
          left: 65%;
          .line {
            left: auto;
            right: 50%;
          }
          .line.depart {
            width: 12em;
            height: 8.5em;
            border-right-width: 2px;
            border-top-width: 2px;
            border-top-right-radius: 7px;
            transform: translateY(-100%);
          }
          .line.arrive {
            width: 11em;
            height: 4em;
            border-left-width: 2px;
            border-bottom-width: 2px;
            border-bottom-left-radius: 7px;
            transform: translateY(-100%) translateY(-3em) translateY(2px)
              translateX(-7px);
          }
        }
      }
    }
  }
}
</style>