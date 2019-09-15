<template>
  <section class="hero">
    <div class="mast">
      <div class="hero-inner">
        <div>
          <factor-link class="back" :path="$setting.get('portfolio.indexRoute')">
            <factor-icon icon="arrow-left" />
            {{ returnLinkText }}
          </factor-link>
          <h1 class="title">
            <factor-link :path="$post.link(post._id)">{{ post.title }}</factor-link>
          </h1>
          <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
          <factor-post-edit :post-id="post._id" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
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
      return this.$setting.get("portfolio.returnLinkText") || "All Projects"
    }
  }
}
</script>
<style lang="less">
// Single
.portfolio-single-entry {
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

    .mast {
      padding: 0 2em;
      line-height: 1.2;
      max-width: 1000px;
      margin: 0 auto;
    }

    .hero-inner {
      position: relative;
      // display: grid;
      // grid-template-columns: 2fr 1fr;
      // grid-gap: 60px;
      align-items: center;
      padding: 5em 0;
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      @media (max-width: 767px) {
        padding: 4em 0;
      }
      .title {
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
