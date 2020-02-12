<template>
  <div class="page-about">
    <el-hero
      :pretitle="setting('about.pretitle')"
      :title="setting('about.title')"
      :image="setting('about.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('about.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section v-if="setting('about.clients')" :id="setting('about.clients.id')" class="clients-wrap">
      <div class="mast">
        <h3 class="pretitle">{{ setting('about.clients.pretitle') }}</h3>
        <h1 v-formatted-text="setting('about.clients.title')" class="title" />
        <div v-formatted-text="setting('about.clients.content')" class="content" />

        <el-clients />
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
//import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    //factorLink,
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
      title: setting("about.meta.title"),
      description: setting("about.meta.description")
    }
  },
  methods: { setting }
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
    border-bottom: 2px solid var(--color-bg, #ffffff);
    .hero-inner {
      padding: 5em 0;
    }
  }
  .clients-wrap {
    padding: 5em 0 8em;
    .pretitle {
      color: var(--color-primary, #1a49bd);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .title {
      font-weight: var(--font-weight-bold, 800);
      font-size: 3em;
      letter-spacing: -0.03em;
      color: #110d47;
      margin: 0.3em 0;

      @media (max-width: 900px) {
        font-size: 2em;
      }
    }
    .content {
      font-size: 1.2em;
      line-height: 1.6em;
      opacity: 0.5;
      margin-bottom: 3rem;
    }
  }
}
</style>
