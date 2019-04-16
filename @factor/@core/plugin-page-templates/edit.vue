<template>
  <div class="edit-page-templates">
    <factor-input-wrap
      v-for="(field, i) in inputs"
      :key="i"
      :value="localPost[field.key]"
      :input="`factor-input-${field.input}`"
      :label="field.label"
      :description="field.description"
      :class="['engine-input', field.input]"
      :inputs="field.inputs || []"
      @input="setValue(field.key, $event)"
    />
  </div>
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
      pageTemplate: {}
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
    },
    inputs() {
      return this.pageTemplate.inputs || []
    }
  },
  watch: {
    "post.template": {
      handler: function(v) {
        this.setPageTemplate()
      },
      immediate: true
    }
  },
  methods: {
    setValue(field, value) {
      console.log("SET", field, value)
      this.$set(this.localPost, field, value)
    },
    async setPageTemplate() {
      const tplVal = this.localPost.template

      if (tplVal) {
        const tpls = this.$posts.getPageTemplates()

        const { default: tpl } = await tpls
          .find(_ => _.value == tplVal)
          .component()

        this.pageTemplate = tpl.pageTemplate ? tpl.pageTemplate() : {}
      } else {
        this.pageTemplate = {}
      }
    }
  }
}
</script>
<style lang="less">
</style>