<template>
  <div class="edit-page-templates">
    <dashboard-input
      v-model="localPost.template"
      :list="$templates.getPageTemplates()"
      input="factor-input-select"
      label="Page Template"
    />
    <dashboard-input
      v-for="(field, i) in settings"
      :key="i"
      :value="localPost[field.key]"
      :input="`factor-input-${field.input}`"
      :label="field.label"
      :description="field.description"
      :class="['engine-input', field.input]"
      :inputs="field.settings || []"
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
        return { template: "default", ...this.post }
      },
      set(localPost) {
        this.$emit("change", localPost)
      }
    },
    settings() {
      const { settings = [] } = this.pageTemplate
      return settings
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
    async setPageTemplate() {
      this.pageTemplate = await this.$templates.getTemplate(
        this.localPost.template
      )
      this.setTemplateDefaults()
    },
    setTemplateDefaults() {
      const _post = Object.assign({}, this.localPost) // detach

      const settings = _post.settings || {}
      console.log(this.pageTemplate, this.settings)
      this.settings.forEach(_ => {
        const _id = _._id

        if (typeof settings[_id] == "undefined" && _.default) {
          if (_.settings && Array.isArray(_.settings)) {
            settings[_id] = _.default.map(item => {
              _.settings.forEach(sub => {
                if (typeof item[sub._id] == "undefined" && sub.default) {
                  item[sub._id] = sub.default
                }
              })
              return item
            })
          } else {
            settings[_id] = _.default
          }
        }
      })

      this.localPost = { ..._post, settings }
    }
  }
}
</script>
<style lang="less">
</style>