<template>
  <div class="long-form">
    <factor-post-edit :post="post" />
    <h1 v-formatted-text="post.title" class="title" />
    <div v-formatted-text="post.content" class="content entry-content" />
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      content: ""
    }
  },
  created() {}
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
      font-weight: var(--font-weight-bold);
    }
    h1 {
      font-size: 2em;
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