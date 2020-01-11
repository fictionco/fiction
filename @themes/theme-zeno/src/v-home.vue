<template>
  <div>
    <section class="home-hero pt-12 lg:pt-0">
      <div class="home-hero-img hidden lg:block bg-purple-900" />
      <div class="px-16 mx-auto">
        <!-- <h3 class="custom-uppercase text-purple-500 lg:text-base">{{ introPretitle }}</h3> -->
        <h1
          v-formatted-text="introTitle"
          class="font-bold leading-tight text-3xl mt-2 text-purple-900 lg:text-5xl"
        />
        <div v-formatted-text="introContent" class="mt-2 text-lg lg:text-xl" />
        <div class="mt-8">
          <template v-for="(button, index) in introButtons">
            <factor-link :key="index" :path="button.link" :class="button.classes">
              {{ button.text }}
              <factor-icon icon="angle-right" />
            </factor-link>
          </template>
        </div>
      </div>
    </section>

    <section class="section-2 bg-gray-100 px-8 pt-12 pb-16">
      <div class="max-w-6xl mx-auto">
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
      </div>
    </section>

    <section
      :id="solutionsID"
      class="section-3 relative bg-cover bg-center bg-purple-900 px-8 py-16"
    >
      <div
        class="relative z-20 max-w-6xl mx-auto flex flex-col bg-white rounded shadow-xl md:flex-row md:flex-wrap"
      >
        <div
          v-for="(item, index) in solutionsItems"
          :key="index"
          class="w-full even:bg-gray-100 md:w-1/3"
        >
          <div class="p-10">
            <img :src="item.icon" :alt="item.title" />
            <h2 class="font-bold text-2xl text-purple-900 mt-5">{{ item.title }}</h2>
            <div v-if="item.content" class="text-lg text-gray-600">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </section>

    <section :id="devopsID" class="section-4 bg-cover bg-center bg-white">
      <div class="max-w-6xl mx-auto flex flex-col py-8 md:flex-row lg:pt-12 lg:pb-24">
        <div class="flex flex-col p-8 justify-center md:w-3/5">
          <h3 class="custom-uppercase text-purple-500">{{ devopsPretitle }}</h3>
          <h1 class="font-bold text-3xl lg:text-4xl text-purple-900">{{ devopsTitle }}</h1>
          <div v-formatted-text="devopsContent" class="mt-2 text-base leading-relaxed lg:text-xl" />
          <div class="mt-8">
            <template v-for="(button, index) in devopsButtons">
              <factor-link :key="index" :path="button.link" :class="button.classes">
                {{ button.text }}
                <factor-icon icon="angle-right" />
              </factor-link>
            </template>
          </div>
        </div>
        <!-- <div class="flex flex-col items-center p-8 mt-8 rounded bg-gray-100 md:w-2/5">
          <ul
            class="flex items-center flex-wrap font-normal list-inside list-square text-base lg:text-xl"
          >
            <li
              v-for="(listItem, i) in setting('home.devops.list')"
              :key="i"
              class="w-1/2 px-1 py-2 text-purple-500"
            >
              <span class="text-gray-600">{{ listItem.text }}</span>
            </li>
          </ul>
        </div>-->
        <component :is="devopsFigure" class="flex p-8 md:w-2/5" />
      </div>
    </section>

    <section :id="infrID" class="relative bg-gray-100">
      <div class="max-w-6xl mx-auto px-8 py-16 lg:pt-24 lg:pb-12">
        <div class="flex flex-col md:flex-row md:flex-wrap">
          <div class="pb-12 md:w-full">
            <h3 class="custom-uppercase text-center text-purple-500">{{ infrPretitle }}</h3>
            <div class="flex items-center justify-center">
              <h1 class="font-bold text-center text-3xl lg:text-4xl text-purple-900">
                {{ infrTitle }}
                <img
                  :src="infrTitleIcon"
                  :alt="infrTitle"
                  class="inline-block lg:ml-2"
                />
              </h1>
            </div>
          </div>
          <div class="relative z-10 pb-8 md:pb-0 md:pr-8 md:w-3/5">
            <template v-for="(item, index) in infrItems">
              <div :key="index" class="mb-20 p-10 rounded bg-white custom-card-left">
                <img :src="item.image" :alt="item.alt" />
                <div
                  v-formatted-text="item.content"
                  class="text-base mt-4 leading-relaxed lg:text-xl"
                />
              </div>
            </template>
          </div>
          <div class="relative z-0 w-full top-auto right-0 bottom-0 left-auto md:absolute md:w-1/2">
            <component :is="infrSyntax" />
          </div>
        </div>
      </div>
    </section>

    <section class="section-6">
      <div class="max-w-6xl mx-auto px-8 py-16 lg:py-24">
        <div class="max-w-xs mx-auto">
          <h3 class="custom-uppercase text-center text-purple-500">{{ testimonialsPretitle }}</h3>
          <h1
            class="mt-2 font-bold text-3xl text-center leading-tight text-purple-900 lg:text-4xl"
          >{{ testimonialsTitle }}</h1>
        </div>
        <div class="flex flex-col text-base mt-6 md:flex-row lg:text-xl">
          <template v-for="(item, index) in testimonialsItems">
            <div :key="index" class="flex-1 px-8 pt-8">
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

<style lang="less">
.home-hero {
  display: grid;
  grid-template-columns: 1fr minmax(750px, 1fr);
  grid-gap: 0;
  align-items: center;
  min-height: 450px;
  height: 85vh;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    min-height: 50vh;
  }

  .home-hero-img {
    height: 100%;
    width: 100%;
    background-image: url(./img/intro.svg);
    background-position: 0 0;
    background-size: cover;
  }
}
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
  background-image: url(./img/light-pattern.svg);
}
.section-4 {
  background-image: url(./img/lighter-pattern.svg);
}
</style>