<template>
  <div class="long-form">
    <div v-if="post.title" class="title">
      <h1 v-formatted-text="post.title" />
      <factor-post-edit :post="post" />
    </div>

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
  min-height: 50vh;

  .title {
    border-bottom: 1px dotted rgba(0, 0, 0, 0.07);
    margin-bottom: 1em;
    padding: 0.75em 0;
    letter-spacing: -0.02em;
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