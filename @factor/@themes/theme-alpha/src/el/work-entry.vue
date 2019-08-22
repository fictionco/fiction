<template>
  <article class="entry" :class="formatClass">
    <h3 v-if="format == 'single'">Single</h3>
    <h3 v-if="format == 'index'">Index</h3>
    <section v-if="format == 'single'" class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
            <app-link class="back" path="/work">
              <factor-icon icon="arrow-left" />All
            </app-link>
            <h1 class="heading">
              <app-link :path="path">{{ title }}</app-link>
            </h1>
            <!-- <el-tags class="tags" :tags="tags" /> -->
          </div>
          <!-- <div v-if="images != ''">
            <div
              :style="{ 'background-image': `url(` + images + `)` }"
              class="hero-image"
            />
          </div> -->
        </div>
      </div>
    </section>

    <!-- <app-link v-if="format == 'index'" :path="path">
      <pre>{{ post }}</pre>
      IMAGE
      <div class="img-wrap" :style="{ 'background-image': 'url(' + images + ')' }" />
      IMAGE
    </app-link> -->

    <div class="entry-wrap">
      <div v-if="format == 'index'" class="entry-text">
        <h1 class="title">
          <factor-link :path="$post.link(post._id)">{{ post.title }}</factor-link>
        </h1>
        <!-- <el-tags class="tags" :tags="tags" /> -->
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
  // components: {
  //   "el-tags": () => import("./tags")
  // },
  props: {
    format: { type: String, default: "" },
    images: { type: String, default: "" },
    authors: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    date: { type: [String, Number], default: "" },
    path: { type: String, default: "" },
    //tags: { type: Array, default: () => [] },
    postId: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
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
        background-color: var(--color-bg-alt, #f3f5fb);
        @media (max-width: 1024px) {
          width: 100%;
        }
      }

      .hero-inner {
        position: relative;
        padding: 3em 0;
        a {
          color: inherit;
          &:hover,
          &:active {
            color: var(--color-primary, #1a49bd);
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
        figure[data-type*="image"] {
          margin: 40px 0;
        }
        img {
          max-width: 100%;
        }
      }
    }
  }

  // Listing Post
  &.format-index {
    text-align: center;

    .img-wrap {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 550px;
      margin-bottom: 1em;
      transition: all 300ms ease 0s;
      &:hover {
        transform: scale(0.9) rotate(-3deg);
        box-shadow: rgba(0, 0, 0, 0.28) 1px 5px 15px 2px;
      }
    }
    .title {
      font-weight: 600;
      font-size: 2em;
      line-height: 1.1;
      margin-bottom: 0.2em;
    }
    .category {
      opacity: 0.5;
    }
  }
}
</style>
