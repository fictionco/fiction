<template>
  <figure ref="wrapper" class="header-figure">
    <div class="stage-wrap">
      <div class="stage">
        <div class="panel">
          <img src="./img/dashboard.svg" class="dashboard" alt="dashboard" />
          <div class="icons">
            <div v-for="icon in icons" :key="icon.name" class="icon-wrap">
              <div class="icon">
                <img :src="icon.img" :alt="`${icon.name} icon`" />
              </div>
              <div class="name">{{ icon.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      icons: [
        { name: "Factor", img: require("./img/pin.svg") },
        { name: "Mongo", img: require("./img/mongo.svg") },
        { name: "Node", img: require("./img/node.svg") },
        { name: "Vue", img: require("./img/vue.svg") },
      ],
    }
  },
})
</script>
<style lang="less">
.header-figure {
  max-width: 625px;
  margin: 0 auto;
  .stage {
    transform-style: preserve-3d;
    perspective: 600px;
    position: relative;

    .panel {
      padding-right: 2em;
      position: relative;
      z-index: 10;
      transform: scale(1.1) perspective(800px) rotateY(-4deg) rotateX(2deg) rotate(1deg)
        translateZ(-40px);
      box-shadow: -1px 1px 4px 0 rgba(26, 26, 67, 0.1),
        -9px 25.5px 15px -25px rgba(50, 50, 93, 0.3),
        -10.4px 25.5px 75px -37.5px rgba(0, 0, 0, 0.3);
      img.dashboard {
        margin-bottom: 2em;
      }
    }
    .dot-circle {
      position: absolute;
      top: 10px;
      z-index: 0;
    }
    .code-bg {
      position: absolute;
      top: 0;
      right: 4em;
      z-index: 0;

      // transform: scale(1) perspective(1000px) rotateY(3deg) rotateX(2deg)
      //   rotate(-1deg) translateZ(-40px);
    }
    .icons {
      // position: absolute;
      // right: 0;
      // top: 3em;
      // height: 300px;
      z-index: 70;
      display: flex;
      max-width: 330px;
      margin: 0 auto;
      justify-content: space-between;
      .icon-wrap {
        text-align: center;
        .name {
          transition: 0.3s opacity;
          opacity: 0;
          font-size: 0.9em;
        }

        &:hover {
          .name {
            opacity: 1;
          }
          .icon {
            background-color: rgba(255, 255, 255, 0.2);
          }
        }
      }
      .icon {
        transition: 0.3s all;
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.2em;
        height: 3.2em;

        border-radius: 50%;
        img {
          max-width: 25px;
          max-height: 32px;
        }
      }
    }
  }
  @media (max-width: 900px) {
    .stage {
      min-height: 370px;
      .icons {
        top: 0;
      }
      .panel {
        transform: none;
        padding: 2em 0 0;
        img.dashboard {
          margin-bottom: 2em;
        }
      }
    }
    img {
      max-width: 100%;
    }
  }
}
</style>
