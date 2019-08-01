<template>
  <blog-content class="single-entry">
    <component
      :is="$setting.get(`blog.components.${comp}`)"
      v-for="(comp, i) in $setting.get('blog.layout.single')"
      :key="i"
      :post-id="post._id"
    />
  </blog-content>
</template>
<script>
import Factor from "vue"
export default {
  components: {
    "blog-content": () => import("./blog-content")
  },
  data() {
    return {}
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
      return this.$store.val("post") || {}
    }
  },
  created() {
    // Factor.siteVars.classes = ["nav-light"]
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
</style>