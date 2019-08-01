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
    tags: { type: Array, default: () => [] }
  }
}
</script>
<style lang="less">
.entry-tags {
  line-height: 1;
}
.entry-tags a {
  color: inherit;
  background: rgba(50, 50, 93, 0.1);
  opacity: 0.8;
  display: inline-block;
  font-size: 0.85em;
  margin: 5px 5px 5px 0;
  padding: 5px 10px;
  text-decoration: none;
  font-weight: 600;
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
