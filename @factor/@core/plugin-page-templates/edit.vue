<template>
  <div class="edit-page-templates">
    <factor-input-wrap
      v-model="localPost.template"
      :list="$posts.getPageTemplates()"
      input="factor-input-select"
      label="Page Template"
    />
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
    setValue(key, value) {
      this.$set(this.localPost, key, value)
    },
    async setPageTemplate() {
      const tplVal = this.localPost.template

      if (tplVal) {
        const tpls = this.$posts.getPageTemplates()

        const { default: tpl } = await tpls
          .find(_ => _.value == tplVal)
          .component()

        this.pageTemplate = tpl.pageTemplate ? tpl.pageTemplate() : {}

        this.initializePageTemplate()
      } else {
        this.pageTemplate = {}
      }
    },
    initializePageTemplate() {
      this.inputs.forEach(_ => {
        if (typeof this.localPost[_.key] == "undefined" && _.default) {
          let defaultValue
          if (_.inputs && Array.isArray(_.inputs)) {
            defaultValue = []
            _.default.forEach(item => {
              _.inputs.forEach(__ => {
                if (typeof item[__.key] == "undefined" && __.default) {
                  item[__.key] = __.default
                }
              })
              defaultValue.push(item)
            })
          } else {
            defaultValue = _.default
          }

          this.setValue(_.key, defaultValue)
        }
      })
    }
  }
}
</script>
<style lang="less">
</style>