<template>
  <div>
    <p class="date">{{ standardDate(post.date) }}</p>
  </div>
</template>
<script>
import { standardDate } from "@factor/tools"
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
  },
  methods: {
    standardDate
  }
}
</script>
