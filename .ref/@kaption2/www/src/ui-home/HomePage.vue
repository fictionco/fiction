<script lang="ts" setup>
import { useMeta } from '@factor/api'
import EffectGrid from '@factor/ui/EffectGrid.vue'
import { setPageMode } from '../util'
import SplashFigure from '../figures/SplashFigure.vue'
import CtaMain from '../ui/CtaMain.vue'
import HomeElBenefits from './HomeElBenefits.vue'
import ElIntegrationsGrid from './HomeElIntegrationsGrid.vue'
import HomeHeroSub from './HomeHeroSub.vue'

const metaTitle = 'Kaption.co - Optimize Your Website with AI'

const metaDescription
  = 'Kaption is a business intelligence platform that includes analytics, forms, surveys, dashboarding, and more.'

setPageMode('darkHeader')

useMeta({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})
</script>

<template>
  <div class="view-home overflow-x-hidden">
    <div
      class="relative border-b border-slate-300 bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-32 text-white"
    >
      <div class="py-8 pt-16 lg:relative lg:py-20">
        <div class="relative z-10 mx-auto max-w-4xl px-6 sm:text-center">
          <div class="mx-auto">
            <div>
              <div
                class="text-secondary-500 mb-4 text-xl uppercase tracking-wider"
              >
                AI-First Analytics
              </div>
              <h1 class="text-7xl font-extrabold tracking-tight">
                Automatically Optimize and Improve Your Website
              </h1>

              <div class="text-theme-300 mx-auto my-12 max-w-2xl text-3xl">
                Kaption is an AI-powered analytics platform that finds problems,
                tests solutions, and optimizes your website... automatically.
              </div>
            </div>
            <CtaMain class="my-10" />
          </div>
        </div>

        <div class="relative z-10 -mb-48 pt-8 sm:px-6">
          <div class="flex space-x-4 sm:relative sm:mt-12">
            <div class="relative px-3 sm:mx-auto sm:max-w-4xl sm:px-0">
              <SplashFigure feature-id="home" />
            </div>
          </div>
        </div>
        <EffectGrid />
      </div>
    </div>
    <div class="">
      <HomeHeroSub />
      <HomeElBenefits class="py-12" />
      <ElIntegrationsGrid class="py-32" />
    </div>
  </div>
</template>
