<template>
  <section class="w-full">
    <div v-for="(feature, i) in features" :key="i" class="py-16 lg:py-0">
      <div
        class="min-h-4/5 grid items-center gap-12 lg:grid-cols-2"
        :class="[i % 2 == 0 ? 'even' : 'odd lg:grid-flow-row-dense']"
      >
        <div
          class="min-w-0"
          :class="[
            i % 2 == 0
              ? 'lg:col-start-1 lg:justify-self-end'
              : 'lg:col-start-2',
          ]"
        >
          <div class="max-w-full px-6 pt-12 pb-4 lg:max-w-xl lg:py-40">
            <div
              v-if="feature.icon"
              class="mb-6 flex h-20 w-20 items-center justify-center rounded-lg border border-slate-100 bg-primary-500 shadow-md"
            >
              <div class="h-10 w-10 text-white" v-html="feature.icon"></div>
            </div>

            <h2 class="mb-6 text-2xl font-bold">
              {{ feature.title }}
            </h2>
            <div class="mb-4 text-xl text-slate-500">
              {{ feature.text }}
            </div>
            <div v-if="feature.link" class="text-xl font-medium">
              <router-link
                :to="feature.link.path"
                class="text-primary-500 hover:text-primary-400"
              >
                {{ feature.link.text }} &rarr;
              </router-link>
            </div>
          </div>
        </div>
        <div
          class="relative flex h-full min-w-0 items-center justify-center"
          :class="[
            i % 2 == 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:justify-end',
          ]"
        >
          <component :is="feature.figure" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import FigureDashboard from "./FigureDashboard.vue"
import FigureLiveChanges from "./FigureLiveChanges.vue"
import FigurePlugins from "./FigurePlugins.vue"
import FigurePoweredBy from "./FigurePoweredBy.vue"
import FigureThemes from "./FigureThemes.vue"

const features = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>`,
    title: `Modular TypeScript`,
    text: `Build 100% JS/TS apps with best-of-class open source software.
            No more backend and frontend, Factor has a single environment you can use to build full-stack apps.`,
    figure: FigurePoweredBy,
    link: { path: "/docs", text: "View Docs" },
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
</svg>`,
    title: "Next Generation Tooling",
    text: `Factor helps you bring together all the different tools you'll need to build great apps.
              Add advanced features easily and quickly optimize things for SEO,
             marketing, and performance.`,
    figure: FigureLiveChanges,
    link: { path: "/install", text: "Install Factor" },
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
</svg>`,
    title: "Full-Stack or Static",
    text: `Prerender your Factor apps and use on static hosting. Use the endpoint framework for a JamStack approach.`,
    figure: FigureDashboard,
    link: { path: "/docs", text: "Learn More" },
  },
  {
    title: `Advanced Plugins`,
    text: `Most coding frameworks make you do way too much custom coding. Their plugins can take days to learn, install, and customize.
          Factor focuses on making plugins dead simple. This means they "just work," but can be easily customized.`,
    figure: FigurePlugins,
    link: { path: "/plugins", text: "View Plugins" },
  },
  {
    title: "Setup great sites quickly.",
    text: `Leverage the app showcase for your boilerplate or build from scratch
              Factor gives you a complete theming and rapid app development system to quickly deploy apps.`,
    figure: FigureThemes,
    link: { path: "/showcase", text: "View Showcase" },
  },
]
</script>
