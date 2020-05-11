<template>
  <div>
    <p class="date">{{ standardDate(post.date) }}</p>
  </div>
</template>
<script lang="ts">
import { standardDate, stored } from "@factor/api"

export default {
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: {
    standardDate,
  },
}
</script>
