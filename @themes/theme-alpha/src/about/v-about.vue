<template>
  <div class="page-about">
    <el-hero
      :pretitle="setting('about.pretitle')"
      :title="setting('about.title')"
      :image="setting('about.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('about.content')" class="content text-gray-600" />
      </template>
    </el-hero>

    <section v-if="setting('about.clients')" :id="setting('about.clients.id')" class="clients-wrap">
      <div class="mast">
        <h3 class="pretitle">{{ setting('about.clients.pretitle') }}</h3>
        <h1 v-formatted-text="setting('about.clients.title')" class="title" />
        <div v-formatted-text="setting('about.clients.content')" class="content text-gray-600" />

        <el-clients />
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    "el-clients": () => import("../el/clients.vue"),
    "el-hero": () => import("../el/hero.vue"),
    "el-cta": () => import("../el/cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: setting("about.metatags.title"),
      description: setting("about.metatags.description"),
      image: setting("about.metatags.image")
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.page-about {
  padding-bottom: 3rem;
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  .hero {
    .hero-inner {
      padding: 5em 0;
    }
  }
  .clients-wrap {
    padding: 5em 0 8em;
    .pretitle {
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .title {
      font-weight: var(--font-weight-bold);
      font-size: 3em;
      letter-spacing: -0.03em;
      color: var(--color-text);
      margin: 0.3em 0;

      @media (max-width: 900px) {
        font-size: 2em;
      }
    }
    .content {
      font-size: 1.2em;
      line-height: 1.6em;
      margin-bottom: 3rem;
    }
  }
}
</style>
