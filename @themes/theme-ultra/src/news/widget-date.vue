<template>
  <div>
    <p class="date">{{ standardDate(post.date) }}</p>
  </div>
</template>
<script lang="ts">
import { standardDate, stored } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: {
    standardDate
  }
})
</script>
