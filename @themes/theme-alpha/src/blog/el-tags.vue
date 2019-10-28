<template>
  <div v-if="tags.length > 0" class="entry-tags">
    <factor-link
      v-for="(tag, ti) in tags"
      :key="ti"
      class="entry-tag"
      :path="$setting.get('blog.indexRoute')"
      :query="{ tag }"
    >{{ tag }}</factor-link>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    tags() {
      return this.post.tag || []
    }
  }
}
</script>
<style lang="less">
.blog-wrap {
  .entry-tags {
    line-height: 1;
    padding: 2em 2em 0;

    @media (max-width: 767px) {
      padding: 2em 1em 0;
    }

    a {
      color: var(--color-primary, #1a49bd);
      background: var(--color-placeholder-2, #eeeef1);
      display: inline-block;
      opacity: 0.7;
      font-size: 0.85em;
      font-weight: var(--font-weight-bold);
      margin: 5px 5px 5px 0;
      padding: 5px 10px;
      text-decoration: none;
      border-radius: 3px;
      &:hover {
        color: var(--color-primary, #1a49bd);
        opacity: 1;
        background: var(--color-tertiary, #9afecb);
      }
      &:not(:nth-child(1)) {
        margin-left: 3px;
      }
    }
  }
}
.blog-single-entry {
  .entry-tags {
    padding: 0 2em 2em;
    @media (max-width: 767px) {
      padding: 0 1em 2em;
    }
  }
}
</style>
