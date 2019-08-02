<template>
  <div class="single-entry">
    <component
      :is="$setting.get(`blog.components.${comp}`)"
      v-for="(comp, i) in $setting.get('blog.layout.single')"
      :key="i"
      :post-id="post._id"
    />
  </div>
</template>
<script>
import Factor from "vue"
export default {
  data() {
    return {}
  },
  metatags() {
    return {
      title: this.$metatags.titleTag(this.post._id),
      description: this.$metatags.descriptionTag(this.post._id),
      image: this.$metatags.shareImage(this.post._id)
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
  methods: {}
}
</script>

<style lang="less">
</style>