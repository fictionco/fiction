<template>
  <factor-input-wrap
    v-if="localPost.type == 'page'"
    v-model="localPost.template"
    format="horizontal"
    :list="$posts.getPageTemplates()"
    input="factor-input-select"
    label="Page Template"
  />
</template>
<script>
export default {
  model: {
    prop: "post",
    event: "change"
  },
  props: {
    post: { type: Object, required: true }
  },
  data() {
    return {
      settings: {}
    }
  },
  computed: {
    localPost: {
      get() {
        return this.post
      },
      set(localPost) {
        this.$emit("change", localPost)
      }
    }
  },
  watch: {},
  mounted() {
    this.$watch("post", function(v) {}, { immediate: true })
  },
  methods: {}
}
</script>
<style lang="less">
</style>