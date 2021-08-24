<template>
  <div class="overflow-x-hidden bg-white">
    <div class="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
        <div
          class="
            text-area
            mx-auto
            max-w-md
            px-4
            sm:max-w-3xl sm:px-6
            lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24
          "
        >
          <div v-if="currentFeature.align == 'right'" />
          <div>
            <div>
              <div
                class="w-16 h-16"
                v-html="currentFeature?.icon"
                :class="currentFeature?.class"
              />
            </div>
            <div class="mt-6">
              <div class="mt-6 sm:max-w-xl">
                <h1
                  class="text-4xl font-extrabold tracking-tight sm:text-6xl"
                  v-html="currentFeature.name"
                />

                <div
                  class="mt-6 text-2xl text-bluegray-500"
                  v-html="currentFeature.description"
                />
              </div>
              <div class="my-10">
                <StartNow />
              </div>
            </div>
          </div>
        </div>

        <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div
            class="
              py-12
              sm:relative sm:mt-12 sm:py-16
              lg:absolute lg:w-1/2 lg:inset-y-0
            "
            :class="
              currentFeature.align == 'right'
                ? 'lg:left-0 lg:right-full'
                : 'lg:right-0'
            "
          >
            <div
              class="
                relative
                pl-4
                sm:mx-auto sm:max-w-3xl sm:px-0
                lg:max-w-none lg:h-full
              "
              :class="
                currentFeature.align == 'right'
                  ? 'lg:mr-12  lg:-ml-40'
                  : 'lg:pl-12  -mr-40'
              "
            >
              <img
                class="
                  w-full
                  rounded-lg
                  shadow-2xl
                  ring-1 ring-black ring-opacity-10
                  lg:h-full lg:w-auto lg:max-w-none
                "
                :src="currentFeature?.screenshot"
                :alt="`${currentFeature.name} Screen`"
                :class="
                  currentFeature.align == 'right'
                    ? 'lg:absolute lg:right-0'
                    : ''
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-for="(aspect, i) in currentFeature.aspects" :key="i">
      <ElemAspect v-if="aspect.align == 'wide'" :aspect="aspect" />
      <ElemFeature v-else :aspect="aspect" />
    </template>

    <ElemMoreFeatures />
  </div>
</template>

<script lang="ts">
import { useMeta, toLabel } from "@factor/api"
import { computed } from "vue"

import ElemMoreFeatures from "./ElemMoreFeatures.vue"

import { featuresList } from "../map"
import { useRouter } from "vue-router"
import ElemAspect from "../el/ElemAspect.vue"
import ElemFeature from "../el/ElemFeature.vue"

import StartNow from "../_global/StartNow.vue"
export default {
  components: {
    StartNow,
    ElemMoreFeatures,
    ElemAspect,
    ElemFeature,
  },

  setup() {
    const router = useRouter()
    const currentFeature = computed(() => {
      const route = router.currentRoute.value
      const featureId = route.params.featureId as keyof typeof featuresList

      return featuresList[featureId] ?? {}
    })

    const metaTitle = computed(() => {
      const r = router.currentRoute.value
      const featureName = (currentFeature.value.name || r.path) as string
      return `${toLabel(
        featureName,
      )} - Darwin Web Analytics for Professional Marketers`
    })

    const metaDescription = computed(() => {
      const featureDescription = currentFeature.value.description as string
      return featureDescription
    })

    const metaImage = computed(() => {
      const featureScreenshot = currentFeature.value.screenshot as string
      return featureScreenshot
    })

    useMeta({
      title: metaTitle,
      meta: [
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: "og:title",
          content: metaTitle,
        },
        {
          name: "og:description",
          content: metaDescription,
        },
        {
          property: "og:image",
          content: metaImage,
        },
        {
          name: "twitter:title",
          content: metaTitle,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
        {
          name: "twitter:image",
          content: metaImage,
        },
      ],
    })

    return {
      featuresList,
      currentFeature,
    }
  },
}
</script>
