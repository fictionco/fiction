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
import { excerpt, stored, renderMarkdown } from "@factor/tools"
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
  metaInfo() {
    const post = this.post || {}
    return {
      title: post.titleTag || post.title,
      description: post.description || excerpt(post.content),
      image: this.socialImage(post)
    }
  },
  computed: {
    post() {
      return stored("post") || {}
    }
  },

  async created() {
    this.content = renderMarkdown(this.post.content)
  },

  methods: {
    socialImage(post) {
      const { featuredImage, images } = post

      if (featuredImage) return featuredImage[0].url

      return images ? images[0].url : ""
    }
  }
}
</script>
