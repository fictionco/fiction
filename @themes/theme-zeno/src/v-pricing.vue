<template>
  <div>
    <section class="bg-purple-900 flex items-center bg-center" :style="introBackground">
      <div class="max-w-2xl mx-auto text-center px-8 py-32">
        <h3 class="custom-uppercase text-purple-400">{{ introPretitle }}</h3>
        <h1 class="mt-2 font-bold leading-tight text-3xl lg:text-4xl text-gray-100">{{ introTitle }}</h1>
        <div v-formatted-text="introContent" class="mt-2 text-base leading-relaxed lg:text-xl" />
      </div>
    </section>

    <section class="max-w-6xl mx-auto p-8 lg:py-12 bg-white">
      <div class="flex flex-col md:flex-row">
        <template v-for="(item, index) in pricingPackages">
          <div :key="index" class="mt-8 w-full text-center md:w-4/12">
            <h1 class="font-bold text-3xl leading-tight text-purple-500 lg:text-4xl">{{ item.name }}</h1>
            <p>{{ item.description }}</p>
            <ul
              :class="item.classes"
              class="m-6 p-4 text-base border rounded-lg lg:text-lg hover:bg-gray-100 transition-all"
            >
              <template v-for="(listItem, i) in item.list">
                <li :key="i" class="py-4" :class="listItem.classes">
                  <template v-if="listItem.contentLarge">
                    <span
                      class="text-3xl font-bold leading-tight text-purple-900"
                    >{{ listItem.contentLarge }}</span>
                  </template>
                  <span v-formatted-text="listItem.content"></span>
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
      <p class="text-center mt-8">{{ packagesFooter }}</p>
    </section>

    <section class="py-8 lg:py-12 bg-gray-100">
      <div class="max-w-3xl mx-auto">
        <h3 class="font-bold text-center text-3xl lg:text-4xl text-purple-900">{{ faqTitle }}</h3>
        <div class="mt-6 mx-6">
          <template v-for="(question, ind) in questions">
            <el-accordion :key="ind" :title="question.title">
              <div v-formatted-text="question.content" class="text-base leading-relaxed lg:text-xl" />
            </el-accordion>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/tools"
// Wrap with Vue extend for Typescript
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "el-accordion": () => import("./el/accordion.vue")
  },
  data() {
    return {
      loading: true,
      introPretitle: setting("pricing.intro.pretitle"),
      introTitle: setting("pricing.intro.title"),
      introBackground: {
        backgroundImage: `url(${setting("pricing.intro.backgroundImage")})`
      },
      introContent: setting("pricing.intro.content"),
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