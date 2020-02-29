<template>
  <div class="edit-page-templates">
    <div v-if="fields.length == 0" class="no-options">No settings available for selected template.</div>
    <template v-else>
      <dashboard-input
        v-for="(field, i) in fields"
        :key="i"
        v-model="settings[field._id]"
        :list="field.list"
        :input="`factor-input-${field.input}`"
        :label="field.label"
        :description="field.description"
        :class="['engine-input', field.input]"
        :inputs="field.settings || []"
        :post-id="postId"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { dashboardInput } from "@factor/dashboard"
import { getPageTemplates, getTemplate } from "@factor/templates"
import { stored, storeItem, getPostTypeConfig } from "@factor/api"

import Vue from "vue"
import { FactorPost } from "@factor/post/types"
import { TemplateSetting } from "./types"
export default Vue.extend({
  components: { dashboardInput },

  props: {
    postId: { type: String, required: true }
  },
  data() {
    return {
      template: "",
      settings: {},
      pageTemplateInfo: {}
    }
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      }
    },
    fields(this: any) {
      return this.pageTemplateInfo.fields || this.postTypeSettings
    },
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    postTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    },
    postTypeSettings(this: any) {
      return this.postTypeConfig.templateSettings || []
    }
  },
  watch: {
    settings: {
      handler: function(this: any, v: Record<string, any>) {
        this.post = { ...this.post, settings: v }
      },
      deep: true
    },
    template: {
      handler: function(this: any, v: string): void {
        this.setPageTemplate(v)
      }
    },
    "post.template": {
      handler: function(this: any, v: string) {
        if (v && v != this.template) {
          this.template = v
        }
      },
      immediate: true
    },
    "post.settings": {
      handler: function(this: any, v: Record<string, any>) {
        if (v && v != this.settings) {
          this.settings = v
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.setTemplateDefaults()
  },
  methods: {
    getPageTemplates,
    async setPageTemplate(this: any, templateId: string) {
      this.pageTemplateInfo = await getTemplate(templateId)

      this.setTemplateDefaults()
    },
    setTemplateDefaults(this: any) {
      this.fields.forEach((field: TemplateSetting) => {
        const _id = field._id
        let val
        if (typeof this.settings[_id] == "undefined" && field.default) {
          if (
            field.settings &&
            field.default &&
            Array.isArray(field.settings) &&
            Array.isArray(field.default)
          ) {
            val = field.default.map((item: Record<string, any>) => {
              if (field.settings) {
                field.settings.forEach(sub => {
                  if (typeof item[sub._id] == "undefined" && sub.default) {
                    item[sub._id] = sub.default
                  }
                })
              }

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
})
</script>
<style lang="less">
</style>
