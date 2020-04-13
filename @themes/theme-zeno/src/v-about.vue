<template>
  <main class="bg-gray-100">
    <el-hero
      v-if="aboutHero"
      :align="`left`"
      :subheadline="aboutHeroPretitle"
      :headline="aboutHeroTitle"
      class="text-left"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="aboutHeroContent" class="content entry-content" />
      </template>
    </el-hero>

    <section class="max-w-6xl mx-auto px-4 py-16 md:px-8">
      <div class="flex flex-col md:flex-row md:flex-wrap">
        <div class="w-full relative w-full lg:w-2/5">
          <img
            v-if="setting('about.valuesImage1')"
            :src="setting('about.valuesImage1')"
            class="w-full shadow-xl rounded"
          />
          <img
            v-if="setting('about.valuesImage2')"
            :src="setting('about.valuesImage2')"
            class="w-full relative mt-8 bottom-0 right-auto left-0 shadow-xl rounded lg:w-2/3 lg:mt-0 lg:absolute lg:-ml-20"
          />
        </div>
        <div class="w-full pt-8 lg:pt-0 md:pl-16 lg:w-3/5">
          <div
            v-if="setting('about.valuesTitle')"
            class="relative z-10 px-4 py-6 rounded bg-white shadow-lg md:px-4 md:mx-8"
          >
            <h2
              class="font-normal tracking-tight leading-tight text-2xl text-purple-500 md:text-3xl"
            >
              {{ setting("about.valuesTitle") }}
            </h2>
          </div>

          <div
            v-if="setting('about.values')"
            class="rounded-lg -mt-8 p-8 pt-12 border-solid border-2 border-purple-500 flex flex-col md:flex-row md:flex-wrap"
          >
            <div
              v-for="(item, index) in setting('about.values')"
              :key="index"
              class="w-full my-2"
            >
              <h2
                v-if="item.title"
                class="font-normal tracking-tight text-2xl text-purple-900"
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
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-8">
        <div class="max-w-4xl mx-auto pb-6 text-center md:pb-12 md:w-full">
          <h3
            v-if="aboutTeamPretitle"
            v-formatted-text="aboutTeamPretitle"
            class="custom-uppercase text-purple-500"
          />
          <h1
            v-if="aboutTeamTitle"
            v-formatted-text="aboutTeamTitle"
            class="font-normal tracking-tight text-3xl lg:text-4xl text-purple-900"
          />
        </div>

        <!-- Members List -->
        <div
          v-if="aboutTeamLayout == 'list' && aboutTeamMembers"
          class="max-w-3xl mx-auto flex flex-col"
        >
          <section
            v-for="(member, index) in aboutTeamMembers"
            :key="index"
            class="flex flex-col rounded mb-12 p-8 bg-gray-100 md:flex-row"
          >
            <div class="w-full md:w-2/5">
              <img
                v-if="member.photo"
                :src="member.photo"
                :alt="member.name"
                class="w-full rounded mx-auto mb-8 border-solid border border-gray-300 md:w-4/5"
              />
            </div>
            <div class="w-full bg-gray-100 md:w-3/5">
              <h2
                v-if="member.title"
                v-formatted-text="member.title"
                class="block text-left custom-uppercase mb-0 text-purple-500"
              />
              <h1
                v-if="member.name"
                v-formatted-text="member.name"
                class="block text-left font-normal tracking-tight mb-3 text-2xl"
              />
              <div
                v-if="member.content"
                v-formatted-text="member.content"
                class="text-lg text-gray-600"
              />
              <div class="transition-all flex mt-4 -ml-2">
                <template v-for="(item, i) in member.links">
                  <factor-link
                    :key="i"
                    :path="item.path"
                    :event="item.event"
                    :target="item.target"
                    class="transition-all mx-2 h-8 w-8 rounded leading-loose text-center shadow-lg hover:text-purple-500 hover:bg-white"
                  >
                    <factor-icon v-if="item.icon" :icon="item.icon" />
                    <span v-if="item.name" v-formatted-text="item.name" />
                  </factor-link>
                </template>
              </div>
            </div>
          </section>
        </div>

        <!-- Members Grid -->
        <div
          v-else-if="aboutTeamLayout == 'grid' && aboutTeamMembers"
          class="flex flex-col md:flex-row md:flex-wrap"
        >
          <section
            v-for="(member, index) in aboutTeamMembers"
            :key="index"
            class="w-full p-4 md:w-1/3"
          >
            <div class="p-8 rounded-lg bg-gray-100">
              <img
                v-if="member.photo"
                :src="member.photo"
                :alt="member.name"
                class="w-4/5 rounded-full mx-auto border-solid border border-gray-300"
              />
              <el-member :name="member.name" :title="member.title">
                <template v-slot:content>
                  <div
                    v-if="member.content"
                    v-formatted-text="member.content"
                    class="text-lg"
                  />
                  <div class="transition-all flex mt-4 -ml-2">
                    <template v-for="(item, i) in member.links">
                      <factor-link
                        :key="i"
                        :path="item.path"
                        :event="item.event"
                        :target="item.target"
                        class="transition-all mx-2 h-8 w-8 rounded leading-loose text-center shadow-lg hover:text-purple-500 hover:bg-white"
                      >
                        <factor-icon v-if="item.icon" :icon="item.icon" />
                        <span v-if="item.name" v-formatted-text="item.name" />
                      </factor-link>
                    </template>
                  </div>
                </template>
              </el-member>
            </div>
          </section>
        </div>
      </div>
    </section>

    <site-cta />
  </main>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"

import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "el-member": () => import("./el/member.vue"),
    "el-hero": () => import("./el/hero.vue"),
    "site-cta": () => import("./el/cta.vue"),
  },
  data() {
    return {
      loading: true,
      active: false,
      aboutHero: setting("about.hero"),
      aboutHeroPretitle: setting("about.hero.pretitle"),
      aboutHeroTitle: setting("about.hero.title"),
      aboutHeroContent: setting("about.hero.content"),
      aboutTeamPretitle: setting("about.team.pretitle"),
      aboutTeamTitle: setting("about.team.title"),
      aboutTeamLayout: setting("about.team.layout"),
      aboutTeamMembers: setting("about.team.members"),
    }
  },
  methods: {
    setting,
  },
  metaInfo() {
    return {
      title: setting("about.meta.title"),
      description: setting("about.meta.description"),
      image: setting("about.meta.image"),
    }
  },
})
</script>
