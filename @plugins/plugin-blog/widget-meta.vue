<template>
  <div class="entry-meta">
    <component
      :is="setting(`blog.components.${comp}`)"
      v-for="(comp, i) in setting('blog.layout.meta')"
      :key="i"
      :post-id="postId"
    />
    <factor-post-edit :post-id="post._id" />
  </div>
</template>
<script lang="ts">
import { setting, stored } from "@factor/api"
import { factorPostEdit } from "@factor/post"
export default {
  components: { factorPostEdit },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: { setting },
}
</script>
<style lang="less" scoped>
.entry-meta {
  display: flex;
  align-items: center;
  margin: 1em auto;
  font-size: 0.9em;
  @media (max-width: 767px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 1fr;
  }
  > div {
    margin-right: 1rem;
  }
}
</style>
