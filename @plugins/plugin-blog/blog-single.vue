<template>
  <div class="single-entry">
    <div v-if="!isEmpty(post)">
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
import { isEmpty } from "@factor/tools"
import { titleTag, descriptionTag, shareImage } from "@factor/post"
export default {
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id)
    }
  },
  computed: {
    post() {
      return this.$store.val("post") || {}
    }
  },

  methods: {
    isEmpty
  }
}
</script>

<style lang="less">
</style>