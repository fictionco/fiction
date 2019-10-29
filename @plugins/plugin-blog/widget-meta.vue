<template>
  <div class="entry-meta">
    <component
      :is="setting(`blog.components.${comp}`)"
      v-for="(comp, i) in setting('blog.layout.meta')"
      :key="i"
      :post-id="postId"
    />
  </div>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
  },
  methods: { setting }
}
</script>
<style lang="less">
.entry-meta {
  display: flex;
  align-items: center;
  margin-right: 1em;
  padding: 0.3em 0;
  justify-content: space-between;
}
</style>