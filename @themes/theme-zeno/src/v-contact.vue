<template>
  <main class="bg-gray-100">
    <el-hero
      v-if="setting('contact.hero')"
      :align="`center`"
      :subheadline="setting('contact.hero.pretitle')"
      :headline="setting('contact.hero.title')"
      class="text-center pb-24 md:pb-32"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('contact.hero.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section>
      <div class="max-w-4xl mx-auto px-4 py-8 md:px-8 md:pt-8 md:pb-24">
        <component
          :is="setting('contactForm.form')"
          class="bg-white shadow-lg rounded-lg -mt-24 p-4 md:p-8"
        />
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {
    "el-hero": () => import("./el/hero.vue"),
  },
  data() {
    return {
      loading: true,
    }
  },
  methods: {
    setting,
  },
  metaInfo() {
    return {
      title: setting("contact.meta.title"),
      description: setting("contact.meta.description"),
      image: setting("contact.meta.image"),
    }
  },
}
</script>

<style lang="less">
//Overwrite plugin styles
.contact-form {
  .input-wrap .label {
    @apply font-normal leading-tight text-lg text-purple-900;
  }
  input,
  textarea {
    @apply border-solid border border-gray-300 rounded py-2 px-4 block w-full appearance-none leading-normal bg-gray-100;
  }
  .form-submit {
    @apply m-0;
    button {
      @apply inline-block px-5 py-3 font-sans font-semibold text-sm leading-tight tracking-widest uppercase rounded text-purple-100 bg-purple-500;
    }
  }
}
</style>
