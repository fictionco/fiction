<template>
  <div class="entries">
    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>
    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <div v-for="(post, i) in $setting.get('work.posts.data')" :key="i">
            <part-work-entry
              format="listing"
              :images="post.images"
              :title="post.title"
              :authors="post.authorData"
              :content="post.content"
              :post-id="post.id"
              :loading="loading"
              :tags="post.tags"
              :path="post.path"
            />
            <!-- 
              :images="postImage(post.images)" 
             :path="$posts.getPermalink({type: post.type, permalink: post.permalink})"
            -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {
    "part-work-entry": () => import("./work-entry")
  },
  data() {
    return {
      loading: false,
      parsedPosts: [{}, {}, {}],
      storeKey: "index"
    }
  },
  metatags() {
    const tag = this.$route.params.tag || ""
    const title = tag ? `Tag "${tag}"` : "Projects"

    const description = tag
      ? `Articles related to tag: ${tag}`
      : "Projects and more..."
    return {
      title,
      description
    }
  }
  // serverPrefetch() {
  //   return this.getPosts()
  // },
  // computed: {
  //   posts() {
  //     return this.$store.getters["getItem"]("work") || []
  //   }
  // },
  // watch: {
  //   $route: function(to) {
  //     this.getPosts()
  //   }
  // },
  // async mounted() {
  //   if (this.posts.length == 0) {
  //     await this.getPosts()
  //   }
  // },

  // methods: {
  //   postImage(images = []) {
  //     return images.length > 0 ? images[0].url : ""
  //   },
  //   async getPosts() {
  //     const tag = this.$route.params.tag || ""
  //     this.loading = true
  //     const r = await this.$posts.getPostIndex({
  //       type: "work",
  //       tag,
  //       status: ["published"]
  //     })
  //     this.loading = false
  //   }
  // }
}
</script>

<style lang="less">
.entries {
  .loading-entries {
    height: 50vh;
    padding: 5em;
  }
}
.posts-inner {
  > div {
    &:nth-last-of-type(odd) {
      margin-top: 120px;
      @media (max-width: 767px) {
        margin: 0;
      }
    }
  }
}
</style>