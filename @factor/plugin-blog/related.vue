<template>
  <div class="related-wrap">
    <h3>You might also like:</h3>
    <div class="related-entries">
      <div class="post-index">
        <div v-for="(post, pi) in posts" :key="'key-'+pi" class="related-entry">
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
    tags: { type: Array, default: () => [] }
  },
  data() {
    return {
      posts: [],
      loading: true
    }
  },
  async created() {
    this.posts = await this.$posts.getTable({
      type: "blog",
      limit: 3,
      storeKey: "related",
      status: ["published"]
    })

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
    display: flex;
    flex-direction: column;
    //align-items: center;
  }
  .related-entry {
    max-width: 400px;
    margin-bottom: 1em;
    @media (max-width: 767px) {
      max-width: 100%;
    }
    .entry {
      border: 1px solid #e7ebed;
      border-radius: 5px;
      &:hover {
        box-shadow: 0 3px 20px 0 rgba(84, 110, 122, 0.1);
        transform: translateY(-1px);
        h2 {
          color: #0496ff;
        }
      }

      &:active {
        transition: 0s;
        box-shadow: none;
        transform: translateY(0);
        h2 {
          color: #ff0076;
        }
      }
    }
  }
}
</style>