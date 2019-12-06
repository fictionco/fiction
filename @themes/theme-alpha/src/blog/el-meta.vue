<template>
  <div class="entry-meta">
    <component
      :is="setting(`blog.components.${comp}`)"
      v-for="(comp, i) in setting('blog.layout.meta')"
      :key="i"
      :post-id="postId"
    />
  </div>
</template>
<script lang="ts">
import { setting, stored } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.entry-meta {
  display: grid;
  align-items: center;
  margin-right: 1em;
  padding: 0.3em 2em 2em;
  justify-content: space-between;
  .entry-tags {
    padding: 1em 0 0;
  }
  @media (max-width: 767px) {
    padding: 0.3em 1em 1em;
    margin: 0;
  }
}
</style>