<template>
  <div v-if="tags.length > 0" class="entry-tags">
    <factor-link
      v-for="(tag, ti) in tags"
      :key="ti"
      class="entry-tag"
      :path="setting('blog.indexRoute')"
      :query="{ tag }"
    >{{ tag }}</factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    tags(this: any) {
      return this.post.tag || []
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.plugin-blog {
  .entry-tags {
    line-height: 1;
    text-align: right;
    @media (max-width: 767px) {
      text-align: left;
    }
    a {
      color: inherit;
      background: rgba(50, 50, 93, 0.08);
      display: inline-block;
      font-size: 0.85em;
      margin: 5px 2px 5px;
      padding: 5px 10px;
      text-decoration: none;
      font-weight: 600;
      border-radius: 3px;
      &:hover {
        color: inherit;
        background: rgba(50, 50, 93, 0.15);
      }
    }
  }
}
</style>
