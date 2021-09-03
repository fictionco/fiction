<template>
  <div class="view-home overflow-hidden">
    <div class="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-36">
        <div
          class="
            mx-auto
            max-w-md
            px-4
            sm:max-w-3xl sm:px-6
            lg:px-12 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-16
          "
        >
          <div>
            <div class="">
              <div>
                <a href="#" class="inline-flex space-x-4">
                  <span
                    class="
                      rounded
                      bg-primary-50
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-primary-600
                      tracking-wide
                      uppercase
                    "
                  >
                    What's new
                  </span>
                  <span
                    class="
                      inline-flex
                      items-center
                      text-sm
                      font-medium
                      text-primary-600
                      space-x-1
                    "
                  >
                    <span>Version 3 is now publicly available</span>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </a>
              </div>
              <div class="mt-6 sm:max-w-xl">
                <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  The future of web development has arrived.
                </h1>
                <p class="mt-6 text-xl text-color-500">
                  Introducing Factor, a free next-generation TypeScript
                  framework you can use to create blogs, landing pages, and
                  JAMStack apps.
                </p>
              </div>
              <div class="mt-12 sm:max-w-lg w-full flex space-x-6 items-center">
                <ElemButton btn="primary" to="/docs">
                  Start Site or App &rarr;
                </ElemButton>

                <ElemButton
                  href="https://www.github.com/FactorJS/factor"
                  target="_blank"
                  btn="default"
                >
                  <svg
                    class="h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ version }}</span>
                </ElemButton>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:mx-auto sm:max-w-3xl">
          <div
            class="
              py-6
              sm:relative
              lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2
            "
          >
            <FigureSplash class="absolute z-10 mb-16 lg:mt-12 lg:mb-0" />
          </div>
        </div>
      </div>
    </div>

    <ElemBenefits />

    <ElemCta />

    <ElemFeatures />

    <ElemPlugins class="py-24" />
  </div>
</template>

<script lang="ts">
import { computed } from "vue"
import { factorVersion } from "@factor/api/about"
import ElemButton from "@factor/ui/ElemButton.vue"
import FigureSplash from "./FigureSplash.vue"
import ElemPlugins from "./ElemPlugins.vue"
import ElemCta from "./ElemCta.vue"
import ElemBenefits from "./ElemBenefits.vue"
import ElemFeatures from "./ElemFeatures.vue"

export default {
  components: {
    FigureSplash,
    ElemButton,
    ElemBenefits,
    ElemFeatures,
    ElemPlugins,
    ElemCta,
  },
  setup() {
    /**
     * Current Factor Version
     */
    const version = computed(() => {
      return `v${factorVersion()}`
    })

    return { version }
  },
}
</script>
