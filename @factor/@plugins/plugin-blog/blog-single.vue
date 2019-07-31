<template>
  <blog-content class="single-entry">
    <factor-link class="back" path="/blog">
      <factor-icon icon="arrow-left" />
      <span>All Posts</span>
    </factor-link>
    <blog-entry format="single" :post-id="post._id">
      <div v-formatted-text="$markdown.render(post.content)" />
    </blog-entry>
    <part-related :post-id="post._id" />
  </blog-content>
</template>
<script>
export default {
  components: {
    "blog-content": () => import("./blog-content"),
    "blog-entry": () => import("./blog-entry"),
    "part-related": () => import("./related")
  },
  data() {
    return {
      date: "",
      path: "",
      content: ""
    }
  },
  metatags() {
    const post = this.post || {}
    return {
      title: post.titleTag || post.title,
      description: post.description || this.$posts.excerpt(post.content),
      image: this.socialImage(post)
    }
  },
  computed: {
    post() {
      return this.$store.val("post") || {}
    }
  },

  methods: {
    socialImage(post) {
      return post.avatar && this.$store.val(post.avatar)
        ? this.$store.val(post.avatar).url
        : ""
    }
  }
}
</script>

<style lang="less">
// markdown-it code syntax theme
@import "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/styles/vs.min.css";
.single-entry {
  .back {
    margin-left: 30px;
    color: inherit;
    font-weight: 600;
    &:hover {
      color: #0496ff;
    }
  }
  .entry.format-single .entry-header {
    margin: 0.5em 0 1em;
  }

  .post-author {
    &.post-author-bio {
      display: flex;
      flex-direction: column;
      .author-card {
        display: inline;
        padding: 1em 0;
        font-size: 1.5em;
        line-height: 1.4em;
        margin-right: 0;
        .avatar {
          margin-right: 20px;
        }
        .bio {
          margin-top: 0.5em;
          padding-left: 78px;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>