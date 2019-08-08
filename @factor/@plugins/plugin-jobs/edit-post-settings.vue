<template>
  <div class="edit-job-templates">
    <dashboard-input
      v-model="post.jobIcon"
      input-max="1"
      input="factor-input-image-upload"
      label="Custom Icon"
      @autosave="$emit('autosave')"
    />
    <!-- <dashboard-input
      v-model="post.jobIcon"
      input="factor-input-image-upload"
      label="Custom Icon"
      :max="1"
    />-->
    <!-- <dashboard-input v-model="post.jobIcon" input="factor-input-text" label="Icon" /> -->
    <dashboard-input v-model="post.jobLocation" input="factor-input-text" label="Location" />
    <dashboard-input
      v-model="post.jobApplyEmail"
      input="factor-input-text"
      label="Application Email"
    />
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      template: "",
      settings: {},
      pageTemplateInfo: {}
    };
  },
  computed: {
    post: {
      get() {
        return this.$store.val(this.postId) || {};
      },
      set(v) {
        this.$store.add(this.postId, v);
      }
    }
  },
  watch: {},
  methods: {}
};
</script>
<style lang="less">
</style>