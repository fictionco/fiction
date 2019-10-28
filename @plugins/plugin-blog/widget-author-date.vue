<template>
  <div class="widget-author-date">
    <div v-for="authorId in post.author" :key="authorId" class="blog-author-card">
      <factor-avatar :post-id="getPost(authorId).avatar" />
      <span class="name">{{ getPost(authorId).displayName }}</span>
    </div>
    <span class="sep">on</span>
    <span class="date">{{ $time.niceFormat(post.date) }}</span>
    <factor-post-edit :post-id="post._id" />
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
.widget-author-date {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  font-weight: var(--font-weight-bold);
  .sep {
    font-weight: 500;
    font-style: italic;
    margin: 0 1em 0 0;
    opacity: 0.8;
  }
  .edit {
    margin-left: 1em;
  }
  .blog-author-card {
    display: flex;
    align-items: center;
    margin-right: 1em;
    padding: 0.3em 0;

    .avatar {
      display: block;
      margin-right: 10px;
      float: left;
    }
    .name {
      font-weight: var(--font-weight-bold);
    }
  }
}
</style>
