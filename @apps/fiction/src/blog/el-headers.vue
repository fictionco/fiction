<template>
  <div v-if="format == 'index'" class="entry-headers">
    <h1 class="entry-title">
      <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
  </div>
  <div v-else class="entry-headers">
    <div class="splash">
      <component :is="setting('blog.components.blogReturnLink')" />
      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>
      <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { postLink, setting, stored } from "@factor/tools"
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
// Index
.blog-wrap {
  .post-index {
    .entry-headers {
      margin: 1em 0;
      padding: 1em 2em 0;
      @media (max-width: 767px) {
        padding: 1em 1em 0;
      }

      .entry-title {
        font-weight: var(--font-weight-bold);
        font-size: 2.6em;
        line-height: 1.2;

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
        margin-top: 2em;
        font-size: 1.4em;
        line-height: 1.6em;
        opacity: 0.7;
        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
    }
  }
}

// Single
.single-entry .entry-headers {
  margin: 0;
  padding: 0 2em;
  background: #1b223c url(./rectangles.svg) no-repeat center center;
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
      padding: 6em 1em 4em;
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
</style>
