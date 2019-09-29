<template>
  <div class="single-entry">
    <div v-if="!$lodash.isEmpty(post)">
      <component
        :is="$setting.get(`blog.components.${comp}`)"
        v-for="(comp, i) in $setting.get('blog.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <error-404 v-else />
  </div>
</template>
<script>
import Factor from "vue"
export default {
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: this.$post.titleTag(this.post._id),
      description: this.$post.descriptionTag(this.post._id),
      image: this.$post.shareImage(this.post._id)
    }
  },
  computed: {
    post() {
      return this.$store.val("post") || {}
    }
  },

  methods: {}
}
</script>

<style lang="less">
</style>