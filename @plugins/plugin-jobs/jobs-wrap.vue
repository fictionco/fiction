<template>
  <div class="plugin-jobs">
    <router-view />
  </div>
</template>

<script lang="ts">
import { stored } from "@factor/app/store"
import { setting } from "@factor/api/settings"
import { loadAndStoreJobsIndex } from "@factor/plugin-jobs"
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      loading: false
    }
  },
  serverPrefetch() {
    if (!this.isIndexPage) return
    return this.getPosts()
  },
  computed: {
    isIndexPage(this: any) {
      return this.$route.meta.index ? true : false
    },
    index(this: any) {
      return stored("jobs") || {}
    },
    jobsPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getPosts()
      }
    }
  },
  mounted() {
    if (this.jobsPosts.length == 0) {
      this.getPosts()
    }
  },
  methods: {
    setting,
    async getPosts(this: any) {
      if (!this.isIndexPage) return

      this.loading = true

      await loadAndStoreJobsIndex()

      this.loading = false
    }
  }
})
</script>