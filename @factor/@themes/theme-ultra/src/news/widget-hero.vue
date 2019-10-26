<template>
  <div class="hero">
    <div class="hero-inner">
      <div v-if="format == 'index'">
        <h1 class="title">
          <factor-link :path="link(post._id)">{{ post.title }}</factor-link>
        </h1>
      </div>
      <div v-else>
        <factor-link class="back" :path="$setting.get('news.indexRoute')">
          <factor-icon icon="arrow-left" />
          {{ returnLinkText }}
        </factor-link>
        <h1 class="title">
          <factor-link :path="link(post._id)">{{ post.title }}</factor-link>
        </h1>
        <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
        <factor-post-edit :post-id="post._id" />
      </div>
    </div>
  </div>
</template>
<script>
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
      return this.$setting.get("news.returnLinkText") || "All Projects"
    }
  },
  methods: {
    link
  }
}
</script>
<style lang="less">
// Single
.news-single-entry {
  .hero {
    position: relative;
    overflow: hidden;
    background-image: radial-gradient(
      at bottom -30% right -30%,
      #732b29 0%,
      #111010 75%,
      #111010 100%
    );
    background-color: #351a19;

    .hero-inner {
      position: relative;
      align-items: center;
      padding: 5em 2em;
      max-width: 800px;
      margin: 0 auto;
      @media (max-width: 900px) {
        padding: 6em 2em 5em;
      }
      .back {
        font-weight: var(--font-weight-bold);
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.3em 0;
        @media (max-width: 900px) {
          font-size: 2em;
        }
        a {
          color: var(--color-text-light);
          &:hover {
            text-decoration: underline;
            text-decoration-color: var(--color-tertiary);
          }
        }
      }
      .entry-subtitle {
        line-height: 1.7;
        color: var(--color-text-light);
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
        @media (max-width: 900px) {
          margin: 0 auto;
          max-width: 100%;
        }
      }
    }
  }
}
</style>
