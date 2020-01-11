<template>
  <div class="widget-date pt-8 px-8">
    <span class="text-sm text-gray-600">{{ standardDate(post.date) }}</span>
  </div>
</template>
<script lang="ts">
import { isEmpty, standardDate, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    postSet() {
      return !isEmpty(this.post) ? true : false
    },
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    getPost(_id: any) {
      return stored(_id) || {}
    },
    standardDate
  }
})
</script>