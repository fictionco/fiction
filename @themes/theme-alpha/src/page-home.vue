<template>
  <div class="page-landing">
    <section class="feature">
      <div class="feature-inner">
        <h3 class="pre-title">{{ setting("home.preheadline") }}</h3>
        <h1 v-formatted-text="setting('home.headline')" class="title" />
        <div class="subtitle">{{ setting("home.subheadline") }}</div>

        <div class="actions">
          <factor-link
            v-for="(action, i) in setting('home.actions')"
            :key="i"
            :path="action.path"
            btn="default"
            size="large"
          >
            {{ action.text }}
            <factor-icon icon="fas fa-arrow-right" />
          </factor-link>
        </div>
      </div>
    </section>

    <section class="boxes">
      <div class="mast">
        <div v-formatted-text="setting('home.boxesTitle')" class="title" />
      </div>

      <div class="mast boxes-inner">
        <div v-for="(box, i) in setting('home.boxes')" :key="i" class="box">
          <div v-if="box.icon" class="box-icon">
            <img :src="box.icon" :alt="box.heading" />
          </div>
          <h2 class="box-title">{{ box.heading }}</h2>
          <p class="box-description">{{ box.description }}</p>
        </div>
      </div>
    </section>

    <el-clients />

    <el-cta />
  </div>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    "el-clients": () => import("./el/clients.vue"),
    "el-cta": () => import("./el/cta.vue"),
    factorLink,
    factorIcon
  },
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description")
    }
  },
  methods: { setting }
  // pageTemplate() {
  //   return {
  //     name: "Landing Page",
  //     description: "Minimalist landing page template.",
  //     inputs: [
  //       {
  //         input: "text",
  //         label: "Pre-heading",
  //         key: "pageHeadingPre"
  //       },
  //       {
  //         input: "text",
  //         label: "Heading",
  //         description: "Primary page heading",
  //         key: "pageHeading"
  //       },
  //       {
  //         input: "text",
  //         label: "Sub Heading",
  //         key: "pageHeadingSub"
  //       },
  //       {
  //         input: "text",
  //         label: "Button Link",
  //         key: "buttonLink"
  //       },
  //       {
  //         input: "text",
  //         label: "Button Text",
  //         key: "buttonText"
  //       },
  //       {
  //         input: "text",
  //         label: "Boxes Title",
  //         key: "boxesTitle"
  //       },
  //       {
  //         key: "boxes",
  //         input: "sortable",
  //         label: "Feature Boxes",
  //         description: "Some feature boxes",
  //         inputs: [
  //           {
  //             input: "text",
  //             label: "Heading",
  //             key: "heading"
  //           },
  //           {
  //             input: "textarea",
  //             label: "Description",
  //             key: "description"
  //           },
  //           {
  //             input: "image-upload",
  //             label: "Icon",
  //             key: "icon"
  //           }
  //         ]
  //       },
  //       {
  //         input: "text",
  //         label: "Brands Title",
  //         key: "brandsTitle"
  //       },
  //       {
  //         key: "brands",
  //         input: "sortable",
  //         label: "Feature Brands",
  //         description: "Some feature brands",
  //         inputs: [
  //           {
  //             input: "text",
  //             label: "Link",
  //             description: "(Optional)",
  //             key: "link"
  //           },
  //           {
  //             input: "image-upload",
  //             label: "Image",
  //             key: "image"
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // },
  // methods: {
  //   settings() {
  //     return ["test"]
  //   }
  // }
})
</script>

<style lang="less">
.page-landing {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  // feature
  .feature {
    background-color: var(--color-primary, #1a49bd);
    color: var(--color-white);
    position: relative;

    &:before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.05);
      clip-path: polygon(0 0, 0 100%, 100% 100%);
      -webkit-clip-path: polygon(0 0, 0 100%, 100% 100%);
      z-index: 0;
    }

    .feature-inner {
      display: flex;
      align-items: center;
      text-align: center;
      flex-direction: column;
      max-width: 650px;
      margin: 0 auto;
      padding: 7em 0;
      @media (max-width: 767px) {
        padding: 4em 0;
      }
      .pre-title {
        position: relative;
        padding-bottom: 2em;
        text-transform: uppercase;
        &:after {
          background-color: var(--color-tertiary);
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 24px;
          height: 7px;
          margin: -3.5px 0 0 -12px;
          transform: skewY(-16deg) scaleX(1);
          transform-origin: 0 100%;
        }
      }
      .title {
        font-weight: var(--font-weight-bold, 800);
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.2em;
        line-height: 1.6em;
      }
      .actions {
        margin-top: 1.5em;
      }
    }
  }

  //Boxes
  .boxes {
    padding: 5em 0;
    .title {
      font-weight: 600;
      font-size: 2.4em;
      letter-spacing: -0.03em;
      margin-bottom: 1em;
      text-align: center;
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .boxes-inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 60px 30px;

      .box {
        padding: 0 3em;
        text-align: center;
        .box-icon {
          margin-bottom: 1em;
          img {
            max-width: 50px;
            display: block;
            margin: 0 auto;
            @media (max-width: 767px) {
              margin: 0;
            }
          }
        }
        .box-title {
          font-size: 1.4em;
          font-weight: 600;
          letter-spacing: -0.03em;
          margin-bottom: 0.5em;
        }
        .box-description {
          opacity: 0.5;
          font-size: 1.2em;
          line-height: 1.6em;
        }
      }
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        .box {
          padding: 0;
          text-align: left;
        }
      }
    }
  }
}
</style>
