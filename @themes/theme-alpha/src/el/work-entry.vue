<template>
  <article class="entry" :class="formatClass">
    <div v-if="format == 'index'" class="entry-text">
      <h1 class="title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>
    </div>
    <section v-else-if="format == 'single'" class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
            <factor-link class="back" :path="setting('work.indexRoute')">
              <factor-icon icon="fas fa-arrow-left" />All
            </factor-link>
            <h1 class="heading">
              <factor-link :path="path">{{ title }}</factor-link>
            </h1>
          </div>
        </div>
      </div>
    </section>

    <div v-if="format == 'single'" class="entry-text">
      <div class="mast">
        <div class="content">
          <factor-highlight-code>
            <div v-formatted-text="rendered" />
          </factor-highlight-code>
        </div>
      </div>
    </div>
  </article>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import { setting, stored, postLink } from "@factor/api"
import { renderMarkdown } from "@factor/api/markdown"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    factorHighlightCode
  },
  props: {
    format: { type: String, default: "" },
    authors: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    date: { type: [String, Number], default: "" },
    path: { type: String, default: "" },
    postId: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    formatClass(this: any) {
      const f = this.format ? this.format : "single"

      return `format-${f}`
    },
    rendered(this: any) {
      return renderMarkdown(this.post.content, {
        variables: true
      })
    }
  },
  methods: {
    postLink,
    setting
  }
})
</script>
<style lang="less">
.entry {
  // Single Post
  &.format-single {
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
        background-color: var(--color-bg-alt);
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
        @media (max-width: 900px) {
          padding: 4em 0;
        }
        .title {
          font-size: 1.1em;
          text-transform: uppercase;
        }
        .heading {
          font-weight: var(--font-weight-bold);
          font-size: 3em;
          letter-spacing: -0.03em;
          margin: 0.3em 0;
          @media (max-width: 900px) {
            font-size: 2em;
          }
          a:hover {
            text-decoration: underline;
            text-decoration-color: var(--color-primary);
          }
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
    .entry-text {
      padding: 2em 0;
      .content {
        margin: 0 auto;
        max-width: 760px;
        font-size: 1.5em;
        line-height: 1.4em;
        @media (max-width: 900px) {
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
      font-weight: var(--font-weight-bold);
      font-size: 1.8em;
      line-height: 1.2;
      margin-bottom: 0.2em;
    }
    .category {
      opacity: 0.5;
    }
  }
}
</style>
