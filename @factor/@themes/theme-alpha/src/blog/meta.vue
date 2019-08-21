<template>
  <div class="entry-meta">
    <component
      :is="$setting.get(`blog.components.${comp}`)"
      v-for="(comp, i) in $setting.get('blog.layout.meta')"
      :key="i"
      :post-id="postId"
    />
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
    }
  }
}
</script>
<style lang="less">
.entry-meta {
  display: grid;
  align-items: center;
  margin-right: 0;
  padding: 0 2em;
  justify-content: space-between;

  @media (max-width: 767px) {
    padding: 0;
    margin: 0;
  }
}
</style>