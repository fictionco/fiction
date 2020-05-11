<template>
  <div class="page-jobs">
    <el-hero :title="jobsTitle">
      <template v-slot:hero-content>
        <div v-if="jobsSubtitle" v-formatted-text="jobsSubtitle" class="content" />
      </template>
    </el-hero>
    <el-newsletter />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {
    "el-hero": () => import("./el/hero.vue"),
    "el-newsletter": () => import("./el/newsletter.vue"),
  },
  data() {
    return {
      loading: true,
      jobsTitle: setting("jobs.title"),
      jobsSubtitle: setting("jobs.subtitle"),
    }
  },
  methods: {
    setting,
  },
  metaInfo() {
    return {
      title: setting("jobs.metatags.title"),
      description: setting("jobs.metatags.description"),
      image: setting("jobs.metatags.image"),
    }
  },
}
</script>

<style lang="less">
.page-jobs {
  .mast {
    margin: 0 auto;
    max-width: 1140px;
  }
  .hero {
    text-align: center;
  }
  .jobs-inner {
    padding: 3rem 2rem;
  }
}
</style>
