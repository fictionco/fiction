<template>
  <section id="newsContainerID" class="news-container page-container">
    <h2 class="pretitle">{{ $setting.get('news.pretitle') }}</h2>
    <h1 class="title">{{ $setting.get('news.title') }}</h1>
    <div class="news-wrap">
      <div v-for="(item, i) in $setting.get('news.content')" :key="i" class="news-item">
        <p class="date">{{ item.date }}</p>
        <h4 class="title">{{ item.title }}</h4>
        <p class="content">{{ item.content }}</p>
        <factor-link :path="item.action.path" class="read-more">{{ item.action.text }}</factor-link>
      </div>
    </div>
    <div class="blog">
      <div class="blog-posts">
        <!-- <component :is="$setting.get('blog.components.blogReturnLink')" v-if="tag || page > 1" /> -->
        <div v-if="loading" class="posts-loading">
          <factor-loading-ring />
        </div>
        <div v-else-if="blogPosts.length > 0" class="post-index">
          <div v-for="post in blogPosts" :key="post._id" class="post">
            <component
              :is="$setting.get(`blog.components.${comp}`)"
              v-for="(comp, i) in $setting.get('blog.layout.index')"
              :key="i"
              :post-id="post._id"
            />
            <!-- scope="index" -->
          </div>
        </div>
        <!-- <div v-else class="posts-not-found">
          <div class="text">
            <div class="title">{{ $setting.get("blog.notFound.title") }}</div>
            <div class="sub-title">{{ $setting.get("blog.notFound.subTitle") }}</div>
          </div>
        </div>-->
        <component :is="$setting.get('blog.components.pagination')" :post-type="postType" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      postType: "blog",
      loading: false
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    // tag() {
    //   return this.$route.params.tag || this.$route.query.tag || ""
    // },
    index() {
      return this.$store.val(this.postType) || {}
    },
    blogPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        this.getPosts()
      }
    }
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    async getPosts() {
      this.loading = true

      const r = await this.$post.getPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: this.$setting.get("blog.limit")
      })

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.news-container {
  .post {
    color: gray;
  }
}
.news-container {
  background: var(--color-bg-alt);

  .pretitle {
    color: var(--color-primary);
    font-size: 1.4em;
    @media (max-width: 900px) {
      font-size: 1.2rem;
    }
  }
  .title {
    color: var(--color-text-dark);
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.1;
    @media (max-width: 900px) {
      font-size: 2.2rem;
    }
  }
  .news-wrap {
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: 1fr 1fr;
    margin: 2rem auto;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
  .news-item {
    position: relative;
    height: 100%;
    padding: 3rem 2rem;
    border: 1px solid rgba(17, 16, 16, 0.1);
    border-radius: var(--border-radius);
    color: var(--color-text-dark);
    transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      padding: 2rem 2rem 3rem;
      background: var(--color-white);
      color: var(--color-text-dark);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
        0 15px 12px rgba(0, 0, 0, 0.22);

      .read-more {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .date {
      color: var(--color-text-dark);
    }
    .title {
      font-size: 1.4rem;
      font-weight: var(--font-weight-semibold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin: 1.5rem 0 1rem;
    }
    .content {
      font-size: 1.2rem;
      padding-bottom: 1rem;
    }
    .read-more {
      position: absolute;
      left: 0;
      width: 100%;
      display: inline-block;
      padding: 0 2rem;
      font-size: 1.2em;
      opacity: 0;
      transform: translateY(1em);
      transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
  }
}
</style>
