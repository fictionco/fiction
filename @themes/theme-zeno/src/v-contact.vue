<template>
  <div>
    <el-hero
      :subheadline="setting('contact.hero.pretitle')"
      :headline="setting('contact.hero.title')"
      class="text-left"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('contact.hero.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section class="bg-gray-100 bg-repeat-x">
      <div class="max-w-4xl mx-auto py-8">
        <component :is="setting('contactForm.form')" class="bg-white shadow-lg rounded-lg p-8" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    "el-hero": () => import("./el/hero.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("contact.meta.title"),
      description: setting("contact.meta.description"),
      image: setting("contact.meta.image")
    }
  }
})
</script>
