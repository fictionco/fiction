<template>
  <div class="view-home overflow-x-hidden">
    <div class="bg-white pb-8 sm:pb-12 lg:pb-12">
      <FromPageLines v-if="fromPageLines" />
      <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-40">
        <div
          class="
            mx-auto
            max-w-md
            px-4
            sm:max-w-3xl sm:px-6
            lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24
          "
        >
          <div class="sm:max-w-xl mx-auto">
            <div class="mt-6 mb-12">
              <ElemLogo mode="icon" class="scheme-standard h-12 md:h-16" />
            </div>
            <div>
              <h1
                class="
                  text-4xl
                  md:text-6xl
                  font-extrabold
                  tracking-tight
                  lg:text-5xl
                  2xl:text-6xl
                "
              >
                Improve Your Website Experience
              </h1>

              <div class="mt-6 text-bluegray-500 text-xl md:text-2xl">
                Darwin is the analytics platform that helps you create better
                customer experiences. Easily track and optimize behavior on your
                website or app.
              </div>
            </div>
            <div class="my-10">
              <StartNow />
            </div>
          </div>
        </div>

        <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div
            class="
              py-12
              sm:relative sm:mt-12 sm:py-16
              lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2
            "
          >
            <div
              class="
                relative
                pl-4
                -mr-40
                sm:mx-auto sm:max-w-3xl sm:px-0
                lg:max-w-none lg:h-full lg:pl-12
              "
            >
              <img
                class="
                  w-full
                  rounded-md
                  shadow-xl
                  ring-1 ring-black ring-opacity-5
                  lg:h-full lg:w-auto lg:max-w-none
                  text-xs
                "
                :src="screenDashboard"
                alt="Darwin Dashboard"
              />
            </div>
            <!-- <span class="block mt-7 text-center text-sm text-bluegray-400">
              Want to see for yourself? Watch the
              <a href="https://demo.darwin.so" class="text-bluegray-700"
                >demo video</a
              >.
            </span> -->
          </div>
        </div>
      </div>
    </div>

    <ElemIntegrations
      class="mx-auto max-w-6xl pb-20 px-4 md:pb-36 md:px-20 lg:px-12"
      title="Integrate Darwin with your favorite services and applications."
    />

    <ElemFeaturesList
      title="Free tools to grow your traffic and turn visitors into customers."
      content="Get the insights you need to optimize your digital experience and move business forward. Eliminate guess work, know why it happens, and iterate a lot faster."
      :list="['dashboards', 'realtime', 'ab']"
      class="
        mx-auto
        max-w-sm
        md:max-w-xl
        lg:max-w-7xl
        px-4
        py-12
        lg:px-10 lg:py-36
      "
    />

    <ElemFeaturesList
      title="Want more conversions? Try visualizing intent and friction"
      content="Often the best way to persuade is to first see things through your customers eyes.  Do you know how they are using your website? With Darwin you can visualize your user's journey and any bumps along the way."
      :list="['replay', 'heatmaps', 'behavior']"
      class="
        mx-auto
        max-w-sm
        md:max-w-xl
        lg:max-w-7xl
        px-4
        py-12
        lg:px-10 lg:py-36
      "
    />

    <ElemPrivacy />

    <ElemFeaturesList
      title="Make confident, data-driven decisions."
      content="Excellence comes from good information. Without data you are either lucky, or wrong.  Focus your efforts with conversion and monitoring tools."
      :list="['bots', 'conversion', 'performance']"
      class="
        mx-auto
        max-w-sm
        md:max-w-xl
        lg:max-w-7xl
        px-4
        py-12
        lg:px-10 lg:py-36
      "
    />

    <ElemIntegrationsGrid
      title="Integrates with the tools you already use."
      content="Darwin works out of the box on most popular platforms and it's simple to setup. Use integrations to get even more insights."
      :list="[
        'hubspot',
        'wordpress',
        'instapage',
        'squarespace',
        'weebly',
        'joomla',
        'bigcartel',
        'volusion',
        'wix',
        'blogger',
        'drupal',
        'pinegrow',
        'bigcommerce',
        'clickfunnels',
        'unbounce',
        'sitebuilder',
        'opencart',
        'jimdo',
        'zyro',
        'webflow',
        'magento',
        'godaddy',
        'elementor',
        'duda',
        'segment',
        'shopify',
        'googletagmanager',
        'woocommerce',
      ]"
    />

    <ElemCta />
    <BlogList />
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import FromPageLines from "./FromPageLines.vue"
import ElemIntegrations from "./ElemIntegrations.vue"
import ElemFeaturesList from "./ElemFeaturesList.vue"
import ElemPrivacy from "./ElemPrivacy.vue"
import ElemIntegrationsGrid from "./ElemIntegrationsGrid.vue"
import ElemCta from "./ElemCta.vue"
import StartNow from "../_global/StartNow.vue"
import BlogList from "./BlogList.vue"
//Images
import ElemLogo from "../_global/DarwinLogo.vue"
import screenDashboard from "./screenDashboard.webp"
import { getDashboardUrl } from "../util"
import { useRouter } from "vue-router"
import { computed } from "vue"
export default {
  components: {
    ElemIntegrations,
    ElemFeaturesList,
    ElemIntegrationsGrid,
    ElemCta,
    ElemPrivacy,
    ElemLogo,
    StartNow,
    FromPageLines,
    BlogList,
  },
  setup() {
    const router = useRouter()

    const fromPageLines = computed(() => {
      const pl = router.currentRoute.value.query.pl

      return typeof pl !== "undefined" ? true : false
    })
    const metaTitle = "Website Analytics for UX Developers"

    const metaDescription =
      "Darwin Analytics is a free website analytics platform and API that helps you visualize your data and traffic."

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

    return {
      getDashboardUrl,
      screenDashboard,
      fromPageLines,
    }
  },
}
</script>
