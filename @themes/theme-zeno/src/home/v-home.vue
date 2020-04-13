<template>
  <div>
    <home-intro v-if="setting(`home.intro.component`)" />
    <section v-if="setting('home.logos')" class="section-2 bg-gray-100 px-8 py-12">
      <div class="max-w-6xl mx-auto">
        <h1 v-if="section2Title" class="custom-uppercase text-center text-purple-500">
          {{ section2Title }}
        </h1>
        <div class="flex flex-wrap items-center justify-center mt-8">
          <template v-for="(item, index) in section2List">
            <factor-link
              v-if="item.link"
              :key="index"
              :path="item.link"
              :target="item.target"
              class="block w-full px-4 py-6 sm:w-1/3"
            >
              <img v-if="item.image" :src="item.image" :alt="item.alt" class="mx-auto" />
            </factor-link>
            <div
              v-else-if="item.image"
              :key="index"
              class="block w-full px-4 py-6 sm:w-1/3"
            >
              <img :src="item.image" :alt="item.alt" class="mx-auto" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <section
      v-if="setting('home.section3')"
      :id="setting('home.section3.id')"
      class="section-3 relative bg-cover bg-center bg-purple-900 px-8 py-16"
    >
      <div
        v-if="section3Items"
        class="relative z-20 max-w-6xl mx-auto flex flex-col bg-white rounded shadow-xl md:flex-row md:flex-wrap"
      >
        <div
          v-for="(item, index) in section3Items"
          :key="index"
          class="w-full even:bg-gray-100 md:w-1/3"
        >
          <div class="p-10">
            <img v-if="item.icon" :src="item.icon" :alt="item.title" />
            <h2
              v-if="item.title"
              class="font-normal tracking-tight text-3xl text-purple-900 mt-5"
            >
              {{ item.title }}
            </h2>
            <div
              v-if="item.content"
              v-formatted-text="item.content"
              class="text-lg text-gray-600"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="setting('home.section4')"
      :id="setting('home.section4.id')"
      class="section-4 bg-cover bg-center bg-white"
    >
      <div class="max-w-6xl mx-auto flex flex-col py-8 md:flex-row lg:pt-12 lg:pb-24">
        <div class="flex flex-col p-8 justify-center md:w-3/5">
          <h3 v-if="section4Pretitle" class="custom-uppercase text-purple-500">
            {{ section4Pretitle }}
          </h3>
          <h1
            v-if="section4Title"
            class="font-normal tracking-tight text-3xl lg:text-4xl text-purple-900"
          >
            {{ section4Title }}
          </h1>
          <div
            v-if="section4Content"
            v-formatted-text="section4Content"
            class="mt-2 text-base leading-relaxed text-gray-600 lg:text-xl"
          />
          <div v-if="section4Buttons" class="mt-8">
            <template v-for="(button, index) in section4Buttons">
              <factor-link :key="index" :path="button.link" :class="button.classes">
                {{ button.text }}
                <factor-icon icon="fas fa-angle-right" />
              </factor-link>
            </template>
          </div>
        </div>
        <component :is="setting('home.section4.figure')" class="flex p-8 md:w-2/5" />
      </div>
    </section>

    <section
      v-if="setting('home.section5')"
      :id="setting('home.section5.id')"
      class="section-5 overflow-hidden relative bg-gray-100"
    >
      <div class="max-w-6xl mx-auto px-8 pt-16 lg:pt-24 lg:pb-12">
        <div class="flex flex-col md:flex-row md:flex-wrap">
          <div class="pb-12 md:w-full">
            <h3
              v-if="section5Pretitle"
              class="custom-uppercase text-center text-purple-500"
            >
              {{ section5Pretitle }}
            </h3>
            <div class="flex items-center justify-center">
              <h1
                v-if="section5Title"
                class="font-normal tracking-tight text-center text-3xl lg:text-4xl text-purple-900"
              >
                {{ section5Title }}
                <img
                  v-if="section5TitleIcon"
                  :src="section5TitleIcon"
                  :alt="section5Title"
                  class="inline-block lg:ml-2"
                />
              </h1>
            </div>
          </div>
          <div v-if="section5Items" class="relative z-10 pb-8 md:pb-0 md:pr-8 md:w-3/5">
            <template v-for="(item, index) in section5Items">
              <div
                :key="index"
                class="mb-10 p-10 transition-all rounded bg-white custom-card-left md:mb-20"
              >
                <img v-if="item.image" :src="item.image" :alt="item.alt" />
                <div
                  v-if="item.content"
                  v-formatted-text="item.content"
                  class="text-base mt-4 leading-relaxed text-gray-600 lg:text-xl"
                />
              </div>
            </template>
          </div>
          <div
            class="relative z-0 max-h-full w-full top-auto right-0 bottom-0 left-auto md:pt-40 md:absolute md:w-1/2"
          >
            <component
              :is="setting('home.section5.syntax')"
              :title="setting('home.section5.syntaxTitle')"
              class="md:pt-24"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="setting('home.testimonials')"
      :id="setting('home.testimonials.id')"
      class="section-6"
    >
      <div class="max-w-6xl mx-auto px-8 py-16 lg:py-24">
        <div class="max-w-xs mx-auto">
          <h3
            v-if="section6Pretitle"
            class="custom-uppercase text-center text-purple-500"
          >
            {{ section6Pretitle }}
          </h3>
          <h1
            v-if="section6Title"
            class="mt-2 text-normal tracking-tight leading-tight text-3xl text-center text-purple-900 lg:text-4xl"
          >
            {{ section6Title }}
          </h1>
        </div>
        <div
          v-if="section6Items"
          class="flex flex-col text-base mt-6 md:flex-row md:flex-wrap lg:text-xl"
        >
          <template v-for="(item, index) in section6Items">
            <div :key="index" class="w-full p-8 md:w-1/2">
              <blockquote v-if="item.content" class="relative inline-block">
                <span class="absolute text-6xl text-purple-600 font-serif -ml-10 -mt-6"
                  >&ldquo;</span
                >
                <span
                  v-formatted-text="item.content"
                  class="leading-relaxed text-gray-600"
                />
              </blockquote>
              <footer class="flex items-center mt-6">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.author + ' - ' + item.info"
                  class="rounded-full h-10 w-10 ml-auto shadow-lg md:h-16 md:w-16"
                />
                <div class="ml-4 text-base">
                  <cite v-if="item.author" class="block">{{ item.author }}</cite>
                  <cite v-if="item.info" class="block">{{ item.info }}</cite>
                </div>
              </footer>
            </div>
          </template>
        </div>
      </div>
    </section>

    <site-cta />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import { factorBtn, factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorBtn,
    factorLink,
    factorIcon,
    siteCta: () => import("../el/cta.vue"),
    homeIntro: setting("home.intro.component"),
  },
  data() {
    return {
      loading: true,
      section1Title: setting("home.intro.title"),
      section1Content: setting("home.intro.content"),
      section1Buttons: setting("home.intro.buttons"),
      section1Figure: setting("home.intro.figure"),
      section2Title: setting("home.logos.title"),
      section2List: setting("home.logos.list"),
      section3Items: setting("home.section3.items"),
      section4Pretitle: setting("home.section4.pretitle"),
      section4Title: setting("home.section4.title"),
      section4Content: setting("home.section4.content"),
      section4Buttons: setting("home.section4.buttons"),
      section5Pretitle: setting("home.section5.pretitle"),
      section5Title: setting("home.section5.title"),
      section5TitleIcon: setting("home.section5.titleIcon"),
      section5Items: setting("home.section5.items"),
      section6Pretitle: setting("home.testimonials.pretitle"),
      section6Title: setting("home.testimonials.title"),
      section6Items: setting("home.testimonials.items"),
    }
  },
  methods: {
    setting,
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description"),
      image: setting("home.meta.image"),
    }
  },
})
</script>

<style lang="less">
.section-3 {
  &:after {
    position: absolute;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    display: block;
    width: 100%;
    height: 30%;
    background: #fff;
  }
}
.section-3 {
  background-image: url(../img/light-pattern.svg);
}
.section-4 {
  background-image: url(../img/lighter-pattern.svg);
}
</style>
