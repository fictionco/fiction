<template>
  <div v-if="tags.length > 0" class="entry-tags">
    <factor-link
      v-for="(tag, ti) in tags"
      :key="ti"
      class="entry-tag"
      :path="setting('news.indexRoute')"
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
    post() {
      return stored(this.postId) || {}
    },
    tags() {
      return this.post.tag || []
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.entry-tags {
  line-height: 1;
  //padding: 1em 2em 0;

  a {
    color: var(--color-primary);
    background: var(--color-placeholder-2);
    display: inline-block;
    opacity: 0.7;
    font-size: 0.85em;
    font-weight: var(--font-weight-bold);
    margin: 5px 5px 5px 0;
    padding: 5px 10px;
    text-decoration: none;
    border-radius: 3px;
    &:hover {
      color: var(--color-white);
      opacity: 1;
      background: var(--color-primary-dark);
    }
    &:not(:nth-child(1)) {
      margin-left: 3px;
    }
  }
}
</style>
