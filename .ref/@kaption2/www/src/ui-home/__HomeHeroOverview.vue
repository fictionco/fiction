<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import type { Component as VueComponent } from 'vue'
import FigureLoyalty from '../figures/FigureLoyalty.vue'
import SplashFigure from '../figures/SplashFigure.vue'

const items: {
  title: string
  description: string
  component: VueComponent
  featureId: string
  quotes?: { text: string, name: string, title: string, image: string }[]
}[] = [
  {
    title: 'Bring together all the important information',
    description: `Kaption will help you understand how to attain and retain the best customers by combining quantitive and qualitative data.`,
    component: FigureLoyalty,
    featureId: 'cx',
    quotes: [],
  },
  {
    title: 'Improve Reviews &amp; Referrals ',
    description: `Kaption will help you manage your CX. Improve reviews &amp; referrals and increase your ARPU with Kaption tools.`,
    featureId: 'reviews',
    component: SplashFigure,
    quotes: [
      // {
      //   text: `We signed up because we needed to generate reviews. When we saw what was possible by uniting our tools, we started using everything Kaption had to offer.`,
      //   name: "Johan Slate",
      //   title: "Founder, Ridge Accessories",
      //   image:
      //     "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
      // },
    ],
  },
]
</script>

<template>
  <div
    class="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50"
  >
    <div
      v-for="item in items"
      :key="item.title"
      class="relative z-10 border-b border-slate-200 py-32"
    >
      <div
        class="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8"
      >
        <div class="mx-auto max-w-lg px-4 sm:px-6 lg:mx-0 lg:py-20 lg:pl-16">
          <div>
            <div class="mt-6">
              <h2
                class="text-3xl font-extrabold tracking-tight text-theme-800 md:text-3xl"
                v-html="item.title"
              />
              <p
                class="mt-4 text-xl text-theme-600"
                v-html="item.description"
              />
              <div class="mt-6">
                <ElButton btn="slate">
                  Create An Account
                </ElButton>
              </div>
            </div>
          </div>
          <div
            v-if="item.quotes && item.quotes.length > 0"
            class="mt-8 border-t border-slate-200 pt-6"
          >
            <blockquote v-for="quote in item.quotes" :key="quote.text">
              <div>
                <p class="text-base font-semibold">
                  &ldquo;{{ quote.text }}&rdquo;
                </p>
              </div>
              <footer class="mt-3">
                <div class="flex items-center space-x-3">
                  <div class="shrink-0">
                    <img
                      class="h-6 w-6 rounded-full"
                      :src="quote.image"
                      alt=""
                    >
                  </div>
                  <div class="text-base font-medium text-theme-500">
                    <span class="text-primary-500 font-bold">{{
                      quote.name
                    }}</span>,
                    {{ quote.title }}
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
        <div class="mt-12 sm:mt-16 lg:mt-0">
          <div
            class="flex items-center pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0"
          >
            <component
              :is="item.component"
              :feature-id="item.featureId"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
