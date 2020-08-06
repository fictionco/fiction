<template>
  <div class="entry-header">
    <div class="splash">
      <component :is="setting('blog.components.returnLink')" />
      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
        <factor-post-edit :post-id="post._id" />
      </h1>
      <h3 class="entry-subtitle">{{ post.subTitle }}</h3>
    </div>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { postLink, setting, stored } from "@factor/api"

export default {
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: {
    postLink,
    setting,
  },
}
</script>
<style lang="less">
.plugin-blog {
  .single-entry .entry-header {
    max-width: 800px;
    margin: 0 auto;
    padding: 8rem 3rem 0;

    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: left;

      .entry-title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 1.2;

        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .edit {
        display: block;
        font-size: 1rem;
        line-height: 1em;
        letter-spacing: initial;
        margin: 0.5em 0;
      }
      .entry-subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        font-weight: 400;
        margin-bottom: 1.5em;

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
          color: var(--color-text);
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
