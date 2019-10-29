<template>
  <div v-if="format == 'index'" class="title">
    <h1 class="heading">
      <factor-link :path="link(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
    <factor-post-edit :post-id="post._id" />
  </div>
  <section v-else class="hero">
    <div class="mast">
      <div class="hero-inner">
        <div>
          <factor-link class="back" :path="setting('work.indexRoute')">
            <factor-icon icon="arrow-left" />
            {{ returnLinkText }}
          </factor-link>
          <h1 class="heading">
            <factor-link :path="link(post._id)">{{ post.title }}</factor-link>
          </h1>
          <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
          <factor-post-edit :post-id="post._id" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { setting } from "@factor/tools"
import { link } from "@factor/post"
export default {
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    returnLinkText() {
      return setting("work.returnLinkText") || "All Projects"
    }
  },
  methods: {
    link,
    setting
  }
}
</script>
<style lang="less">
// Index
.work-posts {
  .posts-index {
    .title {
      padding: 2em 2em 0;
      @media (max-width: 767px) {
        padding: 2em 0 0;
      }
      .heading {
        font-weight: var(--font-weight-bold, 800);
        font-size: 1.8em;
        line-height: 1.2;
        margin-bottom: 0.2em;
        a:hover {
          text-decoration: underline;
          text-decoration-color: var(--color-tertiary);
        }
      }
      .entry-subtitle {
        line-height: 1.7;
      }
    }
  }
}

// Single
.work-single-entry {
  .hero {
    position: relative;
    overflow: hidden;

    .mast {
      padding: 0 2em;
      line-height: 1.2;
      max-width: 1000px;
      margin: 0 auto;
    }
    &:before {
      content: "";
      display: block;
      position: absolute;
      width: 70%;
      height: 100%;
      top: 0;
      right: auto;
      bottom: 0;
      background-color: var(--color-bg-alt, #f3f5fb);
      @media (max-width: 1024px) {
        width: 100%;
      }
    }

    .hero-inner {
      position: relative;
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 60px;
      align-items: center;
      padding: 5em 0;
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      @media (max-width: 767px) {
        padding: 4em 0;
      }
      .back {
        font-size: 1em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        &:hover {
          opacity: 1;
          color: var(--color-primary, #1a49bd);
          background: var(--color-tertiary, #9afecb);
        }
      }
      .heading {
        font-weight: var(--font-weight-bold, 800);
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.3em 0;
        @media (max-width: 767px) {
          font-size: 2em;
        }
        a:hover {
          text-decoration: underline;
          text-decoration-color: var(--color-tertiary);
        }
      }
      .entry-subtitle {
        line-height: 1.7;
      }
      .content {
        font-size: 1.2em;
        line-height: 1.6em;
        opacity: 0.5;
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
