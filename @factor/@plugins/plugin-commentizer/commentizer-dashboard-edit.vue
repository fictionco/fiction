<template>
  <div class="commentizer-dashboard-edit">
    <dashboard-input v-model="comments.email" input="factor-input-email" label="Email" />
    <dashboard-input v-model="comments.name" input="factor-input-text" label="Name" />
    <dashboard-input v-model="comments.content" input="factor-input-textarea" label="Comment" />
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  data() {
    return {
      loading: false,
      template: "",
      settings: {},
      pageTemplateInfo: {}
    }
  },
  computed: {
    comments: {
      get() {
        return this.$store.val(this.postId) || {}
      },
      set(v) {
        this.$store.add(this.postId, v)
      }
    }
  },
  watch: {},
  methods: {}
}
</script>
