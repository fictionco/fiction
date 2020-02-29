<template>
  <component :is="templateLoader" :post-id="_id" :post="post" :post-type="postType">
    <template #edit>
      <dashboard-pane v-for="(item, i) in editComponents" :key="i" :title="item.name">
        <component :is="item.component" :post-id="_id" />
      </dashboard-pane>
    </template>
    <template #meta>
      <dashboard-pane v-for="(item, i) in metaComponents" :key="i" :title="item.name">
        <component :is="item.component" :post-id="_id" />
      </dashboard-pane>
    </template>
  </component>
</template>
<script lang="ts">
import { dashboardPane } from "@factor/dashboard"
import { applyFilters, stored, storeItem, getPostTypeConfig } from "@factor/api"
import { requestPostSingle } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"
import { EditPanel } from "@factor/dashboard/types"
import Vue from "vue"
export default Vue.extend({
  components: { dashboardPane },
  computed: {
    post: {
      get(this: any): FactorPost {
        return stored(this._id) || {}
      },
      set(this: any, v: FactorPost): void {
        storeItem(this._id, v)
      }
    },
    _id(this: any): string {
      return this.$route.query._id || ""
    },
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    getPostTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    },
    templateLoader(this: any) {
      const { editTemplate } = this.getPostTypeConfig

      return editTemplate ? editTemplate : () => import("./posts-edit.vue")
    },
    editComponents(this: any): EditPanel[] {
      const components = applyFilters("post-edit-components", [], {
        postType: this.postType
      })

      return components.filter(
        ({ postType }: EditPanel) =>
          !postType || (postType && postType.includes(this.postType))
      )
    },
    metaComponents(this: any): EditPanel[] {
      const components = applyFilters("post-meta-components", [], {
        postType: this.postType
      })

      return components.filter(
        ({ postType }: EditPanel) =>
          !postType || (postType && postType.includes(this.postType))
      )
    }
  },
  watch: {
    $route: function(this: any) {
      if (!this._id) {
        this.requestPost()
      }
    }
  },

  mounted() {
    this.requestPost()
  },
  methods: {
    async requestPost(this: any) {
      const post = await requestPostSingle({
        _id: this._id,
        postType: this.postType,
        createOnEmpty: true,
        depth: 100
      })

      /**
       * If a new post is created, it will come with an _id
       * Set the URL Id to the new id if this is the case.
       */
      if (post._id && this._id !== post._id) {
        this.$router.replace({
          query: { ...this.$route.query, _id: post._id }
        })
      }
    }
  }
})
</script>
