<template>
  <dashboard-pane>
    <!-- TODO: manipulate checked state -->
    <!-- <dashboard-input
    input="factor-input-checkbox"
    format="horizontal"
    label="Enabled"
    :checked="commentizerEnabled"
    @change="commentizerEnabled = commentizerEnabled"
    /> -->
    <label for="Enabled">Enabled</label>
    <input
      type="checkbox"
      name="Enabled"
      :checked="commentizerEnabled"
      @change="commentizerEnabled = !commentizerEnabled"
    >
    <commentizerDashboardList v-show="commentizerEnabled" :post-id="postId" />
  </dashboard-pane>
</template>
<script>
export default {
  props: {
    postId: { type: String, required: true }
  },
  data () {
    return {
      commentizerEnabled: false,
    }
  },
  computed: {
    post () {
      return this.$store.val(this.postId) || {}
    },
  },
  watch: {
    async commentizerEnabled(state) {
      this.post.commentizerEnabled = state
    },
  },
  async created() {
    this.commentizerEnabled = this.post.commentizerEnabled ? this.post.commentizerEnabled : false
  },
}
</script>
