<template>
  <div class="page-work">
    <section class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
            <h1 class="title">{{ post.title }}</h1>
            <h2 class="heading">{{ post.pageHeading }}</h2>
            <div v-formatted-text="$markdown.render(post.content)" class="content entry-content" />
          </div>
          <div>
            <div
              v-if="post.heroImage"
              :style="{'background-image': `url(`+ post.heroImage[0].url + `)` }"
              class="hero-image"
            />
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
      inputs: [
        {
          input: "text",
          label: "Heading",
          key: "pageHeading"
        },
        {
          input: "image-upload",
          label: "Image",
          key: "heroImage"
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
.page-work {
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
  .hero {
    // background-color: @color-primary;
    // color: @color-white;
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      width: 70%;
      height: 100%;
      top: 0;
      right: auto;
      bottom: 0;
      background-color: @color-bg;
      @media (max-width: 1024px) {
        width: 100%;
      }
    }

    .hero-inner {
      position: relative;
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 30px;
      align-items: center;
      padding: 7em 0;
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      @media (max-width: 767px) {
        padding: 4em 0;
      }
      .title {
        font-size: 1.1em;
        text-transform: uppercase;
      }
      .heading {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em 0;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .content {
        opacity: 0.5;
        font-size: 1.2em;
        line-height: 1.6em;
      }
      .hero-image {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 450px;
        max-width: 300px;
        box-shadow: 20px 60px 120px 0 rgba(0, 0, 0, 0.33);
        border-top-left-radius: 40px;
        @media (max-width: 767px) {
          margin: 0 auto;
          max-width: 100%;
        }
      }
    }
  }
}
</style>