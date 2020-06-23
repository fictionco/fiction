<template>
  <div class="title-area">
    <h1 class="entry-title">
      <factor-link :path="postLink(post._id)" class="title">{{ post.title }}</factor-link>
    </h1>
    <factor-post-edit :post-id="post._id" class="post-edit" />
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"

export default {
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
  },
  methods: { setting, postLink },
}
</script>

<style lang="less" scoped>
.title-area {
  padding-top: 0.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  .post-edit {
    margin-top: 0.5rem;
    font-size: 0.9em;
    display: inline-block;
  }
}
.entry-title {
  letter-spacing: -0.025em;
  line-height: 1.25;
  font-size: 1.5rem;
  margin-top: 1.25rem;
  font-weight: var(--font-weight-bold, 700);
  .title {
    color: inherit;
    &:hover {
      color: var(--color-primary);
    }
  }
  .edit {
    display: block;
    margin-top: 0.5rem;
  }
}
</style>
