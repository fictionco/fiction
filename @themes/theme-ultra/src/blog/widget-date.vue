<template>
  <div>
    <p class="date">{{ standardDate(post.date) }}</p>
  </div>
</template>
<script lang="ts">
import { standardDate, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    standardDate
  }
})
</script>
