<template>
  <div class="entry-header">
    <div class="splash">
      <component :is="setting('blog.components.returnLink')" />
      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>
      <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
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
    post() {
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
.plugin-blog {
  .single-entry .entry-header {
    margin: 0;
    padding: 0 2em;
    background: #1b223c url(./rectangles-pink.svg) no-repeat center center;
    background-size: 80%;

    @media (max-width: 767px) {
      background-size: 100%;
      padding: 0 1em;
    }

    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: left;
      max-width: 50rem;
      padding: 5em 0;
      margin: 0 auto;
      @media (max-width: 767px) {
        padding: 6em 0 7em;
      }

      .entry-title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 1.4em;
        margin: 0.3em 0;
        color: #f9f9f9;
        a:hover {
          color: inherit;
          opacity: 0.5;
        }
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .entry-subtitle {
        opacity: 0.5;
        font-size: 1.4em;
        font-weight: 400;
        margin-bottom: 1.5em;
        color: #d9d9d9;

        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
    }

    .entry-title {
      font-weight: var(--font-weight-bold);
      font-size: 2.5em;
      line-height: 1.1;

      @media (max-width: 767px) {
        font-size: 2em;
      }
      a {
        color: inherit;
        &:hover {
          color: var(--color-primary);
        }
        &:active {
          opacity: 0.7;
        }
      }
    }
    .entry-subtitle {
      font-size: 1.4em;
      opacity: 0.7;
    }
  }
}
</style>
