<template>
  <div class="jobs-post-excerpt">
    <span class="inline-excerpt">{{ excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="postLink(post._id)">
      Learn More
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
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: { postLink, excerpt }
})
</script>
<style lang="less">
.jobs-post-excerpt {
  font-size: 1.2em;
  line-height: 1.6em;
  font-weight: var(--font-weight-normal, 400);
  .inline-excerpt {
    margin-right: 1rem;
  }
}
</style>
