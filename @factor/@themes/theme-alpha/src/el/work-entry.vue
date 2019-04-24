<template>
  <article class="entry" :class="formatClass">
    <section v-if="format == 'single'" class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
            <factor-link class="back" path="/work">
              <i class="fa fa-arrow-left" /> All
            </factor-link>
            <h1 class="title">
              <factor-link :path="path">{{ title }}</factor-link>
            </h1>
            <el-tags class="tags" :tags="tags" />
          </div>
        </div>
      </div>
    </section>

    <factor-link :path="path">
      <div
        class="img-wrap"
        :style="{'background-image': `url(`+ require(`../img/test.jpg`) + `)` }"
      />
      {{ image.url }}
    </factor-link>

    <div class="entry-wrap">
      <div v-if="format == 'listing'" class="entry-text">
        <h1 class="title">
          <factor-link :path="path">{{ title }}</factor-link>
        </h1>
        <el-tags class="tags" :tags="tags" />
      </div>

      <div v-if="format == 'single'" class="entry-text">
        <div class="mast">
          <div class="content">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  components: {
    "el-tags": () => import("./tags")
  },
  props: {
    format: { type: String, default: "" },
    image: { type: String, default: "" },
    authors: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    date: { type: [String, Number], default: "" },
    path: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    postId: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  },
  computed: {
    formatClass() {
      const f = this.format ? this.format : "single"

      return `format-${f}`
    }
  },
  methods: {}
}
</script>
<style lang="less">
.entry {
  a {
    transition: all 0.2s ease-in-out;
  }

  // Single Post
  &.format-single {
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
        a {
          color: inherit;
          &:hover,
          &:active {
            color: @color-primary;
          }
        }
        .back {
          font-size: 1.1em;
          text-transform: uppercase;
        }
        .title {
          font-weight: 600;
          font-size: 3em;
          letter-spacing: -0.03em;
          margin: 0.5em 0;
          @media (max-width: 767px) {
            font-size: 2em;
          }
        }
        // .tags {
        //   opacity: 0.5;
        //   font-size: 1.2em;
        //   line-height: 1.6em;
        // }
      }
    }
    .entry-text {
      padding: 2em 0;
      .content {
        margin: 0 auto;
        max-width: 760px;
        font-size: 1.5em;
        line-height: 1.4em;
        @media (max-width: 767px) {
          font-size: 1em;
        }
        img {
          max-width: 100%;
        }
      }
    }
  }

  // Listing Post
  &.format-listing {
    text-align: center;

    .img-wrap {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 550px;
      margin-bottom: 1em;
      transform: scale(1);
      transition: all 0.2s ease-in-out;
      &:hover {
        transform: scale(0.95);
      }
    }
    .title {
      font-weight: 600;
      font-size: 2em;
      line-height: 1.1;
    }
    .category {
      opacity: 0.5;
    }
  }
}
</style>