<template>
  <div v-if="tags.length > 0" class="entry-tags">
    <factor-link
      v-for="(tag, ti) in tags"
      :key="ti"
      class="entry-tag"
      :path="$setting.get('blog.indexRoute')"
      :query="{tag}"
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
.entry-tags {
  line-height: 1;
  padding: 1em 0 0;

  // @media (max-width: 767px) {
  //   padding: 0 1em;
  // }
}
.entry-tags a {
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(50, 50, 93, 0.1);
  display: inline-block;
  font-size: 0.85em;
  margin: 5px 5px 5px 0;
  padding: 5px 10px;
  text-decoration: none;
  border-radius: 3px;
  &:hover {
    color: inherit;
    opacity: 1;
  }
  &:not(:nth-child(1)) {
    margin-left: 3px;
  }
}
</style>
