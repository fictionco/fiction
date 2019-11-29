<template>
  <div>
    <section class="bg-gray-100 flex items-center" :style="introBackground">
      <div class="max-w-2xl mx-auto text-center px-8 py-32">
        <h3 class="custom-uppercase text-purple-500">{{ introPretitle }}</h3>
        <h1
          class="mt-1 font-bold leading-tight text-3xl lg:text-4xl text-purple-900"
        >{{ introTitle }}</h1>
      </div>
    </section>

    <section class="bg-gray-100 pb-16">
      <div class="bg-purple-900 pt-8 pb-24 md:pt-16 md:pb-32 px-8">
        <squares-title :title="teamTitle" class="text-center" />
      </div>
      <div class="flex flex-col items-center -mt-24">
        <template v-for="(member, index) in teamMembers">
          <div
            :key="index"
            class="sm:flex w-11/12 p-6 mt-8 bg-white shadow-lg md:w-10/12 lg:w-8/12 lg:p-10 xl:w-7/12"
          >
            <div class="w-full sm:w-4/12">
              <img :src="member.photo" :alt="member.name" class="rounded mx-auto" />
              <div class="flex justify-center mt-4 text-2xl">
                <template v-for="(social, i) in member.social">
                  <factor-link
                    :key="i"
                    :target="social.target"
                    :path="social.link"
                    class="px-2 hover:text-gray-500"
                  >
                    <factor-icon :icon="social.icon" />
                  </factor-link>
                </template>
              </div>
            </div>
            <div class="w-full mt-6 sm:mt-0 sm:pl-10 sm:w-8/12">
              <h2 class="custom-uppercase text-purple-500">{{ member.title }}</h2>
              <h1 class="font-bold text-3xl text-purple-900">{{ member.name }}</h1>
              <div
                v-formatted-text="member.content"
                class="mt-2 text-base leading-relaxed lg:text-xl"
              />
            </div>
          </div>
        </template>
      </div>
    </section>

    <section class="max-w-6xl mx-auto py-8 lg:py-12 bg-white">
      <h1 class="font-bold text-3xl text-center text-purple-900 lg:text-4xl">{{ locationTitle }}</h1>
      <component :is="locationFigure" />
    </section>

    <site-cta />
  </div>
</template>

<script lang="ts">
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/tools"

import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon,
    factorLink,
    "squares-title": () => import("./el/squares-title.vue"),
    "site-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true,
      introPretitle: setting("about.intro.pretitle"),
      introTitle: setting("about.intro.title"),
      introBackground: {
        backgroundImage: `url(${setting("about.intro.backgroundImage")})`
      },
      teamTitle: setting("about.team.title"),
      teamMembers: setting("about.team.members"),
      locationTitle: setting("about.location.title"),
      locationFigure: setting("about.location.figure")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("about.meta.title"),
      description: setting("about.meta.description"),
      image: setting("about.meta.image")
    }
  }
})
</script>
