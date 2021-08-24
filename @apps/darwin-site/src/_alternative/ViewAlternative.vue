<template>
  <div>
    <section class="pt-12 lg:pt-28 mx-auto max-w-7xl px-4 md:px-20 lg:px-12">
      <div
        class="
          block
          uppercase
          text-primary-500
          font-medium
          text-base text-center
          tracking-wide
        "
      >
        Web Analytics
      </div>
      <h1
        class="
          mb-4
          text-2xl
          font-extrabold
          md:mb-10
          sm:text-4xl sm:max-w-2xl
          lg:text-7xl lg:max-w-3xl
          xl:max-w-4xl
          mx-auto
          text-center
        "
      >
        Free Google Analytics Alternative
      </h1>
      <div class="mb-12 py-8 text-xl max-w-prose mx-auto">
        <p class="py-4 leading-8 text-bluegray-500">
          Every online marketer knows that analytics are crucial to
          understanding why your visitors behave the way they do. If you don’t
          closely monitor how users interact with your website, you won’t know
          how you can improve it
        </p>
        <p class="py-4 leading-8 text-bluegray-500">
          In the field of web analytics, Google Analytics is being used by more
          than 50% of all websites. It’s free, broad, and very popular. But
          Google Analytics can also be hard to use and somewhat invasive.
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
//import { ref, computed } from "vue"
//import ElemButton from "../el/ElemButton.vue"
import { featuresList } from "../map"

export default {
  //   components: {
  //     ElemButton,
  //   },
  setup() {
    const metaDescription =
      "Usage based pricing helps you start small and scale big. Get access to real-time data, smart dashboards, AB analytics, session replay, live heatmaps, and more. Get started in less than 60 seconds."

    useMeta({
      meta: [
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
      ],
    })

    return {
      featuresList,
    }
  },
}
</script>
