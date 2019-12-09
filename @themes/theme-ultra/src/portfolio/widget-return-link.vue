<template>
  <div class="return-link">
    <factor-link class="back" :path="setting('portfolio.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { stored } from "@factor/app/store"
import { setting } from "@factor/api/settings"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    returnLinkText() {
      return setting("portfolio.returnLinkText") || "All Posts"
    }
  },
  methods: { setting }
})
</script>
