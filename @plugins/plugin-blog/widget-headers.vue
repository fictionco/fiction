<template>
  <div class="entry-headers">
    <h1 class="entry-title">
      <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 class="entry-sub-title">{{ post.subTitle }}</h3>
  </div>
</template>
<script>
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/tools"

export default {
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: { postLink }
}
</script>
<style lang="less">
.entry-headers {
  margin: 1rem 0;
  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 2.3em;
    line-height: 1.2;
    margin-bottom: 0.5rem;
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
  .entry-sub-title {
    font-size: 1.4em;
    opacity: 0.7;
  }
}
</style>
