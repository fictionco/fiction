<template>
  <div class="single-entry">
    <div v-if="!isEmpty(post)">
      <component
        :is="setting(`blog.components.${comp}`)"
        v-for="(comp, i) in setting('blog.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <error-404 v-else />
  </div>
</template>
<script>
import { isEmpty, setting, stored } from "@factor/tools"
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
      return stored("post") || {}
    }
  },

  methods: {
    isEmpty,
    setting
  }
}
</script>

<style lang="less">
</style>