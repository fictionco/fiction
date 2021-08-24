<template>
  <div>
    <section class="pt-12 lg:pt-28 mx-auto max-w-7xl px-4 md:px-20 lg:px-12">
      <h1
        class="
          mb-4
          text-2xl
          font-extrabold
          md:mb-10
          sm:text-4xl sm:max-w-2xl
          lg:text-7xl lg:max-w-3xl
          xl:max-w-4xl
        "
      >
        Built for Perfectionists
      </h1>
      <p class="mb-12 text-2xl text-bluegray-500 sm:max-w-lg lg:mb-20">
        Darwin's Pro package includes all kinds of tools for professional
        marketers and money makers
      </p>
    </section>

    <section class="mx-auto max-w-7xl py-16 sm:py-24 px-4 md:px-20 lg:px-12">
      <h1 class="text-3xl font-extrabold sm:text-3xl">Features</h1>
      <p class="text-lg text-bluegray-500 mb-4">
        Get insights to dig down into what's powering your growth the most.
      </p>
      <div class="mt-12 lg:mt-20">
        <dl
          class="
            grid grid-cols-2
            gap-8
            md:gap-x-8 md:gap-y-16 md:grid-cols-4
            lg:gap-x-28
          "
        >
          <router-link
            :to="item.path ?? '/'"
            v-for="(item, i) in featuresList"
            :key="i"
            class="space-y-2"
          >
            <div class="w-6 h-6" v-html="item?.icon" :class="item?.class" />
            <dt class="text-base font-medium mb-2.5">
              {{ item.name }}
            </dt>
            <dd class="text-sm text-bluegray-500" v-html="item.description" />
          </router-link>
        </dl>
      </div>
    </section>

    <section class="mx-auto max-w-7xl my-32 px-4 md:px-20 lg:px-12">
      <h1
        class="
          mb-8
          text-2xl
          font-extrabold
          md:mb-16
          sm:text-4xl sm:max-w-2xl
          lg:text-7xl lg:max-w-3xl
          xl:max-w-4xl
        "
      >
        Pricing
      </h1>
      <div class="flex flex-col justify-between max-w-5xl lg:flex-row">
        <div class="flex flex-col items-start mb-4 lg:w-96">
          <h3
            class="
              flex
              items-center
              mb-4
              text-xl
              font-medium
              text-bluegray-500
              sm:max-w-lg
            "
          >
            What are your monthly user sessions?
            <div class="relative group ml-1">
              <svg
                class="
                  hidden
                  h-6
                  w-6
                  text-xlight-500
                  cursor-pointer
                  hover:text-bluegray-500
                  sm:block
                "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <div
                class="
                  hidden
                  sm:block
                  absolute
                  z-10
                  m-auto
                  h-fit-content
                  rounded
                  overflow-hidden
                  bg-white
                  transition-all
                  left-full
                  top-0
                  bottom-0
                  w-56
                  ml-1
                  px-3
                  py-2
                  shadow-md
                  border border-light-100
                  opacity-0
                  group-hover:opacity-100
                "
              >
                <h5 class="text-base mb-1">What are monthly user sessions?</h5>
                <p class="text-sm font-normal text-bluegray-500">
                  Monthly user sessions are calculated as the number of unique
                  users with at least one interaction with your site/app in the
                  last month.
                </p>
              </div>
            </div>
          </h3>
          <h1 class="my-4 text-3xl font-extrabold leading-none">
            {{ monthlySessions[volumeTier].sessions }} Sessions
          </h1>
          <input
            v-model="volumeTier"
            type="range"
            name="volume"
            min="0"
            :max="monthlySessions.length - 1"
            class="w-full h-2 mt-4 mb-8 outline-none bg-purple-100"
          />
          <img
            :src="bothWaysArrow"
            alt="both ways arrow"
            class="self-center mb-2.5"
          />
          <div class="text-sm text-xlight-500 self-center">
            Adjust your monthly user sessions
          </div>
        </div>
        <div class="flex flex-col items-start lg:w-96">
          <div class="lg:max-w-sm">
            <h3
              class="
                mb-4
                text-xl
                font-medium
                text-bluegray-500
                sm:max-w-lg
                lg:mb-12
              "
            >
              Your price
            </h3>
            <h1 class="mb-6">
              <div
                v-if="volumeTier < monthlySessions.length - 1"
                class="inline font-extrabold text-3xl lg:text-5xl"
                v-html="monthlySessions[volumeTier].price"
              />
              <div v-else class="inline font-extrabold text-5xl">Custom</div>
              <div
                class="inline text-2xl"
                v-if="volumeTier < monthlySessions.length - 1"
              >
                /month
              </div>
              <a v-else href="mailto:hello@darwin.so" class="inline text-2xl"
                >(Contact us)</a
              >
            </h1>
            <a class="block mb-7" href="https://app.darwin.so/register">
              <ElemButton btn="primary" class=""
                >Start a Free 14 Day Trial</ElemButton
              ></a
            >
            <p class="text-bluegray-500">
              <span v-if="volumeTier < monthlySessions.length - 1"
                >Need a bigger plan?</span
              >
              We've got you covered. We'll personally help you get onboarded,
              too.
              <a href="/contact" class="text-primary-500 hover:underline"
                >Contact us</a
              >
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import { ref, computed } from "vue"
import ElemButton from "../el/ElemButton.vue"
import bothWaysArrow from "../img/both-ways-arrow.svg"
import { featuresList } from "../map"

export default {
  components: {
    ElemButton,
  },
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

    const volumeTier = ref(0)

    const monthlySessions = computed(() => {
      const base = [
        {
          sessions: 10_000,
        },
        {
          sessions: 20_000,
        },
        {
          sessions: 50_000,
        },
        {
          sessions: 100_000,
        },
        {
          sessions: 250_000,
        },
        {
          sessions: 500_000,
        },
        {
          sessions: 1_000_000,
        },
        {
          sessions: 2_000_000,
          price: `<a class="text-2xl font-medium hover:text-primary-500" href="/contact">Contact us</a>`,
        },
      ]

      return base.map((_, i) => {
        const price = _.price
          ? _.price
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(79 + (_.sessions - 10_000) * 0.002)

        let sessions = Intl.NumberFormat("en-US").format(+_.sessions)

        if (i >= base.length - 1) {
          sessions = `${sessions}+`
        }
        return {
          sessions,
          price,
        }
      })
    })

    return {
      bothWaysArrow,
      volumeTier,
      monthlySessions,
      featuresList,
    }
  },
}
</script>
<style lang="less">
input[type="range"] {
  @apply rounded-sm;
  -moz-appearance: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    -webkit-appearance: none;
    border: 8px solid #8660fe;
  }
  &::-moz-range-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-ms-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-moz-focus-outer {
    border: 0;
  }
}
</style>
