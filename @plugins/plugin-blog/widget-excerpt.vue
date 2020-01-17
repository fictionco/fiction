<template>
  <div class="entry-excerpt">
    <div class="excerpt">{{ excerpt(post.content) }}</div>
    <factor-link class="read-link" :path="postLink(post._id)">
      Learn More
      <factor-icon icon="fas fa-arrow-right" />
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { postLink, stored } from "@factor/api"
import { excerpt } from "@factor/api/excerpt"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    excerpt,
    postLink
  }
})
</script>
<style lang="less">
.plugin-blog {
  .entry-excerpt {
    font-size: 1.2em;
    line-height: 1.6em;
    margin-bottom: 1em;
  }
}
</style>
