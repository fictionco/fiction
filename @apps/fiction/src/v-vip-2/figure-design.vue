<template>
  <figure ref="wrapper" class="factor-figure figure-design">
    <div class="designs">
      <div class="designs-left">
        <div
          v-for="(design, index) in designsLeft"
          :key="index"
          class="design"
          :class="design.class"
        >
          <img :src="design.image" :alt="design.alt" />
        </div>
      </div>

      <div class="designs-right">
        <div
          v-for="(design, index) in designsRight"
          :key="index"
          class="design"
          :class="design.class"
        >
          <img :src="design.image" :alt="design.alt" />
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
      designsLeft: [
        {
          class: `design-typography light`,
          image: require("./img/design-typography.svg"),
          alt: `Design - Typography`
        },
        {
          class: `design-color light`,
          image: require("./img/design-color.svg"),
          alt: `Design - Color`
        },
        {
          class: `design-boxes light`,
          image: require("./img/design-boxes.svg"),
          alt: `Design - Boxes`
        }
      ],
      designsRight: [
        {
          class: `design-illustrations dark`,
          image: require("./img/design-illustrations.svg"),
          alt: `Design - Illustrations`
        },
        {
          class: `design-logo dark`,
          image: require("./img/factor-vip-logo.svg"),
          alt: `Design - Factor VIP`
        },
        {
          class: `design-icons light`,
          image: require("./img/design-icons.svg"),
          alt: `Design - Icons`
        },
        {
          class: `design-elements light`,
          image: require("./img/design-elements.svg"),
          alt: `Design - Elements`
        }
      ]
    }
  }
})
</script>

<style lang="less">
figure.figure-design {
  position: relative;

  .designs {
    padding: 0 0 1rem;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    align-items: start;
    .designs-left,
    .designs-right {
      display: grid;
      grid-gap: 1rem;
      position: relative;
    }
    .designs-left {
      justify-items: end;
    }
    .design {
      display: inline-block;
      max-width: 400px;
      z-index: 10;
      box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
        0px 50px 100px rgba(27, 34, 60, 0.1);
      border-radius: 4px;
      img {
        width: 100%;
      }
      &.light {
        background: #ffffff;
      }
      &.dark {
        background: #1b223c;
      }
      &.design-typography {
        margin-top: 4rem;
        padding: 1rem 2rem 1rem 1rem;
        width: 214px;
        max-width: fit-content;
        //width: 90%;
      }
      &.design-color {
        padding: 0.7rem;
        width: 180px;
        max-width: fit-content;
        //width: 75%;
      }
      &.design-boxes {
        padding: 0.7rem;
        width: 320px;
        position: absolute;
        right: 0;
        bottom: -4.4rem;
      }
      &.design-illustrations {
        padding: 1rem 0.7rem;
        width: 170px;
      }
      &.design-logo {
        padding: 0.7rem;
        width: 110px;
        position: absolute;
        top: 9.7rem;
        right: -2rem;
      }
      &.design-icons {
        padding: 0 1.2rem;
        width: 210px;
      }
      &.design-elements {
        padding: 1rem;
        width: 280px;
      }
    }
    @media (max-width: 900px) {
      .design {
        &.design-logo {
          display: none;
        }
      }
    }
  }
}
</style>
