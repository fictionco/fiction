<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-center text-2xl tracking-tight font-bold sm:text-4xl">
        Why you'll love using Factor
      </h2>
      <p class="text-center mt-4 text-lg text-color-700 md:text-xl">
        Factor will help you launch websites and applications faster.
      </p>
    </div>

    <div class="pt-16">
      <h2 class="sr-only">
        Factor will help you launch websites and applications faster.
      </h2>
      <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
        <div v-for="(benefit, i) in benefits" :key="i">
          <FactorIcons
            :icon="benefit.icon"
            class="
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-md
              shadow-lg
              overflow-hidden
            "
          />
          <div class="mt-5">
            <dt class="text-xl leading-6 font-bold">
              {{ benefit.title }}
            </dt>
            <dd class="mt-2 text-base text-color-700">
              {{ benefit.text }}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import FactorIcons from "./FactorIcons.vue"

export default {
  components: {
    FactorIcons,
  },
  setup() {
    const benefits = ref([
      {
        icon: "dashboard3",
        title: "Your dashboard",
        text: "Wield a powerful post system and dashboard to simplify your backend design and add complete content-management.",
      },
      {
        icon: "themes",
        title: "Themes that work",
        text: "Factor is designed for theming. Save time and start with a solid foundation, then customize.",
      },
      {
        icon: "simple2",
        title: "Simple yet powerful",
        text: "Factor simplifies your life by helping you use standards and best-practices without having to think about them.",
      },
      {
        icon: "easy2",
        title: "Easy to use",
        text: "Nobody likes reading technical docs. Factor is built for people that like to save time, not debug.",
      },
      {
        icon: "optimized2",
        title: "Search optimized",
        text: "Build universal apps with VueJS. Get better SEO results with server-rendered apps.",
      },
      {
        icon: "open-source2",
        title: "Free and open-source",
        text: "Factor is built on open-source and uses the same license as projects like WordPress and Linux.",
      },
    ])

    return { benefits }
  },
}
</script>
