<template>
  <div class="overflow-hidden">
    <div class="relative bg-light-50">
      <div class="bg-pattern-bottom-top-light bg-repeat-x">
        <div
          class="
            max-w-4xl
            mx-auto
            py-16
            px-4
            sm:py-32 sm:px-6
            lg:px-8 lg:max-w-6xl
          "
        >
          <div
            class="
              px-0
              sm:px-4
              lg:px-0 lg:flex lg:justify-between lg:items-center
            "
          >
            <div class="max-w-7xl mx-auto text-center md:px-40">
              <h2 class="text-4xl font-extrabold sm:text-7xl">
                Darwin guides to grow your business.
              </h2>
              <p class="mt-5 text-xl text-bluegray-500">
                Learn about user behavior, user experience, increase user
                conversion, and other knowledge from the team at Darwin about
                growing your business right.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- guides -->
    <div class="py-12 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl class="grid lg:grid-cols-12 lg:gap-12">
          <router-link
            v-for="guide in GuidesList"
            :key="guide.title"
            :to="guide.path"
            class="
              flex flex-col
              bg-white
              rounded-lg
              overflow-hidden
              p-6
              border border-light-100
              group
              lg:p-7
            "
            :class="guide.class"
          >
            <dt
              class="
                text-3xl
                mb-4
                leading-tight
                font-extrabold
                group-hover:text-primary-500
              "
            >
              {{ guide.title }}
            </dt>
            <dd class="flex-grow text-xl pb-auto mb-auto text-bluegray-500">
              {{ guide.content }}
            </dd>
            <p
              class="
                inline-flex
                items-center
                mt-8
                uppercase
                tracking-wider
                text-sm text-primary-500
              "
            >
              {{ guide.name }} <ElemHoverArrow />
            </p>
          </router-link>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { toLabel, useMeta } from "@factor/api"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

import ElemHoverArrow from "../_global/ElemHoverArrow.vue"

export default {
  components: {
    ElemHoverArrow,
  },
  setup() {
    const router = useRouter()

    const GuidesList = ref([
      {
        class: "col-span-8",
        title: "The complete guide to heatmaps",
        content:
          "A complete guide to website heatmaps with chapters about creating and analyzing heatmaps, case studies, practical examples, and heatmap FAQs.",
        path: "/guides/heatmaps",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "How to create a great user experience",
        content:
          "What user experience (UX) is, why it's important for your business, and how you can improve it for your customers.",
        path: "/guides/user-experience",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "Session replay: a beginner's guide",
        content:
          "Everything about session replays: what they are, how they help improve your website, and how to use them to get actionable insight.",
        path: "/guides/session-replays",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "Usability testing guide",
        content:
          "A multi-chapter look at website usability testing, its benefits and methods, and how to get started with it.",
        path: "/guides/usability-testing",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "User-centric CRO guide",
        content:
          "A user-centric guide to Conversion Rate Optimization (CRO): what it is, what it isn't, and how to do it right.",
        path: "/guides/conversion-rate-optimization",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "User journey guide",
        content:
          "How to go from zero to your first user journey map in a few days, with step-by-step instructions and pro tips.",
        path: "/guides/user-journey",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "Website analysis: your go-to optimization resource",
        content:
          "An introduction to testing and analyzing your website's performance in relation to SEO, speed, competition, and traffic.",
        path: "/guides/website-analysis",
        name: "Continue Reading",
      },
      {
        class: "col-span-4",
        title: "Website redesign: the guide to read before you start",
        content:
          "A 3-chapter guide with step-by-step processes and frameworks to help you redesign a website with your customers in mind.",
        path: "/guides/website-redesign",
        name: "Continue Reading",
      },
    ])

    useMeta({
      title: computed(() => {
        const r = router.currentRoute.value
        const pathName = (r.name || r.path) as string
        return `${toLabel(pathName)} - Get more out of Darwin`
      }),
      meta: [
        {
          name: `description`,
          content:
            "Guides and articles to better understand user behavior, make the right changes, improve UX, and increase conversions on your website using Darwin.",
        },
      ],
    })

    return { GuidesList, useMeta }
  },
}
</script>
