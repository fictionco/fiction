<template>
  <div class="related-wrap">
    <div class="related-entries">
      <div class="post-index">
        <div v-for="(post, pi) in index" :key="'key-'+pi" class="related-entry">
          <part-aside
            :title="post.title"
            :tags="post.tags"
            :path="$posts.getPermalink({type: post.type, permalink: post.permalink})"
            :images="post.images"
            :date="post.date"
            :authors="post.authorData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "part-aside": () => import("./aside")
  },
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
    const posts = await this.$posts.getPostIndex({
      type: "blog",
      limit: 3,
      storeKey: "related",
      status: ["published"]
    })

    this.index = posts.data.filter(_ => _.id != this.post.id)

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