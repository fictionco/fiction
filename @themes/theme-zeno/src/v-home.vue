<template>
  <div>
    <section>
      <div class="flex bg-gray-100 min-h-full">
        <div
          class="flex items-center px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:w-1/2 lg:max-w-full lg:py-24 lg:px-12"
        >
          <div class="xl:max-w-full xl:ml-auto pr-2 lg:pr-8 xl:pr-12">
            <h3 class="uppercase-custom text-purple-700">{{ introPretitle }}</h3>
            <h1 class="font-bold text-4xl lg:text-3xl xl:text-4xl text-purple-900">{{ introTitle }}</h1>
            <div v-formatted-text="introContent" class="mt-2 text-xl text-gray-600" />

            <div class="mt-4">
              <template v-for="(button, index) in introButtons">
                <factor-link :key="index" :path="button.link" :class="button.classes">
                  {{ button.text }}
                  <factor-icon icon="arrow-right" />
                </factor-link>
              </template>
            </div>
          </div>
        </div>
        <div class="hidden lg:block lg:w-1/2 bg-purple-900">
          <component
            :is="introFigure"
            class="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>

    <section class="max-w-full mx-auto md:py-24 md:px-12 sm:p-8">
      <h1 class="uppercase-custom text-center text-purple-700">{{ clientsTitle }}</h1>
      <div class="flex justify-center items-center h-32">
        <template v-for="(item, index) in clientsList">
          <factor-link :key="index" :path="item.link" class="flex-1 px-4 py-2 m-2 text-center">
            <img :src="item.image" :alt="item.alt" class="mx-auto" />
          </factor-link>
        </template>
      </div>
    </section>

    <section>
      <div class="bg-purple-900 py-12 px-8">
        <h1
          class="font-bold text-center text-4xl lg:text-3xl xl:text-4xl text-gray-200"
        >{{ solutionsTitle }}</h1>
      </div>
      <template v-for="(item, index) in solutionsItems">
        <div :key="index">
          <img :src="item.icon" :alt="item.title" />
          <h2>{{ item.title }}</h2>
          <ul>
            <template v-for="(listItem, i) in item.list">
              <li :key="i">{{ listItem.content }}</li>
            </template>
          </ul>
        </div>
      </template>
    </section>

    <section :ref="devopsID">
      <div>
        <component :is="devopsFigure" />
      </div>
      <div>
        <h3 class="uppercase-custom text-purple-700">{{ devopsPretitle }}</h3>
        <h1 class="font-bold text-4xl lg:text-3xl xl:text-4xl text-purple-900">{{ devopsTitle }}</h1>
        <div v-formatted-text="devopsContent" />
        <div>
          <template v-for="(button, index) in devopsButtons">
            <factor-link :key="index" :path="button.link" :class="button.classes">
              {{ button.text }}
              <factor-icon icon="arrow-right" />
            </factor-link>
          </template>
        </div>
      </div>
    </section>

    <section>
      <div>
        <h3>{{ infrPretitle }}</h3>
        <div>
          <h1>{{ infrTitle }}</h1>
          <img :src="infrTitleIcon" :alt="infrTitle" />
        </div>
        <template v-for="(item, index) in infrItems">
          <div :key="index">
            <img :src="item.image" :alt="item.alt" />
            <div v-formatted-text="item.content" />
          </div>
        </template>
      </div>
      <div>
        <component :is="infrSyntax" />
      </div>
    </section>

    <section>
      <h3 class="uppercase-custom text-purple-700">{{ testimonialsPretitle }}</h3>
      <h1>{{ testimonialsTitle }}</h1>

      <div>
        <template v-for="(item, index) in testimonialsItems">
          <figure :key="index">
            <blockquote>
              &ldquo;
              <div v-formatted-text="item.content" />&rdquo;
            </blockquote>
            <footer>
              <img :src="item.image" :alt="item.author + ' - ' + item.info" />
              <p>
                <cite>{{ item.author }}</cite>
              </p>
              <p>
                <cite>{{ item.info }}</cite>
              </p>
            </footer>
          </figure>
        </template>
      </div>
    </section>

    <site-cta />
  </div>
</template>

<script>
import { setting } from "@factor/tools"
import { factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
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
      solutionsTitle: setting("home.solutions.title"),
      solutionsItems: setting("home.solutions.items"),
      devopsID: setting("home.devops.id"),
      devopsFigure: setting("home.devops.figure"),
      devopsPretitle: setting("home.devops.pretitle"),
      devopsTitle: setting("home.devops.title"),
      devopsContent: setting("home.devops.content"),
      devopsButtons: setting("home.devops.buttons"),
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
