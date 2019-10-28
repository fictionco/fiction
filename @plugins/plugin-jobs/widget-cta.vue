<template>
  <div class="job-entry-cta">
    <a :href="`mailto:${post.jobApplyEmail}` ">
      <factor-btn btn="primary" size="large">
        Apply Now
        <factor-icon icon="arrow-right" />
      </factor-btn>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
  }
}
</script>
<style lang="less">
.job-entry-cta {
  max-width: 50rem;
  margin: 1rem auto;
}
</style>
