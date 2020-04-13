<template>
  <div>
    <el-hero
      v-if="setting('pricing.hero')"
      :subheadline="setting('pricing.hero.pretitle')"
      :headline="setting('pricing.hero.title')"
      class="text-left md:pb-40"
    >
      <template v-slot:hero-content>
        <div
          v-formatted-text="setting('pricing.hero.content')"
          class="content entry-content"
        />
      </template>
    </el-hero>

    <section class="p-8 bg-gray-100 lg:py-12">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row">
        <template v-for="(item, index) in setting('pricing.packages')">
          <div :key="index" class="w-full mt-4 md:-mt-32 md:w-4/12">
            <div
              class="rounded bg-white shadow transition-all hover:shadow-lg hover:-mt-8 md:mx-4"
              :class="item.classes"
            >
              <div class="px-8 py-4">
                <h1
                  v-if="item.name"
                  class="font-normal tracking-tight leading-tight text-3xl text-purple-900 lg:text-4xl"
                >
                  {{ item.name }}
                </h1>
                <p
                  v-if="item.description"
                  v-formatted-text="item.description"
                  class="text-gray-600"
                />
              </div>
              <ul class="text-base lg:text-lg">
                <li
                  v-if="item.price"
                  v-formatted-text="item.price"
                  class="px-8 py-4 text-3xl font-normal tracking-tight leading-tight text-purple-900 bg-gray-100"
                />
                <template v-for="(listItem, i) in item.list">
                  <li :key="i" class="px-8 py-4" :class="listItem.classes">
                    <span v-formatted-text="listItem.content" />
                  </li>
                </template>
              </ul>
              <div class="relative z-10 flex justify-center py-6">
                <factorLink
                  v-if="item.buttonLink"
                  :path="item.buttonLink"
                  :class="item.buttonClasses"
                >
                  {{ item.buttonText }}
                  <factor-icon icon="fas fa-angle-right" />
                </factorLink>
              </div>
            </div>
          </div>
        </template>
      </div>
      <p v-if="setting('pricing.packagesFooter')" class="text-xs text-center mt-8">
        {{ setting("pricing.packagesFooter") }}
      </p>
    </section>

    <section v-if="setting('pricing.faq')" class="py-8 lg:py-12 bg-white">
      <div class="max-w-3xl mx-auto">
        <h3
          v-if="setting('pricing.faq.title')"
          class="font-normal leading-tight tracking-tight text-center text-3xl lg:text-4xl text-purple-900"
        >
          {{ setting("pricing.faq.title") }}
        </h3>
        <div v-if="setting('pricing.faq.questions')" class="mt-6 mx-6">
          <template v-for="(question, ind) in setting('pricing.faq.questions')">
            <el-accordion
              :key="ind"
              :title="question.title"
              class="bg-gray-100 rounded-lg"
            >
              <div
                v-formatted-text="question.content"
                class="text-base leading-relaxed lg:text-xl"
              />
            </el-accordion>
          </template>
        </div>
      </div>
    </section>
    <site-cta />
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "el-hero": () => import("./el/hero.vue"),
    "el-accordion": () => import("./el/accordion.vue"),
    "site-cta": () => import("./el/cta.vue"),
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
      title: setting("pricing.meta.title"),
      description: setting("pricing.meta.description"),
      image: setting("pricing.meta.image"),
    }
  },
})
</script>
