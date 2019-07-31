<template>
  <div class="related-wrap">
    <div class="related-entries">
      <div class="post-index">
        <div v-for="(item) in index" :key="item._id" class="related-entry">
          <blog-aside :post-id="item._id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    authors: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    path: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      index: [],
      loading: true
    }
  },
  async created() {
    const { posts } = await this.$posts.getPostIndex({
      type: "blog",
      limit: 3,
      storeKey: "related",
      status: "published"
    })

    this.index = posts.filter(_ => _._id != this.post._id)

    this.loading = false
  }
}
</script>
<style lang="less">
.related-wrap {
  padding: 0 30px 30px;
  h3 {
    font-size: 2em;
    font-weight: 600;
    margin: 0.5em 0 1em;
  }
  .related-entries .post-index {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 20px;

    // display: flex;
    // flex-direction: column;
    //align-items: center;
  }
  .related-entry {
    display: flex;
    max-width: 400px;
    margin-bottom: 1em;
    @media (max-width: 767px) {
      max-width: 100%;
    }
  }
}
</style>