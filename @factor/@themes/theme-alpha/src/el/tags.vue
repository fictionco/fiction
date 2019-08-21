<template>
  <div v-if="tags.length > 0" class="entry-tags">
    <app-link v-for="(tag, i) in tags" :key="i" class="entry-tag" :path="`/tag/${tag}`">{{ tag }}</app-link>
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
  margin-top: 1em;
  line-height: 1;
}
.entry-tags a {
  color: rgba(25, 73, 189, 0.4);
  background: rgba(50, 50, 93, 0.1);
  opacity: 0.8;
  display: inline-block;
  font-size: 0.85em;
  margin: 3px 3px 3px 0;
  padding: 1px 5px 1px;
  text-decoration: none;
  font-weight: 600;
  border-radius: 3px;
  &:hover {
    color: var(--color-primary, #1a49bd);
    opacity: 1;
    background: var(--color-tertiary);
  }
  &:not(:nth-child(1)) {
    margin-left: 3px;
  }
}
</style>