<template>
  <div class="page-home">
    <section-intro />
    <section-about />
    <section-services />
    <section-portfolio />
    <section-news />
    <section-contact />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: {
    "section-intro": () => import("./section-intro.vue"),
    "section-about": () => import("./section-about.vue"),
    "section-services": () => import("./section-services.vue"),
    "section-portfolio": () => import("./section-portfolio.vue"),
    "section-news": () => import("./section-news.vue"),
    "section-contact": () => import("./section-contact.vue"),
  },
  data() {
    return {
      loading: true,
    }
  },
})
</script>

<style lang="less"></style>
