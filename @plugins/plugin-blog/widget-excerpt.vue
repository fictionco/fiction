<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="postLink(post._id)">
      Read
      <factor-icon icon="arrow-right" />
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
.post-excerpt {
  font-size: 1.25em;
  line-height: 1.4em;
  @media (max-width: 767px) {
    font-size: 1em;
  }
  padding-bottom: 1rem;
  .inline-excerpt {
    margin-right: 1rem;
  }
}
</style>
