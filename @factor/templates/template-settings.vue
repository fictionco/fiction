<template>
  <div class="edit-page-templates">
    <div v-if="fields.length == 0" class="no-options">No settings available for selected template.</div>
    <template v-else>
      <dashboard-input
        v-for="(field, i) in fields"
        :key="i"
        v-model="settings[field._id]"
        v-bind="field"
        :class="['engine-input', field.input]"
        :post-id="postId"
        :values="settings"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { dashboardInput } from "@factor/ui"
import {
  getPageTemplates,
  getTemplate,
  getDefaultTemplateSettings,
} from "@factor/templates"
import { stored, storeItem, getPostTypeConfig } from "@factor/api"

import { FactorPost } from "@factor/post/types"
export default {
  components: { dashboardInput },

  props: {
    postId: { type: String, required: true },
  },
  data() {
    return {
      template: "",
      settings: {},
      pageTemplateInfo: {},
    }
  },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this.postId) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this.postId, v)
      },
    },
    fields(this: any) {
      const fields = this.pageTemplateInfo.fields || this.postTypeSettings
      return fields.map((field) => {
        field.input = `factor-input-${field.input}`
        return field
      })
    },
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    postTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    },
    postTypeSettings(this: any) {
      return this.postTypeConfig.templateSettings || []
    },
  },
  watch: {
    settings: {
      handler: function (this: any, v: Record<string, any>) {
        this.post = { ...this.post, settings: v }
      },
      deep: true,
    },
    template: {
      handler: function (this: any, v: string): void {
        this.setPageTemplate(v)
      },
    },
    "post.template": {
      handler: function (this: any, v: string) {
        if (v && v != this.template) {
          this.template = v
        }
      },
      immediate: true,
    },
    "post.settings": {
      handler: function (this: any, v: Record<string, any>) {
        if (v && v != this.settings) {
          this.settings = v ?? {}
        }
      },
      immediate: true,
    },
  },
  methods: {
    getPageTemplates,
    async setPageTemplate(this: any, templateId: string) {
      this.pageTemplateInfo = await getTemplate(templateId)

      this.setTemplateDefaults()
    },
    setTemplateDefaults(this: any) {
      this.settings = getDefaultTemplateSettings(this.fields, this.settings) ?? {}
    },
  },
}
</script>
<style lang="less"></style>
