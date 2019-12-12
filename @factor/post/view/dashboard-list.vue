<template>
  <dashboard-page :key="postType" class="posts-dashboard" :title="postTypeLabel">
    <template #actions>
      <factor-link
        v-if="!getPostTypeConfig.noAddNew"
        :path="`/dashboard/posts/${postType}/add-new`"
        btn="primary"
        data-test="add-post"
      >Add New &rarr;</factor-link>
    </template>

    <component
      :is="templateLoader"
      :list="posts"
      :meta="postsMeta"
      :loading="loading"
      :sending="sending"
      :post-type="postType"
      @action="runPostAction($event)"
    />
  </dashboard-page>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import {
  requestPostIndex,
  requestPostDeleteMany,
  requestPostSaveMany
} from "@factor/post/request"
import { getPostTypeConfig, onEvent, stored } from "@factor/api"
import { dashboardPage } from "@factor/dashboard"
import { FactorPost } from "@factor/post/types"
import Vue from "vue"
export default Vue.extend({
  components: { dashboardPage, factorLink },
  data() {
    return {
      loading: true,
      sending: false
    }
  },
  metaInfo() {
    return {
      title: this.postTypeLabel
    }
  },

  computed: {
    postIndex(this: any): FactorPost {
      return stored(this.postType) || []
    },
    getPostTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    },
    templateLoader() {
      const { listTemplate } = this.getPostTypeConfig

      return listTemplate ? listTemplate : () => import("./posts-list.vue")
    },
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    postTypeLabel() {
      return this.getPostTypeConfig.namePlural
    },
    postsMeta() {
      return this.postIndex && this.postIndex.meta ? this.postIndex.meta : {}
    },
    posts() {
      return this.postIndex && this.postIndex.posts ? this.postIndex.posts : []
    },

    filters() {
      const postType = this.postType
      const { page = 1, status, category, tag, role } = this.$route.query
      return {
        postType,
        page,
        status,
        category,
        tag,
        role
      }
    }
  },
  watch: {
    $route: function(this: any) {
      this.setPosts()
    }
  },
  mounted() {
    this.setPosts()
    onEvent("refresh-table", () => {
      this.setPosts()
    })
  },
  methods: {
    async runPostAction({ action, selected }) {
      this.sending = true

      if (selected.length > 0) {
        if (action == "delete") {
          if (confirm("Are you sure? This will permanently delete the selected posts.")) {
            await requestPostDeleteMany({
              _ids: selected,
              postType: this.postType
            })
          }
        } else {
          await requestPostSaveMany({
            _ids: selected,
            data: { status: action },
            postType: this.postType
          })
        }
        this.setPosts()
      }

      this.sending = false
    },

    async setPosts(this: any) {
      this.loading = true
      await requestPostIndex(this.filters)
      this.loading = false
    }
  }
})
</script>
<style lang="less">
.posts-dashboard {
  .post-title {
    > a {
      display: block;
    }
    .permalink {
      margin-top: 5px;
      opacity: 0.3;
      color: inherit;
      font-size: 10px;
      font-weight: 500;
    }
  }
}
</style>
