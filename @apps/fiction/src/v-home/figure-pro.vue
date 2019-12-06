<template>
  <figure ref="wrapper" class="stage-container pro-figure">
    <div class="stage-wrap" :style="{ transform: `scale(${scale})` }">
      <div class="stage">
        <div class="grid">
          <div v-for="(feature, index) in features" :key="index" class="cell">
            <icon-pro v-if="feature.icon" class="icon-pro" :icon="feature.icon" />
            {{ feature.text }}
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
    "icon-pro": () => import("./icon-pro.vue")
  },
  mixins: [figureMixin({ ref: "wrapper", width: 500 })],
  data() {
    return {
      features: [
        {
          icon: "pro-extensions",
          text: `Pro Extensions`
        },
        {
          icon: "white-label",
          text: `White Label`
        },
        {
          icon: "community",
          text: `Community`
        },
        {
          icon: "code",
          text: `Developer Options`
        },
        {
          icon: "support",
          text: `Enhanced Support`
        },

        {
          icon: "tools",
          text: `Client Tools`
        },
        {
          icon: "seo",
          text: `SEO and Social`
        },
        {
          icon: "ecommerce",
          text: `eCommerce`
        },
        {
          icon: "business",
          text: `Business`
        },
        {
          icon: "community",
          text: `Community`
        },
        {
          icon: "code",
          text: `Developer`
        },
        {
          icon: "community",
          text: `Community`
        }
      ]
    }
  }
})
</script>

<style lang="less">
#feature-pro {
  background: var(--color-bg-alt);
  position: relative;
  z-index: 0;
  .feature-figure-container {
    width: 170%;
  }
  @media (max-width: 900px) {
    .feature-figure-container {
      height: 350px;
    }
  }
}
figure.pro-figure {
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  transform: translateY(6rem);
  left: 0;
  // .stage-wrap {
  //   transform-origin: center left;
  // }
  // &:after {
  //   content: "";
  //   -webkit-mask-image: linear-gradient(transparent, #fff 70%);
  //   mask-image: linear-gradient(transparent, #fff 70%);
  //   bottom: 0;
  //   position: absolute;
  //   left: 0;
  //   width: 100%;
  //   height: 40%;
  // }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    left: 0;
    top: 0;
    perspective: 500px;
    // -webkit-mask-image: linear-gradient(90deg, #000, #000, transparent 99%);
    .grid {
      //  -webkit-mask-image: linear-gradient(#000, #000, transparent 99%);
      --row-height: 80px;
      height: 100%;
      display: grid;

      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;

      transform: rotateY(-4deg);
      .cell {
        transition: all 0.3s;
        border-radius: 0.5rem;
        background: #fff;
        box-shadow: 0 22.5px 25px -25px rgba(50, 50, 93, 0.2),
          0 2px 3px rgba(50, 50, 93, 0.1);

        font-size: 1.1em;
        text-transform: uppercase;
        font-weight: 700;
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem 0.5rem 2rem;
        .icon-pro {
          margin-right: 1em;
        }
        &:hover {
          color: #ff0076;
          box-shadow: 0 22.5px 25px -25px rgba(50, 50, 93, 0.5),
            0 3px 2px rgba(50, 50, 93, 0.2);
        }
      }
    }
  }
  @media (max-width: 900px) {
    opacity: 0.6;
    transform: translateY(1em);
    .stage {
      perspective: 0;
      .grid {
        transform: scale(0.8);
        // transform: rotateY(0deg) rotateX(2deg) translateX(-4em);
        .cell {
          padding: 0.5rem 1rem 0.5rem;
        }
      }
    }
    // .stage-wrap,
    // .stage {
    //   width: 100%;
    //   height: 110%;
    // }
  }
}
</style>
