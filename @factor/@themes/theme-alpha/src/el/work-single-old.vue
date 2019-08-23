<template>
  <div class="single-entry">
    <work-entry
      :format="'single'"
      :authors="post.authorData"
      :title="post.title"
      :date="post.date"
      :tags="post.tags"
      :path="path"
      :post-id="post.id"
    >
      <div v-formatted-text="content" />
    </work-entry>
  </div>
</template>
<script>
export default {
  components: {
    "work-entry": () => import("./work-entry")
    //"part-related": () => import("./related")
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
      description: post.description || this.$utils.excerpt(post.content),
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
