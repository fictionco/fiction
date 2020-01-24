<template>
  <div class="return-link">
    <factor-link class="back" :path="setting('forum.indexRoute')">
      <factor-icon icon="fas fa-arrow-left" />
      <span>{{ returnLinkText() }}</span>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
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
    setting,
    returnLinkText(this: any) {
      return setting("forum.returnLinkText") || "All Posts"
    }
  }
})
</script>
<style lang="less">
.plugin-forum {
  .return-link {
    margin-bottom: 1rem;
  }
}
</style>
