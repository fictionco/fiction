<script lang="ts" setup>
import { formatNumber, useMeta, vue } from '@factor/api'
import PageWrap from '../SiteWrap.vue'
import { about } from '../../content'

const _team = vue.ref([
  {
    email: 'andrew@fiction.com',
    name: 'Andrew Powers',
    title: 'Founder &amp; CEO',
    content: `Andrew is a serial entrepreneur and developer. He's passionate about helping people and a father of two.`,
    social: [
      {
        name: 'Website',
        link: 'https://www.andrewpowers.com',
      },
      {
        name: 'Twitter',
        link: 'https://www.twitter.com/arpowers',
      },
      {
        name: 'Insta',
        link: 'https://www.instagram.com/arpowers',
      },
    ],
  },
])

const metaTitle = 'About PageLines - Smart Websites with AI'

const metaDescription
  = 'PageLines is a company creating AI tools for designers and creatives.'

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
  <PageWrap class="">
    <main class="isolate">
      <!-- Hero section -->
      <div class="relative isolate -z-10">
        <svg
          class="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y="-1"
            class="overflow-visible fill-gray-50"
          >
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              stroke-width="0"
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            stroke-width="0"
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg>
        <div
          class="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        >
          <div
            class="from-theme-50 to-theme-100 aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr opacity-30"
            style="
              clip-path: polygon(
                63.1% 29.5%,
                100% 17.1%,
                76.6% 3%,
                48.4% 0%,
                44.6% 4.7%,
                54.5% 25.3%,
                59.8% 49%,
                55.2% 57.8%,
                44.4% 57.2%,
                27.8% 47.9%,
                35.1% 81.5%,
                0% 97.7%,
                39.2% 100%,
                35.2% 81.4%,
                97.2% 52.8%,
                63.1% 29.5%
              );
            "
          />
        </div>
        <div class="overflow-hidden">
          <div
            class="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32"
          >
            <div
              class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center"
            >
              <div class="font-brand w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 class="text-4xl font-bold tracking-tight sm:text-8xl">
                  About <span class="under">PageLines</span>
                </h1>
                <p class="relative mt-6 text-4xl sm:max-w-md lg:max-w-none">
                  {{ about().subHeadline.desc }}
                </p>
              </div>
              <div
                class="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0"
              >
                <div
                  class="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-12"
                >
                  <div class="relative">
                    <img
                      src="https://images.unsplash.com/photo-1503891450247-ee5f8ec46dc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h=528&q=80"
                      alt=""
                      class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    >
                    <div
                      class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"
                    />
                  </div>
                </div>
                <div
                  class="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36"
                >
                  <div class="relative">
                    <img
                      src="https://images.unsplash.com/photo-1668554245790-bfdc72f0bb3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h=528&q=80"
                      alt=""
                      class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    >
                    <div
                      class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"
                    />
                  </div>
                  <div class="relative">
                    <img
                      src="https://images.unsplash.com/photo-1602086010043-4db598ce5d16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                      alt=""
                      class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    >
                    <div
                      class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"
                    />
                  </div>
                </div>
                <div class="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div class="relative">
                    <img
                      src="https://images.unsplash.com/photo-1616769364512-1e50e8266907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                      alt=""
                      class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    >
                    <div
                      class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"
                    />
                  </div>
                  <div class="relative">
                    <img
                      src="https://images.unsplash.com/photo-1557720434-f599129f07a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h=528&q=80"
                      alt=""
                      class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    >
                    <div
                      class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content section -->
      <div
        class="font-brand mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8"
      >
        <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            PageLines Mission
          </h2>
          <div class="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div class="space-y-6 lg:w-full lg:max-w-2xl lg:flex-auto">
              <p
                v-for="(d, i) in about().missionStatement"
                :key="i"
                class="text-3xl"
              >
                {{ d }}
              </p>
            </div>
            <div
              class="max-w-md flex-wrap lg:flex lg:flex-auto lg:justify-center"
            >
              <dl class="w-64 space-y-8 xl:w-80">
                <div
                  v-for="(v, i) in about().metrics"
                  :key="i"
                  class="flex flex-col gap-y-2"
                >
                  <dd class="font-brand text-6xl font-bold">
                    {{ formatNumber(v.value) }}
                  </dd>
                  <dt
                    class="text-theme-500 font-sans text-xs font-bold uppercase tracking-wide"
                  >
                    {{ v.title }}
                  </dt>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Image section -->
      <div class="relative mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
        <img
          src="https://images.unsplash.com/photo-1580960551846-b37433e6f7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80"
          alt=""
          class="aspect-[5/2] w-full object-cover xl:rounded-3xl"
        >
        <div
          class="font-brand absolute bottom-4 left-16 z-10 text-xl text-white md:text-3xl"
        >
          Based in Irvine, California
        </div>
      </div>

      <!-- Values section -->
      <div class="mx-auto mb-24 mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div class="font-brand mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight sm:text-5xl">
            Core Values
          </h2>
          <p class="mt-6 text-2xl">
            No conversation on culture can start without a good look at the core
            values that make the company what it is.
          </p>
        </div>
        <dl
          class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 text-base sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          <div v-for="(v, i) in about().values" :key="i">
            <dt class="font-brand text-2xl font-bold">
              {{ v.title }}
            </dt>
            <dd class="mt-1">
              {{ v.desc }}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  </PageWrap>
</template>
