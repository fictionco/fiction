<template>
  <div class="edit-page-templates">
    <dashboard-input
      v-model="template"
      :list="getPageTemplates()"
      input="factor-input-select"
      label="Page Template"
    />
    <dashboard-input
      v-for="(field, i) in fields"
      :key="i"
      v-model="settings[field._id]"
      :input="`factor-input-${field.input}`"
      :label="field.label"
      :description="field.description"
      :class="['engine-input', field.input]"
      :inputs="field.settings || []"
    />
  </div>
</template>
<script>
import { getPageTemplates, getTemplate } from "@factor/templates"
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
      template: "",
      settings: {},
      pageTemplateInfo: {}
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
    fields() {
      return this.pageTemplateInfo.fields || []
    }
  },
  watch: {
    settings: {
      handler: function(v) {
        this.localPost = { ...this.localPost, settings: v }
      },
      deep: true
    },
    template: {
      handler: function(v) {
        this.setPageTemplate(v)
      }
    },
    "post.template": {
      handler: function(v) {
        if (v && v != this.template) {
          this.template = v
        }
      },
      immediate: true
    },
    "post.settings": {
      handler: function(v) {
        if (v && v != this.settings) {
          this.settings = v
        }
      },
      immediate: true
    }
  },
  methods: {
    getPageTemplates,
    async setPageTemplate(templateId) {
      this.localPost = { ...this.localPost, template: templateId }

      this.pageTemplateInfo = await getTemplate(templateId)

      this.setTemplateDefaults()
    },
    setTemplateDefaults() {
      this.fields.forEach(field => {
        const _id = field._id
        let val
        if (typeof this.settings[_id] == "undefined" && field.default) {
          if (field.settings && Array.isArray(field.settings)) {
            val = field.default.map(item => {
              field.settings.forEach(sub => {
                if (typeof item[sub._id] == "undefined" && sub.default) {
                  item[sub._id] = sub.default
                }
              })
              return item
            })
          } else {
            val = field.default
          }

          this.$set(this.settings, _id, val)
        }
      })
    }
  }
}
</script>
<style lang="less">
</style>