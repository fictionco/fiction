<template>
  <div v-if="link" class="job-entry-cta">
    <factor-link :path="link" btn="primary" size="large">Apply Now</factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { stored } from "@factor/api"
export default {
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    link(this: any) {
      const linkOrEmail = this.post.jobApplyEmail
      let link = ""
      if (linkOrEmail) {
        link = linkOrEmail.includes("@") ? `mailto:${linkOrEmail}` : linkOrEmail
      }
      return link
    },
  },
}
</script>

<style lang="less">
.job-entry-cta {
  text-align: center;
}
</style>
