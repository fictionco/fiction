<template>
  <section id="news" class="page-container news-container">
    <h2 v-if="newsPretitle" v-formatted-text="newsPretitle" class="pretitle" />
    <h1 v-if="newsTitle" v-formatted-text="newsTitle" class="title" />
    <news-index />
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/api/settings"
import Vue from "vue"

export default Vue.extend({
  components: {
    "news-index": () => import("./news/news-index.vue")
  },
  data() {
    return {
      postType: "news",
      loading: false,
      newsPretitle: setting("news.pretitle"),
      newsTitle: setting("news.title")
    }
  },
  methods: {
    setting
  }
})
</script>

<style lang="less">
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
