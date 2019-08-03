<template>
  <div class="page-blog">
    <el-hero
      :headline="$setting.get('blog.headline')"
      :subheadline="$setting.get('blog.subheadline')"
      :image="$setting.get('blog.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="$setting.get('blog.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <part-blog-entry
            v-for="(post, i) in $setting.get('blog.posts.data')"
            :key="i"
            format="listing"
            :images="post.images"
            :title="post.title"
            :content="post.content"
            :authors="post.authorData"
            :date="post.date"
            :post-id="post.id"
            :loading="loading"
            :tags="post.tags"
            :path="$posts.getPermalink({postType: post.postType, permalink: post.permalink})"
          />
        </div>
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-hero": () => import("./el/hero.vue"),
    "part-blog-entry": () => import("./el/blog-entry.vue"),
    "el-cta": () => import("./el/cta.vue")
  },
  // props: {
  //   post: { type: Object, default: () => {} }
  // },
  data() {
    return {
      loading: false,
      parsedPosts: [{}, {}, {}],
      storeKey: "index"
    }
  }
  // serverPrefetch() {
  //   return this.getPosts()
  // },
  // computed: {
  //   posts() {
  //     return this.$store.getters["getItem"]("blog") || []
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
  //   async getPosts() {
  //     const tag = this.$route.params.tag || ""
  //     this.loading = true
  //     const r = await this.$posts.getPostIndex({
  //       type: "blog",
  //       tag,
  //       storeKey: "index",
  //       status: ["published"]
  //     })
  //     this.loading = false
  //   }
  // }
  // pageTemplate() {
  //   return {
  //     name: "Blog Page",
  //     inputs: [
  //       {
  //         input: "text",
  //         label: "Heading",
  //         key: "pageHeading"
  //       },
  //       {
  //         input: "image-upload",
  //         label: "Image",
  //         key: "heroImage"
  //       }
  //     ]
  //   }
  // }
}
</script>

<style lang="less">
.page-blog {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .posts {
    padding: 6em 0;
    .posts-inner {
      display: grid;
      grid-gap: 30px;
      grid-template-columns: repeat(2, 1fr);
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 100px;
      }
    }
    .entry {
      border-radius: 8px;
      padding: 1.5em;
      border: 1px solid rgba(90, 122, 190, 0.08);
      transition: all 0.2s ease-in-out;
      box-shadow: 0 3px 0 0 rgba(90, 122, 190, 0.12);

      &:hover {
        transform: translateY(-6px);
        border: 1px solid rgba(90, 122, 190, 0.08);
        box-shadow: 0 1px 1px 0 rgba(90, 122, 190, 0.1),
          0 10px 20px 0 rgba(90, 122, 190, 0.2);
      }
    }
  }
}
</style>