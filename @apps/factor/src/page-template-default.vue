<template>
  <div class="long-form">
    <factor-post-edit :post-id="post._id" />
    <h1 v-formatted-text="post.title" class="title" />
    <div v-formatted-text="renderMarkdown(post.content)" class="content entry-content" />
  </div>
</template>

<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { renderMarkdown } from "@factor/api/markdown"

export default {
  components: { factorPostEdit },
  props: {
    post: { type: Object, default: () => {} },
  },
  data() {
    return {
      content: "",
    }
  },
  templateSettings() {
    return [
      {
        _id: "exampleSetting",
        input: "select",
        label: "Example",
        description: "Shows example setting",
        list: ["foo", "bar"],
        _default: "foo",
      },
    ]
  },
  methods: { renderMarkdown },
}
</script>

<style lang="less">
.long-form {
  margin: 5em auto;
  max-width: 600px;
  .title {
    font-size: 2.5em;
  }
  .content {
    font-size: 1.2em;
    font-weight: 500;
    line-height: 1.5;

    h1,
    h2,
    h3 {
      font-weight: 600;
    }
    h1 {
      font-size: 2.5em;
    }
    h2 {
      font-size: 1.6em;
    }
    h3 {
      font-size: 1.2em;
    }
    p {
      margin: 1.5em 0;
    }

    blockquote {
      padding: 1em;
      margin: 1em 0;
      border-left: 5px solid #ff0076;
      :first-child {
        margin-top: 0;
      }
      :last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
