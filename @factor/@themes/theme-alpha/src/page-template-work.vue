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

    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <div class="post-item">
            <img :src="require(`./img/test.jpg`)" alt="test">
            <h2 class="title">Post Title</h2>
            <p>Post Category</p>
          </div>
          <div class="post-item">
            <img :src="require(`./img/test.jpg`)" alt="test">
            <h2 class="title">Post Title</h2>
            <p>Post Category</p>
          </div>
          <div class="post-item">
            <img :src="require(`./img/test.jpg`)" alt="test">
            <h2 class="title">Post Title</h2>
            <p>Post Category</p>
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
      name: "Work Page",
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
  .hero {
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      width: 70%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: @color-bg;
      @media (max-width: 1024px) {
        width: 100%;
      }
    }

    .hero-inner {
      position: relative;
      padding: 3em 0;
      max-width: 650px;
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
    }
  }

  .posts {
    padding: 6em 0;
    .posts-inner {
      display: grid;
      grid-gap: 60px;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
      .post-item {
        text-align: center;
        .title {
          font-weight: 600;
        }
        img {
          margin-bottom: 1em;
          width: 100%;
        }
      }
    }
  }
}
</style>