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
import { setting, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: { setting }
})
</script>
<style lang="less">
.plugin-blog {
  .entry-meta {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 2em;
    align-items: flex-start;
    margin: 1em auto;

    @media (max-width: 767px) {
      display: grid;
      grid-gap: 1em;
      grid-template-columns: 1fr;
    }
  }
}
</style>
