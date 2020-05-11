<template>
  <div class="page-home">
    <home-intro v-if="setting(`home.intro.component`)" />

    <home-section2 v-if="setting(`home.section2.component`)" />

    <home-section3 v-if="setting(`home.section3.component`)" :the-posts="workPosts" />

    <home-section4 v-if="setting(`home.section4.component`)" />

    <home-section5 v-if="setting(`home.section5.component`)" />

    <el-cta />
  </div>
</template>

<script lang="ts">
import { setting, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"

export default {
  components: {
    homeIntro: setting("home.intro.component"),
    homeSection2: setting("home.section2.component"),
    homeSection3: setting("home.section3.component"),
    homeSection4: setting("home.section4.component"),
    homeSection5: setting("home.section5.component"),
    "el-cta": () => import("../el/cta.vue"),
  },
  data() {
    return {
      loading: true,
      postType: "work",
    }
  },
  metaInfo() {
    return {
      title: setting("home.metatags.title"),
      description: setting("home.metatags.description"),
      image: setting("home.metatags.image"),
    }
  },
  computed: {
    index(this: any) {
      return stored(this.postType) || {}
    },
    workPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getPosts()
      },
    },
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    setting,
    async getPosts(this: any) {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        //tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("home.section3.limit"),
      })

      this.loading = false
    },
  },
  serverPrefetch() {
    return this.getPosts()
  },
}
</script>

<style lang="less">
.page-home {
  padding-bottom: 3rem;
  .mast {
    margin: 0 auto;
    max-width: 1000px;
    line-height: 1.2;

    @media (max-width: 900px) {
      padding: 0 2em;
    }
  }
  .title-wrap {
    margin-bottom: 1rem;
  }
  .pretitle {
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .title {
    font-weight: var(--font-weight-bold);
    font-size: 3em;
    letter-spacing: -0.03em;
    color: var(--color-text);

    @media (max-width: 900px) {
      font-size: 2em;
    }
  }
}
</style>
