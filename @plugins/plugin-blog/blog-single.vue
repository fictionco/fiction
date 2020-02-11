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
    <factor-error-404 v-else />
  </div>
</template>
<script lang="ts">
import { factorError404 } from "@factor/ui"
import {
  isEmpty,
  setting,
  stored,
  titleTag,
  descriptionTag,
  shareImage
} from "@factor/api"

import Vue from "vue"
export default Vue.extend({
  components: { factorError404 },
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

  methods: { isEmpty, setting }
})
</script>

<style lang="less">
.plugin-blog {
}
</style>
