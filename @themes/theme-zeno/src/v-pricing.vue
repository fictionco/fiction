<template>
  <div>
    <el-hero
      :subheadline="setting('pricing.intro.pretitle')"
      :headline="setting('pricing.intro.title')"
      class="text-left"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('pricing.intro.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section class="max-w-6xl mx-auto p-8 lg:py-12 bg-white">
      <div class="flex flex-col md:flex-row">
        <template v-for="(item, index) in pricingPackages">
          <div :key="index" class="mt-8 w-full text-center md:w-4/12">
            <h1
              class="font-semibold tracking-tight leading-tight text-3xl text-purple-900 lg:text-4xl"
            >{{ item.name }}</h1>
            <p class="text-gray-600">{{ item.description }}</p>
            <ul
              :class="item.classes"
              class="my-6 p-4 text-base border rounded-lg transition-all md:m-6 lg:text-lg"
            >
              <template v-for="(listItem, i) in item.list">
                <li :key="i" class="py-4" :class="listItem.classes">
                  <template v-if="listItem.contentLarge">
                    <div
                      class="text-3xl font-normal tracking-tight leading-tight text-purple-900"
                    >{{ listItem.contentLarge }}</div>
                  </template>
                  <span v-formatted-text="listItem.content" />
                </li>
              </template>
            </ul>
            <factorLink
              :key="index"
              :path="item.buttonLink"
              :class="item.buttonClasses"
              class="mt-2"
            >
              {{ item.buttonText }}
              <factor-icon icon="arrow-right" />
            </factorLink>
          </div>
        </template>
      </div>
      <p class="text-xs text-center mt-8">{{ packagesFooter }}</p>
    </section>

    <section class="py-8 lg:py-12 bg-gray-100">
      <div class="max-w-3xl mx-auto">
        <h3
          class="font-normal leading-tight tracking-tight text-center text-3xl lg:text-4xl text-purple-900"
        >{{ faqTitle }}</h3>
        <div class="mt-6 mx-6">
          <template v-for="(question, ind) in questions">
            <el-accordion :key="ind" :title="question.title">
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
// Wrap with Vue extend for Typescript
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "el-hero": () => import("./el/hero.vue"),
    "el-accordion": () => import("./el/accordion.vue"),
    "site-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true,
      pricingPackages: setting("pricing.packages"),
      packagesFooter: setting("pricing.packagesFooter"),
      faqTitle: setting("pricing.faq.title"),
      questions: setting("pricing.faq.questions")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("pricing.meta.title"),
      description: setting("pricing.meta.description"),
      image: setting("pricing.meta.image")
    }
  }
})
</script>
