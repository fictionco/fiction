<template>
  <figure ref="wrapper" class="factor-figure figure-design">
    <div class="designs">
      <div class="column">
        <div class="left-inner">
          <div
            v-for="(design, index) in designsLeft"
            :key="index"
            class="design"
            :class="design.class"
          >
            <img :src="design.image" :alt="design.alt" />
          </div>
        </div>
      </div>

      <div class="column">
        <div class="right-inner">
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
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  components: {},
  data() {
    return {
      designsLeft: [
        {
          class: `design-typography light`,
          image: require("./img/design-typography.svg"),
          alt: `Design - Typography`,
        },
        {
          class: `design-color light`,
          image: require("./img/design-color.svg"),
          alt: `Design - Color`,
        },
        {
          class: `design-boxes light`,
          image: require("./img/design-boxes.svg"),
          alt: `Design - Boxes`,
        },
      ],
      designsRight: [
        {
          class: `design-illustrations dark`,
          image: require("./img/design-illustrations.svg"),
          alt: `Design - Illustrations`,
        },
        {
          class: `design-logo light`,
          image: require("./img/factor-vip-logo.svg"),
          alt: `Design - Factor VIP`,
        },
        {
          class: `design-icons light`,
          image: require("./img/design-icons.svg"),
          alt: `Design - Icons`,
        },
        {
          class: `design-elements light`,
          image: require("./img/design-elements.svg"),
          alt: `Design - Elements`,
        },
      ],
    }
  },
}
</script>

<style lang="less">
figure.figure-design {
  position: relative;

  .designs {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
    min-height: 475px;

    @media (max-width: 900px) {
      min-height: 400px;
    }

    .column {
      position: relative;

      .left-inner,
      .right-inner {
        position: absolute;
        display: grid;
        grid-gap: 1rem;
      }
      .left-inner {
        top: 3rem;
        right: 0;
        justify-items: end;
      }
      .right-inner {
        top: 0;
        left: 0;
        justify-items: start;
      }
    }

    .design {
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
        max-width: 210px;
        padding: 1rem 2rem 1rem 1rem;
      }
      &.design-color {
        max-width: 180px;
        padding: 0.7rem;
      }
      &.design-boxes {
        width: 240px;
        padding: 0.7rem;
      }
      &.design-illustrations {
        max-width: 170px;
        padding: 1rem 0.7rem;
      }
      &.design-logo {
        max-width: 76px;
        padding: 0.5rem;
        position: absolute;
        top: 9.1rem;
        left: 10.2rem;

        @media (max-width: 900px) {
          display: none;
        }
      }
      &.design-icons {
        max-width: 210px;
        padding: 0 1.2rem;
      }
      &.design-elements {
        max-width: 280px;
        padding: 1rem;
      }
    }
  }
}
</style>
