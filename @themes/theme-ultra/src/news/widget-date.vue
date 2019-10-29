<template>
  <div>
    <p class="date">{{ standardDate(post.date) }}</p>
  </div>
</template>
<script>
import { standardDate, stored } from "@factor/tools"
export default {
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
}
</script>
