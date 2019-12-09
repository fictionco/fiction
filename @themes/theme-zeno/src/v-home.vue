<template>
  <div class="lg:-mt-24">
    <section class="flex bg-gray-100 min-h-full">
      <div class="px-8 py-16 mx-auto sm:max-w-xl lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
        <h3 class="custom-uppercase text-purple-500 lg:text-base">{{ introPretitle }}</h3>
        <h1
          v-formatted-text="introTitle"
          class="font-bold leading-tight text-3xl mt-2 text-purple-900 lg:text-4xl"
        />
        <div v-formatted-text="introContent" class="mt-2 text-base lg:text-xl" />
        <div class="mt-8">
          <template v-for="(button, index) in introButtons">
            <factor-link :key="index" :path="button.link" :class="button.classes">
              {{ button.text }}
              <factor-icon icon="arrow-right ml-4" />
            </factor-link>
          </template>
        </div>
      </div>
      <div class="hidden lg:block lg:w-1/2 bg-purple-900">
        <component :is="introFigure" />
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-8 py-12">
      <h1 class="custom-uppercase text-center text-purple-500">{{ clientsTitle }}</h1>
      <div class="flex flex-wrap items-center mt-8">
        <template v-for="(item, index) in clientsList">
          <factor-link
            :key="index"
            :path="item.link"
            :target="item.target"
            class="block w-full px-4 py-6 sm:w-1/3"
          >
            <img :src="item.image" :alt="item.alt" class="mx-auto" />
          </factor-link>
        </template>
      </div>
    </section>

    <section :id="solutionsID" class="bg-gray-100 pb-16">
      <div class="bg-purple-900 pt-8 px-8 pb-24 text-center md:pt-16 md:pb-32">
        <squares-title :title="solutionsTitle" />
      </div>
      <div class="flex flex-col items-center -mt-24">
        <template v-for="(item, index) in solutionsItems">
          <div
            :key="index"
            class="w-11/12 px-6 py-10 mt-8 bg-white shadow-lg md:w-8/12 lg:w-6/12 lg:px-16"
          >
            <div class="flex items-center">
              <img :src="item.icon" :alt="item.title" />
              <h2 class="font-bold text-3xl text-purple-900 ml-5">{{ item.title }}</h2>
            </div>
            <ul
              class="font-normal list-outside list-square mt-8 text-base leading-relaxed lg:text-xl"
            >
              <template v-for="(listItem, i) in item.list">
                <li :key="i" class="text-purple-500 mt-4 ml-5">
                  <span class="text-gray-600">{{ listItem.content }}</span>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
    </section>

    <section :id="devopsID" class="max-w-6xl mx-auto bg-white">
      <div class="flex flex-col py-8 md:flex-row lg:py-12">
        <component :is="devopsFigure" class="flex p-8 md:w-1/2" />
        <div class="flex flex-col p-8 justify-center md:w-1/2">
          <h3 class="custom-uppercase text-purple-500">{{ devopsPretitle }}</h3>
          <h1 class="font-bold text-3xl lg:text-4xl text-purple-900">{{ devopsTitle }}</h1>
          <div v-formatted-text="devopsContent" class="mt-2 text-base leading-relaxed lg:text-xl" />
          <div class="mt-8">
            <template v-for="(button, index) in devopsButtons">
              <factor-link :key="index" :path="button.link" :class="button.classes">
                {{ button.text }}
                <factor-icon icon="arrow-right ml-4" />
              </factor-link>
            </template>
          </div>
        </div>
      </div>
    </section>

    <section :id="infrID" class="bg-gray-100">
      <div class="max-w-6xl mx-auto px-8 py-16 lg:py-24">
        <div class="flex flex-col md:flex-row">
          <div class="pb-8 md:pb-0 md:pr-8 md:w-1/2">
            <h3 class="custom-uppercase text-purple-500">{{ infrPretitle }}</h3>
            <div class="flex items-center">
              <h1 class="font-bold text-3xl lg:text-4xl text-purple-900">
                {{ infrTitle }}
                <img
                  :src="infrTitleIcon"
                  :alt="infrTitle"
                  class="inline-block lg:ml-2"
                />
              </h1>
            </div>
            <template v-for="(item, index) in infrItems">
              <div :key="index" class="my-10 p-5 rounded bg-white custom-card-left">
                <img :src="item.image" :alt="item.alt" />
                <div
                  v-formatted-text="item.content"
                  class="text-base mt-4 leading-relaxed lg:text-xl"
                />
              </div>
            </template>
          </div>
          <component :is="infrSyntax" class="pt-8 md:pt-0 md:pl-8 md:w-1/2" />
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-8 py-16 lg:py-24">
      <div class="max-w-xs mx-auto">
        <h3 class="custom-uppercase text-center text-purple-500">{{ testimonialsPretitle }}</h3>
        <h1
          class="mt-2 font-bold text-3xl text-center leading-tight text-purple-900 lg:text-4xl"
        >{{ testimonialsTitle }}</h1>
      </div>
      <div class="flex flex-col text-base mt-6 md:flex-row lg:text-xl">
        <template v-for="(item, index) in testimonialsItems">
          <figure :key="index" class="flex-1 px-8 pt-8">
            <blockquote class="relative inline-block quote">
              <span class="absolute text-5xl text-gray-400 -ml-6 -mt-6">&ldquo;</span>
              <span v-formatted-text="item.content" class="leading-relaxed" />
            </blockquote>
            <footer class="flex items-center mt-4">
              <img
                :src="item.image"
                :alt="item.author + ' - ' + item.info"
                class="rounded-full h-10 w-10 md:h-16 md:w-16"
              />
              <div class="ml-4 text-base">
                <cite class="block">{{ item.author }}</cite>
                <cite class="block">{{ item.info }}</cite>
              </div>
            </footer>
          </figure>
        </template>
      </div>
    </section>

    <site-cta />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import { factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "squares-title": () => import("./el/squares-title.vue"),
    "site-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true,
      introPretitle: setting("home.intro.pretitle"),
      introTitle: setting("home.intro.title"),
      introContent: setting("home.intro.content"),
      introButtons: setting("home.intro.buttons"),
      introFigure: setting("home.intro.figure"),
      clientsTitle: setting("home.clients.title"),
      clientsList: setting("home.clients.list"),
      solutionsID: setting("home.solutions.id"),
      solutionsTitle: setting("home.solutions.title"),
      solutionsTitleFigure: setting("home.solutions.titleFigure"),
      solutionsItems: setting("home.solutions.items"),
      devopsID: setting("home.devops.id"),
      devopsFigure: setting("home.devops.figure"),
      devopsPretitle: setting("home.devops.pretitle"),
      devopsTitle: setting("home.devops.title"),
      devopsContent: setting("home.devops.content"),
      devopsButtons: setting("home.devops.buttons"),
      infrID: setting("home.infrastructure.id"),
      infrPretitle: setting("home.infrastructure.pretitle"),
      infrTitle: setting("home.infrastructure.title"),
      infrTitleIcon: setting("home.infrastructure.titleIcon"),
      infrItems: setting("home.infrastructure.items"),
      infrSyntax: setting("home.infrastructure.syntax"),
      testimonialsPretitle: setting("home.testimonials.pretitle"),
      testimonialsTitle: setting("home.testimonials.title"),
      testimonialsItems: setting("home.testimonials.items")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description"),
      image: setting("home.meta.image")
    }
  }
})
</script>
