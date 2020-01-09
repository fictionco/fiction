<template>
  <div v-if="format == 'index'" class="entry-headers">
    <h1 class="entry-title">
      <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
  </div>
  <div v-else class="entry-headers">
    <div class="splash">
      <component :is="setting('work.components.workReturnLink')" />
      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>
      <h3 class="entry-subtitle">{{ post.subTitle }}</h3>here
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { postLink, setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    postLink,
    setting
  }
})
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
  .splash {
    .entry-title {
      font-weight: var(--font-weight-bold, 800);
      font-size: 3em;
      letter-spacing: -0.03em;
      margin: 0.3em 0;
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .entry-subtitle {
      font-size: 1.25em;
    }
  }

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
      .entry-title {
        font-size: 1.1em;
        text-transform: uppercase;
      }
      .entry-subtitle {
        font-weight: var(--font-weight-bold, 800);
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.3em 0;
        @media (max-width: 767px) {
          font-size: 2em;
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
