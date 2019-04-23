<template>
  <div class="single-entry">
    <factor-link class="back" path="/work">
      <i class="fa fa-arrow-left" /> All
    </factor-link>
    <part-entry
      :format="'single'"
      :authors="post.authorData"
      :title="post.title"
      :date="post.date"
      :tags="post.tags"
      :path="path"
      :post-id="post.id"
    >
      <div v-formatted-text="content" />
    </part-entry>
  </div>
</template>
<script>
export default {
  components: {
    "part-entry": () => import("./work-entry")
    //"part-related": () => import("./related"),
    //"part-widget": () => import("./widget")
  },
  data() {
    return {
      date: "",
      path: "",
      content: "",
      authors: []
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
      return this.$store.getters["getItem"]("post") || {}
    }
  },

  async created() {
    this.content = this.$markdown.render(this.post.content)
  },

  methods: {
    socialImage(post) {
      return post.featuredImage
        ? post.featuredImage[0].url
        : post.images
        ? post.images[0].url
        : ""
    }
  }
}
</script>

<style lang="less">
// markdown-it code syntax theme
@import "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/styles/vs.min.css";
.single-entry {
  // margin: 0 auto;
  // max-width: 760px;
  .back {
    color: inherit;
    text-transform: uppercase;
    font-weight: 600;
    &:hover {
      color: @color-primary;
    }
  }
  .entry.format-single .entry-header {
    margin: 0.5em 0 1em;
  }
  .entry-action {
    display: grid;
    grid-template-columns: 1fr 1fr;
    @media (max-width: 767px) {
      grid-template-columns: 2fr 1fr;
    }
    grid-gap: 0 10px;
    padding: 1.5em 0;
    border-bottom: 1px solid rgba(62, 62, 62, 0.1);

    .share-wrap {
      text-align: right;
      line-height: 60px;
      a {
        font-size: 1.4em;
        padding-left: 1em;
        &:hover {
          color: @color-primary;
        }
      }
    }
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