<template>
  <div class="page-contact">
    <el-hero :title="contactTitle">
      <template v-slot:hero-content>
        <div v-if="contactSubtitle" v-formatted-text="contactSubtitle" class="content" />
      </template>
    </el-hero>

    <div class="mast contact-form-wrap">
      <!-- Contact Form Plugin -->
      <component :is="setting('contactForm.form')" />
    </div>
  </div>
</template>

<script lang="ts">
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon,
    factorLink,
    "el-hero": () => import("./el/hero.vue"),
  },
  data() {
    return {
      loading: true,
      contactTitle: setting("contact.title"),
      contactSubtitle: setting("contact.subtitle"),
    }
  },
  methods: {
    setting,
  },
  metaInfo() {
    return {
      title: setting("contact.metatags.title"),
      description: setting("contact.metatags.description"),
      image: setting("contact.metatags.image"),
    }
  },
})
</script>

<style lang="less">
.page-contact {
  .mast {
    margin: 0 auto;
    max-width: 1140px;
  }
  .hero {
    text-align: center;
  }
  .contact-form-wrap {
    padding: 3rem 2rem;
    .contact-form {
      margin: 0 auto;
      max-width: 600px;
    }
  }
}
</style>
