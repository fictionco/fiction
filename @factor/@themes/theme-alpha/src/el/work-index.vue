<template>
  <div class="entries">
    <!-- <div v-if="$route.params.tag" class="back-nav">
      <factor-link btn="default" path="/work">
        <i class="fa fa-arrow-left" /> All Posts
      </factor-link>
    </div>-->
    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>

    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <div v-for="(post, pi) in posts.data" :key="'key-'+pi">
            {{ post.images && post.images[0] ? post.images[0].url : "" }}
            <part-work-entry
              format="listing"
              :title="post.title"
              :authors="post.authorData"
              :content="post.content"
              :post-id="post.id"
              :loading="loading"
              :images="post.images"
              :tags="post.tags"
              :path="$posts.getPermalink({type: post.type, permalink: post.permalink})"
            />
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
    const title = tag
      ? `Tag "${tag}"`
      : "Digital Nomad, Remote Work and Travel Lifestyle Articles"

    const description = tag
      ? `Articles related to tag: ${tag}`
      : "Learn about travel hacks, remote work, making money while you sleep, etc..."
    return {
      title,
      description
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    posts() {
      return this.$store.getters["getItem"]("index") || []
    }
  },
  watch: {
    $route: function(to) {
      this.getPosts()
    }
  },
  async mounted() {
    if (this.posts.length == 0) {
      await this.getPosts()
    }
  },

  methods: {
    async getPosts() {
      const tag = this.$route.params.tag || ""
      this.loading = true
      const r = await this.$posts.getPostIndex({
        type: "work",
        tag,
        storeKey: "index",
        status: ["published"]
      })
      this.loading = false
    }
  }
}
</script>

<style lang="less">
.entries {
  .back-nav {
    margin-bottom: 1em;
  }
  .splash {
    text-align: center;
    margin: 6em auto;
    max-width: 600px;
    font-size: 1.3em;
    .title {
      font-size: 2em;
      font-weight: 600;
    }
    .sub-title {
      font-size: 1.3em;
      margin: 1em 0;
      opacity: 0.4;
    }
    .action {
      margin-top: 2em;
    }
  }
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
//.post-index {
//position: relative;
//z-index: 0;
// display: grid;
// grid-gap: 10px;
// grid-template-columns: 1fr 1fr 1fr;
// .entry {
//   grid-column: span 1;
// }
// .grid-entry {
//   grid-column: span 2;
//   grid-row: span 2;
// }
// @media (max-width: 767px) {
//   grid-template-columns: 1fr;
//   .grid-entry {
//     grid-column: span 2;
//     grid-row: span 2;
//   }
// }
//}
</style>