<template>
  <div class="long-form">
    <div v-if="post.title" class="title">
      <h1 v-formatted-text="post.title" />
      <factor-post-edit :post-id="post._id" />
    </div>

    <div v-formatted-text="renderMarkdown(post.content)" class="content entry-content" />
  </div>
</template>

<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { renderMarkdown } from "@factor/api/markdown"
import { stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorPostEdit },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored("post") || {}
    }
  },
  methods: { renderMarkdown }
})
</script>

<style lang="less">
.long-form {
  margin: 5em auto;
  max-width: 700px;
  min-height: 50vh;

  .title {
    border-bottom: 1px dotted rgba(0, 0, 0, 0.07);
    margin-bottom: 1em;
    padding: 0.75em 0;
    font-size: 1.5em;
    font-weight: var(--font-weight-bold);
    display: flex;
    justify-content: space-between;
  }
  .content {
    font-size: 1.2em;
    font-weight: 500;
    line-height: 1.5;

    h1,
    h2,
    h3 {
      font-weight: var(--font-weight-bold);
    }
    h1 {
      font-size: 1.8em;
    }
    h2 {
      font-size: 1.3em;
    }
    h3 {
      font-size: 1.1em;
    }
    p {
      margin: 1.5em 0;
    }

    blockquote {
      padding: 1em 0 1em 1.5em;
      margin: 1em 0;
      border-left: 3px solid var(--color-text);
      :first-child {
        margin-top: 0;
      }
      :last-child {
        margin-bottom: 0;
      }
    }
  }
  @media (max-width: 767px) {
    margin: 3em auto;
    padding: 0 1.5em;
    .content {
      font-size: 1rem;
    }
  }
}
</style>
