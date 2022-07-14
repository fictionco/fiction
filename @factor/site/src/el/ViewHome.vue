<template>
  <div class="view-home overflow-hidden">
    <div class="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div class="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-36">
        <div
          class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-2 lg:gap-16 lg:px-12"
        >
          <div>
            <div class="">
              <div>
                <router-link
                  to="/blog/factorjs-version-3-released"
                  class="group inline-flex space-x-4"
                >
                  <span
                    class="rounded bg-primary-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600 group-hover:text-primary-400"
                  >
                    Currently Under Development
                  </span>
                </router-link>
              </div>
              <div class="mt-6 sm:max-w-sm">
                <h1 class="text-2xl font-extrabold tracking-tight">
                  A Modular and Expressive Framework for TypeScript Apps
                </h1>
                <p class="mt-6 text-base text-slate-700">
                  Quickly build modern websites with the latest JavaScript
                  technology.
                </p>
              </div>
              <div class="mt-12 flex w-full items-center space-x-6 sm:max-w-lg">
                <ElButton btn="primary" to="/docs">
                  Getting Started &rarr;
                </ElButton>

                <ElButton
                  href="https://www.github.com/FactorJS/factor"
                  target="_blank"
                  btn="default"
                >
                  <svg
                    class="mr-2 h-6"
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
                </ElButton>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:mx-auto sm:max-w-3xl">
          <div
            class="py-6 sm:relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
          >
            <FigureSplash class="absolute z-10 mb-16 lg:mt-12 lg:mb-0" />
          </div>
        </div>
      </div>
    </div>

    <ElBenefits />

    <ElCta />

    <ElFeatures />

    <ElPlugins class="py-24" />

    <BlogList />
  </div>
</template>

<script lang="ts" setup>
import ElButton from "@factor/ui/ElButton.vue"
import { version } from "../../package.json"
import FigureSplash from "./FigureSplash.vue"
import ElPlugins from "./ElPlugins.vue"
import ElCta from "./ElCta.vue"
import ElBenefits from "./ElBenefits.vue"
import ElFeatures from "./ElFeatures.vue"
import BlogList from "./BlogList.vue"
</script>
