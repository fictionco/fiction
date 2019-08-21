<template>
  <div class="page-about">
    <el-hero
      :headline="$setting.get('about.headline')"
      :subheadline="$setting.get('about.subheadline')"
      :image="$setting.get('about.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="$setting.get('about.content')" class="content entry-content" />
      </template>
    </el-hero>

    <el-clients />
    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-hero": () => import("./el/hero.vue"),
    "el-clients": () => import("./el/clients.vue"),
    "el-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  metatags() {
    return {
      title: this.$setting.get("about.meta.title"),
      description: this.$setting.get("about.meta.description")
    }
  }
  // pageTemplate() {
  //   return {
  //     name: "About Page",
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
.page-about {
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
  .hero {
    border-bottom: 2px solid var(--color-bg);
  }
}
</style>