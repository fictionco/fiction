<template>
  <div class="return-link">
    <factor-link class="back label label-yellow" :path="setting('blog.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { setting, stored } from "@factor/tools"
import { factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon
  },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    returnLinkText() {
      return setting("blog.returnLinkText") || "All Articles"
    }
  },
  methods: { setting }
})
</script>