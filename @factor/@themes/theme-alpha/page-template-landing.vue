<template>
  <div class="landing-page">
    <section class="feature">
      <div class="feature-inner">
        <h3 class="pre-title">{{ post.pageHeadingPre }}</h3>
        <h1 class="title">{{ post.pageHeading }}</h1>
        <div class="subtitle">{{ post.pageHeadingSub }}</div>

        <div class="actions">
          <factor-link path="/work" btn="default" size="large">
            View Work
            <i class="fa fa-angle-right" />
          </factor-link>
        </div>
      </div>
    </section>

    <section class="boxes">
      <div class="title">Check out the skills</div>

      <div class="mast boxes-inner">
        <div v-for="(box, i) in post.boxes" :key="i" class="box">
          <div v-if="box.icon" class="box-icon">
            <img :src="box.icon[0].url">
          </div>
          <h2 class="box-title">{{ box.heading }}</h2>
          <p class="box-description">{{ box.description }}</p>
        </div>
      </div>
    </section>

    <section class="brands">
      <div class="title">Clients</div>
      <div class="mast brands-inner">
        <div v-for="(brand, i) in post.brands" :key="i" class="brand">
          <div v-if="brand.link" class="brand-image">
            <factor-link :path="brand.link">
              <img :src="brand.image[0].url">
            </factor-link>
          </div>
          <div v-else class="brand-image">
            <img :src="brand.image[0].url">
          </div>
        </div>
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta")
  },
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {},
  pageTemplate() {
    return {
      name: "Landing Page",
      description: "Minimalist landing page template.",
      inputs: [
        {
          input: "text",
          label: "Pre-heading",
          key: "pageHeadingPre"
        },
        {
          input: "text",
          label: "Heading",
          description: "Primary page heading",
          key: "pageHeading"
        },
        {
          input: "text",
          label: "Sub Heading",
          key: "pageHeadingSub"
        },
        {
          key: "boxes",
          input: "sortable",
          label: "Feature Boxes",
          description: "Some feature boxes",
          inputs: [
            {
              input: "text",
              label: "Heading",
              key: "heading"
            },
            {
              input: "textarea",
              label: "Description",
              key: "description"
            },
            {
              input: "image-upload",
              label: "Icon",
              key: "icon"
            }
          ]
        },
        {
          key: "brands",
          input: "sortable",
          label: "Feature Brands",
          description: "Some feature brands",
          inputs: [
            // {
            //   input: "text",
            //   label: "Heading",
            //   key: "heading"
            // },
            // {
            //   input: "textarea",
            //   label: "Description",
            //   key: "description"
            // },
            {
              input: "text",
              label: "Link",
              description: "(Optional)",
              key: "link"
            },
            {
              input: "image-upload",
              label: "Image",
              key: "image"
            }
          ]
        }
      ]
    }
  },
  methods: {
    settings() {
      return ["test"]
    }
  }
}
</script>

<style lang="less">
.landing-page {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .factor-btn.default {
    color: @color-primary;
    letter-spacing: -0.03em;
  }
  // feature
  .feature {
    background-color: @color-primary;
    color: @color-white;

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
          background-color: @color-tertiary;
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
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em;
        @media (max-width: 767px) {
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
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .boxes-inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 60px 30px;
      align-items: center;

      .box {
        padding: 0 3em;
        text-align: center;
        .box-icon {
          max-width: 100%;
          margin-bottom: 1em;
          img {
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
    }
  }

  .brands {
    background: @color-bg;
    padding: 3em 0;
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
    .brands-inner {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 20px 30px;
      align-items: center;
      .brand-image {
        max-width: 100%;
        img {
          max-width: 100%;
          display: block;
          margin: 0 auto;
        }
      }
    }
  }

  // .feature {
  //   min-height: 50vh;
  //   text-align: center;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   .feature-content {
  //     max-width: 700px;
  //     padding: 2em;
  //   }
  //   h1 {
  //     font-size: 3.5em;
  //     font-weight: 600;
  //     line-height: 1;
  //     margin-bottom: 1rem;
  //   }
  //   .sub {
  //     font-size: 1.6em;
  //     opacity: 0.6;
  //     margin-bottom: 2rem;
  //   }
  // }
  // .feature-boxes {
  //   padding: 0 2em;
  //   max-width: 960px;
  //   margin: 3em auto;
  //   position: relative;
  //   display: grid;
  //   grid-template-columns: 1fr 1fr 1fr;
  //   grid-gap: 1.5em;
  //   margin: 2em auto;
  //   .box {
  //     min-width: 0;
  //   }
  //   .box-heading {
  //     font-size: 1.3em;
  //     font-weight: 600;
  //     margin-bottom: 0.5em;
  //   }
  //   .box-description {
  //     opacity: 0.7;
  //     line-height: 1.4;
  //   }
  //   .box-icon {
  //     max-width: 100%;
  //     margin-bottom: 1.5em;
  //     img {
  //       max-width: 100%;
  //       display: block;
  //     }
  //   }
  // }
}
</style>