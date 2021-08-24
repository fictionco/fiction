<template>
  <div>
    <section
      class="
        pt-12
        lg:pt-28
        mx-auto
        max-w-7xl
        px-4
        md:px-20
        lg:px-12
        text-center
      "
    >
      <h1
        class="
          mb-4
          text-3xl
          font-extrabold
          sm:text-4xl
          lg:text-6xl
          xl:text-7xl
          m-auto
        "
      >
        Nice to Meet You
      </h1>
      <p class="mb-12 text-xl text-bluegray-500 m-auto sm:max-w-lg lg:mb-20">
        Darwin was launched in 2021 by people with a passion for creating great
        products and data-driven marketing.
      </p>
    </section>

    <div class="mx-auto px-4 max-w-4xl sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:space-y-0">
        <div class="lg:col-span-2">
          <ul
            class="
              space-y-12
              sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0
              lg:gap-x-16
            "
          >
            <li v-for="(member, index) in team" :key="index">
              <div class="">
                <div class="aspect-w-3 aspect-h-2">
                  <img
                    class="object-cover shadow-lg rounded-lg"
                    :src="member.img"
                    :alt="member.name"
                    :title="member.name"
                  />
                </div>
                <div class="mt-8 mb-4 text-2xl leading-6 font-medium space-y-1">
                  <h3>{{ member.name }}</h3>
                </div>
                <p class="text-lg mb-4 text-bluegray-500">
                  {{ member.content }}
                </p>

                <ul v-if="member.social" class="flex space-x-5">
                  <li v-for="(item, ii) in member.social" :key="ii">
                    <a
                      :href="item.link"
                      class="text-primary-500 hover:text-primary-400"
                      target="_blank"
                    >
                      <span class="sr-only">{{ item.name }}</span>
                      <span v-html="item.icon" />
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"

import FictionAndrew from "./img/fiction-andrew.jpg"
import FictionRaymond from "./img/fiction-raymond.jpg"

export default {
  components: {},
  setup() {
    const team = ref([
      {
        img: FictionAndrew,
        name: "Andrew Powers",
        content: `Andrew is a software developer, designer, and entrepreneur. Outside of business, he has two kids, enjoys playing music, and has spent several years as a digital nomad.`,
        social: [
          {
            icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" > <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" /> </svg>`,
            name: "LinkedIn",
            link: "https://www.linkedin.com/in/arpowers/",
          },
        ],
      },
      {
        img: FictionRaymond,
        name: "Raymond Aleman",
        content: `Raymond is an accomplished UX designer who loves studying user behavior and building data driven UI.
          Outside of work, ray loves to cook and play the guitar.`,
        social: [
          {
            icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" > <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" /> </svg>`,
            name: "LinkedIn",
            link: "https://www.linkedin.com/in/raylopezaleman/",
          },
        ],
      },
    ])

    return {
      team,
    }
  },
}
</script>
