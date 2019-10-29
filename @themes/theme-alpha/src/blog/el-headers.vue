<template>
  <div :class="formatClass">
    <h1 class="entry-title">
      <factor-link :path="link(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 v-if="scope != 'index'" class="entry-sub-title">{{ post.subTitle }}</h3>
  </div>
</template>
<script>
import { stored } from "@factor/tools"
import { link } from "@factor/post"
export default {
  props: {
    postId: { type: String, default: "" },
    scope: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    formatClass() {
      const f = this.scope ? "entry-headers" : "entry-headers single-entry-headers"

      return f
    }
  },
  methods: {
    link
  }
}
</script>
<style lang="less">
.entry-headers {
  padding: 0 2em;
  @media (max-width: 767px) {
    padding: 0 1em;
  }

  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 1.8em;
    line-height: 1.2;
    margin: 0.5em 0;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: var(--color-primary, #1a49bd);
      &:hover {
        text-decoration: underline;
        text-decoration-color: var(--color-tertiary);
      }
      &:active {
        opacity: 0.7;
      }
    }
  }

  // Single post styles
  &.single-entry-headers {
    padding: 0 2em 2em;
    @media (max-width: 767px) {
      padding: 0 1em 2em;
    }
    .entry-title {
      font-size: 2.5em;
      margin: 0.5em 0 0;

      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .entry-sub-title {
      font-size: 1.4em;
      line-height: 1.6em;
      opacity: 0.7;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }
}
</style>
