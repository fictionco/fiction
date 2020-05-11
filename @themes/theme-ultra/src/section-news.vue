<template>
  <section id="news" class="page-container news-container">
    <h2 v-if="newsPretitle" v-formatted-text="newsPretitle" class="pretitle" />
    <h1 v-if="newsTitle" v-formatted-text="newsTitle" class="title" />
    <blog-index />
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {
    "blog-index": () => import("./blog/blog-index.vue"),
  },
  data() {
    return {
      postType: "blog",
      loading: false,
      newsPretitle: setting("blog.subheadline"),
      newsTitle: setting("blog.headline"),
    }
  },
  methods: {
    setting,
  },
}
</script>

<style lang="less">
.news-container {
  background: var(--color-bg-alt);
  grid-template-rows: 2em 5em 1fr;

  @media (max-width: 900px) {
    padding: 6em 2em 3em;
  }

  .pretitle {
    color: var(--color-primary);
    font-size: 1.4em;
    @media (max-width: 900px) {
      font-size: 1.2rem;
    }
  }
  .title {
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.6;
    @media (max-width: 900px) {
      font-size: 2.2rem;
    }
    a {
      color: var(--color-text);
      &:hover {
        color: var(--color-primary);
      }
      &.edit {
        display: block;
        font-size: 1rem;
        color: var(--color-primary);
      }
    }
  }
}
</style>
