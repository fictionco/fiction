<template>
  <div class="page-landing">
    <section class="feature">
      <!-- <pre>
        {{ post }}
      </pre>-->
      <div class="feature-inner">
        <h3 class="pre-title">{{ post.settings.pageHeadingPre }}</h3>
        <h1 class="title">{{ post.title }}</h1>
        <factor-post-edit :post-id="post._id" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { factorPostEdit } from "@factor/post"
//import { factorLink, factorIcon } from "@factor/ui"
import { renderMarkdown } from "@factor/api/markdown"
import { setting, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    //"el-cta": () => import("./el/cta.vue"),
    // factorLink,
    // factorIcon
    factorPostEdit
  },
  // props: {
  //   post: { type: Object, default: () => {} }
  // },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    post(this: any) {
      return stored("post") || {}
    },
    settings(this: any) {
      return this.post.settings || {}
    }
  },
  watch: {},
  templateSettings() {
    return [
      {
        input: "select",
        label: "Header Alignment",
        description: "Alignment of the page header",
        _id: "headerAlignment",
        list: ["left", "center", "right"],
        default: "left"
      },
      {
        input: "text",
        label: "Pre-heading",
        _id: "pageHeadingPre",
        default: ""
      },
      {
        input: "text",
        label: "Heading",
        description: "Primary page heading",
        _id: "pageHeading"
      },
      {
        input: "text",
        label: "Sub Heading",
        _id: "pageHeadingSub"
      },
      {
        input: "text",
        label: "Button Link",
        _id: "buttonLink"
      },
      {
        input: "text",
        label: "Button Text",
        _id: "buttonText"
      },
      {
        input: "text",
        label: "Boxes Title",
        _id: "boxesTitle"
      }
      // {
      //   _id: "boxes",
      //   input: "sortable",
      //   label: "Feature Boxes",
      //   description: "Some feature boxes",
      //   default: [{ __title: "Box 1" }, { __title: "Box 2" }],
      //   settings: [
      //     {
      //       input: "text",
      //       label: "Heading",
      //       _id: "heading",
      //       default: "Box"
      //     },
      //     {
      //       input: "image-upload",
      //       label: "Icon",
      //       _id: "icon"
      //     }
      //   ]
      // },
      // {
      //   input: "text",
      //   label: "Brands Title",
      //   _id: "brandsTitle"
      // },
      // {
      //   _id: "brands",
      //   input: "sortable",
      //   label: "Feature Brands",
      //   description: "Some feature brands",
      //   inputs: [
      //     {
      //       input: "text",
      //       label: "Link",
      //       description: "(Optional)",
      //       _id: "link"
      //     },
      //     {
      //       input: "image-upload",
      //       label: "Image",
      //       _id: "image"
      //     }
      //   ]
      // }
    ]
  },
  methods: { setting, renderMarkdown }
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

  .factor-btn.default {
    color: var(--color-primary);
    letter-spacing: -0.03em;
  }
  // feature
  .feature {
    background-color: var(--color-primary);
    color: #fff;
    position: relative;

    &:before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.05);
      clip-path: polygon(0 0, 0 100%, 100% 100%);
    }

    .feature-inner {
      display: flex;
      align-items: center;
      text-align: center;
      flex-direction: column;
      max-width: 650px;
      margin: 0 auto;
      padding: 7em 0;
      @media (max-width: 900px) {
        padding: 4em 0;
      }
      .pre-title {
        position: relative;
        padding-bottom: 2em;
        text-transform: uppercase;
      }
      .title {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em;
        @media (max-width: 900px) {
          font-size: 2em;
        }
      }
      .subtitle {
        opacity: 0.5;
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
      @media (max-width: 900px) {
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
            width: 50px;
            max-width: 100%;
            display: block;
            margin: 0 auto;
          }
        }
        .box-title {
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
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        .box {
          padding: 0;
        }
      }
    }
  }

  .brands {
    background: var(--color-bg-alt);
    padding: 3em 0;
    .title {
      font-weight: 600;
      font-size: 2.4em;
      letter-spacing: -0.03em;
      margin-bottom: 1em;
      text-align: center;
      @media (max-width: 900px) {
        font-size: 2em;
      }
    }
    .brands-inner {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      grid-gap: 20px 70px;
      align-items: center;
      .brand-image {
        max-width: 100%;
        img {
          max-width: 100%;
          display: block;
          margin: 0 auto;
        }
      }
      @media (max-width: 900px) {
        .brand-image {
          padding: 2em;
        }
      }
    }
  }
}
</style>
