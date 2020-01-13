<template>
  <div class="bg-gray-100">
    <el-hero
      :align="`left`"
      :subheadline="setting('about.hero.pretitle')"
      :headline="setting('about.hero.title')"
      class="text-left"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('about.hero.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section class="max-w-6xl mx-auto px-4 py-16 md:px-8">
      <div class="flex flex-col md:flex-row md:flex-wrap">
        <div class="w-full relative w-full lg:w-2/5">
          <img :src="setting('about.valuesImage1')" class="w-full shadow-xl rounded" />
          <img
            :src="setting('about.valuesImage2')"
            class="w-full relative mt-8 bottom-0 right-auto left-0 shadow-xl rounded lg:w-2/3 lg:mt-0 lg:absolute lg:-ml-20"
          />
        </div>
        <div class="w-full pt-8 lg:pt-0 md:pl-16 lg:w-3/5">
          <div class="relative z-10 px-4 py-6 rounded bg-white shadow-lg md:px-4 md:mx-8">
            <h2
              class="font-normal tracking-tight leading-tight text-2xl text-purple-500 md:text-3xl"
            >{{ setting('about.valuesTitle') }}</h2>
          </div>

          <div
            class="rounded-lg -mt-8 p-8 pt-12 border-2 border-purple-500 flex flex-col md:flex-row md:flex-wrap"
          >
            <div v-for="(item, index) in setting('about.values')" :key="index" class="w-full my-2">
              <h2 class="font-normal tracking-tight text-2xl text-purple-900">{{ item.title }}</h2>
              <div v-if="item.content" class="text-lg text-gray-600">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-8">
        <div class="max-w-4xl mx-auto pb-6 text-center md:pb-12 md:w-full">
          <h3 class="custom-uppercase text-purple-500">{{ teamPretitle }}</h3>
          <h1
            class="font-normal tracking-tight text-3xl lg:text-4xl text-purple-900"
          >{{ teamTitle }}</h1>
        </div>
        <div class="flex flex-col md:flex-row md:flex-wrap">
          <div v-for="(member, index) in teamMembers" :key="index" class="w-full p-4 md:w-1/3">
            <div class="p-8 rounded-lg bg-gray-100">
              <img
                :src="member.photo"
                :alt="member.name"
                class="w-4/5 rounded-full mx-auto border border-gray-300"
              />
              <el-member :name="member.name" :title="member.title">
                <div v-formatted-text="member.content" class="text-lg" />
              </el-member>
            </div>
          </div>
        </div>
      </div>
    </section>

    <site-cta />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"

import Vue from "vue"
export default Vue.extend({
  components: {
    "el-member": () => import("./el/member.vue"),
    "el-hero": () => import("./el/hero.vue"),
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
      teamPretitle: setting("about.team.pretitle"),
      teamTitle: setting("about.team.title"),
      teamMembers: setting("about.team.members")
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