<template>
  <div>
    <div class="px-4 sm:px-6 xl:px-8 pt-10 pb-16">
      <div class="my-6">
        <h1 class="text-3xl font-bold mb-4">Documentation</h1>
        <p class="text-xl text-slate-500">
          Explore everything you can do with Darwin.
        </p>
      </div>
      <WelcomeBanner class="max-w-7xl mx-auto my-8" />
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
        <div v-for="(group, groupId) in groupList" :key="groupId" class="flex">
          <router-link
            class="w-full relative overflow-hidden rounded-xl flex border border-slate-300 hover:border-slate-400 hover:shadow-sm col-span-1"
            :to="group.path || '/'"
          >
            <div class="w-full flex md:flex-col">
              <div
                class="sm:max-w-lg sm:flex-none md:w-auto md:flex-auto flex items-start relative z-10 p-6 xl:p-8"
              >
                <div class="mr-8">
                  <div class="w-12 h-12 text-primary-500" v-html="group.icon" />
                </div>
                <div class="">
                  <h2 class="text-2xl font-semibold mb-2">
                    {{ group.title }}
                  </h2>
                  <p class="text-slate-500 text-xl">
                    {{ group.description }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="absolute bottom-0 left-0 right-0 h-20 hidden sm:block"
            />
          </router-link>
        </div>
      </section>

      <section>
        <div class="mt-16 mb-8">
          <h2 class="text-2xl font-bold">Groups and Discussion</h2>
          <p class="text-slate-500 text-lg mt-2">
            Let's have a conversation...
          </p>
        </div>
        <ul class="grid sm:grid-cols-2 gap-6 xl:gap-12">
          <li v-for="(social, i) in socials" :key="i">
            <a
              :href="social.path"
              target="_blank"
              class="cursor-pointer flex items-center space-x-6 hover:opacity-70"
              ><div
                class="flex justify-center items-center rounded-full w-12 h-12 border-2 border-primary-500 text-primary-500"
              >
                <div class="w-4 h-4" v-html="social.icon" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-xl">{{ social.title }}</h3>
                <p class="text-slate-500">{{ social.description }}</p>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import { computed } from "vue"
import { groups } from "../map"
import WelcomeBanner from "./WelcomeBanner.vue"
export default {
  components: { WelcomeBanner },
  setup() {
    const metaTitle = "Darwin Analytics Documentation and Guides"

    const metaDescription =
      "Get started quickly and explore everything you can do with Darwin Analytics."

    useMeta({
      title: metaTitle,
      meta: [
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: metaTitle,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          name: "twitter:title",
          content: metaTitle,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
      ],
    })

    const socials = [
      {
        title: "Slack",
        description: "Join the Slack chat to hit us up directly",
        path: "https://join.slack.com/t/factorjs/shared_invite/zt-biopdz00-pnEJOPDPcm8DSTGLccH_Og",
        icon: `<svg enable-background="new 0 0 2447.6 2452.5" viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill-rule="evenodd"><path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="currentColor"/><path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="currentColor"/><path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="currentColor"/><path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="currentColor"/></g></svg>`,
      },
      {
        title: "LinkedIn",
        description: "Connect with us on LinkedIn",
        path: "https://www.linkedin.com/company/therealdarwin/",
        icon: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.88298 27.823V9.52399H0.226978V27.824H5.88298V27.823ZM5.88298 3.03799C5.84898 1.40099 4.75798 0.153992 2.98498 0.153992C1.21198 0.153992 0.0529785 1.40099 0.0529785 3.03799C0.0529785 4.63999 1.17798 5.92299 2.91698 5.92299H2.95098C4.75798 5.92299 5.88298 4.63999 5.88298 3.03799V3.03799ZM15.11 27.823V17.397C15.11 16.839 15.15 16.281 15.314 15.884C15.763 14.768 16.784 13.614 18.498 13.614C20.744 13.614 22.152 14.888 22.152 17.397V27.823H27.846V17.118C27.846 11.384 24.785 8.71599 20.702 8.71599C17.354 8.71599 15.885 10.587 15.069 11.861L15.109 9.41399H9.42498C9.50698 11.166 9.42498 27.824 9.42498 27.824H15.11V27.823Z"   fill="currentColor" />
        </svg>`,
      },
      {
        title: "Facebook",
        description: "Updates on Facebook",
        path: "https://www.facebook.com/factorjs",
        icon: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24">
        <path d="M7.5 8.25v-3A1.5 1.5 0 019 3.75h1.5V0h-3A4.5 4.5 0 003 4.5v3.75H0V12h3v12h4.5V12h3L12 8.25z" fill="currentColor" />
        </svg>`,
      },
    ]

    const groupsToShow: string[] = ["basics", "server", "deployment"]

    const groupList = computed(() => {
      return groupsToShow.map((g) => {
        return groups[g] || {}
      })
    })

    return { socials, groupList }
  },
}
</script>
