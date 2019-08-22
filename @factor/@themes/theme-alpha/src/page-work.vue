<template>
  <div class="page-work">
    <el-hero
      :headline="$setting.get('work.headline')"
      :subheadline="$setting.get('work.subheadline')"
      :image="$setting.get('work.heroImage')"
    >
      <template v-slot:hero-content>
        <div
          v-formatted-text="$setting.get('work.content')"
          class="content entry-content"
        />
      </template>
    </el-hero>

    <router-view />
    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-hero": () => import("./el/hero.vue")
    //"el-cta": () => import("./el/cta.vue")
  },
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: false
    }
  },
  metatags() {
    return {
      title: this.$setting.get("work.metatags.title"),
      description: this.$setting.get("work.metatags.description")
    }
  }
}
</script>

<style lang="less">
.page-work {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .factor-btn.default {
    color: var(--color-primary, #1a49bd);
    letter-spacing: -0.03em;
  }

  .posts {
    padding: 6em 0;
    .posts-inner {
      display: grid;
      grid-gap: 20px 30px;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 100px;
      }
    }
  }
}
</style>
