<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import GridBg from '../ui/EffectGridBg.vue'
import FigureSurvey from '../figures/FigureSurvey.vue'
</script>

<template>
  <div
    class="relative bg-gradient-to-br from-slate-900 via-black to-slate-900 py-24 text-white"
  >
    <section
      class="relative z-10 my-16 mx-auto max-w-6xl px-4 sm:px-6 md:py-20"
    >
      <div class="lg:grid lg:grid-cols-12 lg:gap-20">
        <div
          class="relative my-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center"
        >
          <FigureSurvey class="w-full" />
        </div>
        <div
          class="flex flex-col justify-center sm:text-center md:mx-auto lg:col-span-6 lg:text-left"
        >
          <div class="md:max-w-lg">
            <h1>
              <span
                class="from-primary-200 to-primary-300 mb-4 block bg-gradient-to-r box-decoration-clone bg-clip-text text-sm font-bold uppercase tracking-wide text-transparent sm:text-base lg:text-sm xl:text-base"
              >Get Feedback Focused</span>
              <span
                class="mt-1 block text-4xl font-extrabold tracking-tight sm:text-4xl xl:text-5xl"
              >
                <span class="block">A fresh take on</span>
                <span class="block">customer feedback</span>
              </span>
            </h1>
            <p
              class="mt-3 text-base text-white sm:mt-5 sm:text-xl lg:text-lg xl:text-2xl"
            >
              A new way to learn from customers, generate loyalty and word of
              mouth.
            </p>
            <div class="mt-6">
              <ElButton btn="whiteOutline">
                Get Started &rarr;
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </section>
    <GridBg />
  </div>
</template>
