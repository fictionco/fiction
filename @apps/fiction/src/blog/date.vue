<template>
  <div class="widget-date">
    <span class="date">{{ $time.niceFormat(post.date) }}</span>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    postSet() {
      return !this.$lodash.isEmpty(this.post) ? true : false
    },
    post() {
      return this.$store.val(this.postId) || {}
    }
  },
  methods: {
    getPost(_id) {
      return this.$store.val(_id) || {}
    }
  }
}
</script>
<style lang="less">
.widget-date {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 0 2.4em;

  .edit {
    margin-left: 1em;
  }
}
</style>
