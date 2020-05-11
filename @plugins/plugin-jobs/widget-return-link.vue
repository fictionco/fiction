<template>
  <div class="return-link">
    <factor-link class="back" :path="setting('jobs.indexRoute')">
      <factor-icon icon="fas fa-arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
export default {
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    returnLinkText(this: any) {
      return setting("jobs.returnLinkText") || "All Jobs"
    },
  },
  methods: { setting },
}
</script>
<style lang="less">
.plugin-jobs {
  .return-link {
    margin-bottom: 1rem;
    .back {
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }
}
</style>
