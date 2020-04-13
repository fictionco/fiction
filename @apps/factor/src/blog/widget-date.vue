<template>
  <div class="widget-date">{{ standardDate(post.date) }}</div>
</template>
<script lang="ts">
import { isEmpty, standardDate, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    postSet() {
      return !isEmpty(this.post) ? true : false
    },
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: {
    getPost(_id: any) {
      return stored(_id) || {}
    },
    standardDate,
  },
})
</script>

<style lang="less">
.plugin-blog {
  .widget-date {
    padding: 2rem 2rem 0;
    font-size: 0.875rem;
    color: #718096;
  }
}
</style>
