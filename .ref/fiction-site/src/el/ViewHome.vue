<template>
  <div>
    <div class="relative">
      <div
        class="h-80 w-full absolute bottom-0 lg:inset-0 lg:h-auto lg:grid lg:grid-cols-2"
      >
        <div class="h-full lg:relative lg:col-start-2 lg:-mt-24">
          <img
            class="image-splash w-full object-cover opacity-25 lg:absolute lg:inset-0"
            :src="imageSplash"
            alt="People working on laptops"
          />
          <div
            aria-hidden="true"
            class="absolute inset-x-0 h-1/2 top-0 bg-gradient-to-b from-black lg:from-gray-900 to-transparent lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/3 lg:bg-gradient-to-r"
          />
        </div>
      </div>
      <div
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-x-8"
      >
        <div
          class="relative pt-12 pb-64 sm:pt-24 sm:pb-64 lg:col-start-1 lg:pb-24 xl:pr-16"
        >
          <a
            href="mailto:hello@fiction.com"
            class="inline text-base font-semibold tracking-wide uppercase bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent"
          >
            Work with
          </a>
          <h1
            class="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 lg:text-6xl"
          >
            <span id="mainHeadline" class="block"
              >We'll help you improve your customer experiences.</span
            >
          </h1>
          <p
            class="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
          >
            Since 2009, we’ve helped design, develop, market, and refine
            applications with a focus on customer experience and network
            effects.
          </p>
          <div class="mt-10 sm:mt-12">
            <ElemForm />
          </div>
        </div>
      </div>
    </div>

    <!-- Logo cloud -->

    <div class="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <p
        class="text-center text-sm font-semibold uppercase text-gray-100 tracking-wide"
      >
        Current Companies
        <!-- #33FFFB -->
      </p>
      <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div
          v-for="(company, index) in companyList"
          :key="index"
          class="col-span-1 flex justify-center items-center text-gray-600"
        >
          <a
            :href="company.link"
            target="_blank"
            class="block w-full mx-7 border-2 border-gray-800 rounded-md py-7 px-10 hover:border-gray-500"
          >
            <span class="sr-only">{{ company.title }}</span>
            <div v-html="company.img" />
            <p class="pt-3 text-center">{{ company.content }}</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Why work with Fiction -->
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-x-8">
        <div>
          <h2
            class="inline text-base font-semibold tracking-wide uppercase bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent"
          >
            Have a Company or Idea?
          </h2>
          <p class="mt-2 text-3xl font-extrabold text-white">
            Let's Work Together.
          </p>
          <p class="mt-4 text-lg text-gray-300">
            We work intensively with companies to improve their business models
            and software.
          </p>
        </div>
        <div
          class="mt-4 sm:mt-8 md:mt-10 md:grid md:grid-cols-2 md:gap-x-8 xl:mt-0 xl:col-span-2"
        >
          <ul
            class="border-t border-gray-700 divide-y divide-gray-700 md:border-t-0"
          >
            <li v-for="(why, index) in whyList1" :key="index" class="py-4 flex">
              <!-- Heroicon name: check -->
              <svg
                class="shrink-0 h-6 w-6 text-green-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="ml-3 text-base text-gray-300">
                {{ why.content }}
              </span>
            </li>
          </ul>

          <ul
            class="border-t border-gray-700 divide-y divide-gray-700 md:border-t-0"
          >
            <li v-for="(why, index) in whyList2" :key="index" class="py-4 flex">
              <!-- Heroicon name: check -->
              <svg
                class="shrink-0 h-6 w-6 text-green-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="ml-3 text-base text-gray-300">
                {{ why.content }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FAQs -->

    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
      <div class="lg:grid lg:grid-cols-3 lg:gap-8">
        <div>
          <h2
            class="inline text-base font-semibold tracking-wide uppercase bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent"
          >
            FAQ
          </h2>
          <h2 class="text-3xl font-extrabold text-white">Common Questions</h2>
          <p class="mt-4 text-lg text-gray-300">
            Can’t find the answer you’re looking for?
            <a
              href="mailto:hello@fiction.com"
              class="mt-2 block text-white hover:text-white"
              >Email Us &rarr;</a
            >
          </p>
        </div>
        <div class="mt-12 lg:mt-0 lg:col-span-2">
          <dl class="space-y-12">
            <div v-for="(faq, index) in faqs" :key="index">
              <dt class="flex text-lg leading-6 font-medium text-white">
                <svg
                  class="shrink-0 h-6 w-6 text-green-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="ml-3">{{ faq.title }}</span>
              </dt>
              <dd class="mt-2 ml-9 text-base text-gray-300">
                {{ faq.content }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- about -->

    <div class="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
      <div class="space-y-12 lg:grid lg:grid-cols-3 lg:gap-12 lg:space-y-0">
        <div class="space-y-5 sm:space-y-4">
          <h2
            class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            About Us
          </h2>
          <p class="mt-4 text-lg text-gray-300">
            80,000 customers and twenty years experience in the software
            business.
          </p>
        </div>
        <div class="lg:col-span-2">
          <ul
            class="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:gap-x-16"
          >
            <li v-for="(member, index) in team" :key="index">
              <div class="">
                <div class="aspect-w-3 aspect-h-2">
                  <img
                    class="object-cover shadow-lg rounded-lg"
                    :src="member.img"
                    alt=""
                  />
                </div>
                <div
                  class="mt-8 mb-4 text-2xl leading-6 font-medium text-white space-y-1"
                >
                  <h3>{{ member.name }}</h3>
                </div>
                <p class="text-lg text-gray-300 mb-4">
                  {{ member.content }}
                </p>

                <ul v-if="member.social" class="flex space-x-5">
                  <li v-for="(item, ii) in member.social" :key="ii">
                    <a
                      :href="item.link"
                      class="text-gray-300 hover:text-white"
                      target="_blank"
                    >
                      <span class="sr-only">{{ item.name }}</span>
                      <span v-html="item.icon" />
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="overflow-x-hidden">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          <div>
            <h2
              class="text-3xl font-extrabold text-white tracking-tight sm:text-4xl"
            >
              Directions
            </h2>
            <p class="flex mt-6 max-w-3xl text-lg leading-7 text-gray-300">
              <svg
                class="shrink-0 h-6 w-6 text-green-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <span class="ml-3"
                >950 Glenneyre St.<br />
                Laguna Beach, CA <br />
                92651
              </span>
            </p>
            <p class="flex mt-6 max-w-3xl text-lg leading-7 text-gray-300">
              <svg
                class="shrink-0 h-6 w-6 text-green-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>

              <span class="ml-3"
                ><a
                  href="mailto:hello@fiction.com"
                  class="inline-block font-medium text-gray-300 hover:text-white"
                  >hello@fiction.com</a
                >
              </span>
            </p>

            <p class="mt-6 max-w-3xl text-lg leading-7 text-gray-300">
              We're within walking distance of the pacific coast highway and the
              beach. Our office is a blue house.
            </p>

            <!-- Stats section -->
            <div class="mt-10">
              <dl class="grid grid-cols-2 gap-x-4 gap-y-8">
                <div class="pt-6">
                  <dt class="text-base font-medium text-gray-300">Founded</dt>
                  <dd class="text-3xl font-extrabold tracking-tight text-white">
                    2017
                  </dd>
                </div>

                <div class="pt-6">
                  <dt class="text-base font-medium text-gray-300">Employees</dt>
                  <dd class="text-3xl font-extrabold tracking-tight text-white">
                    9
                  </dd>
                </div>

                <div class="pt-6">
                  <dt class="text-base font-medium text-gray-300">Projects</dt>
                  <dd class="text-3xl font-extrabold tracking-tight text-white">
                    5
                  </dd>
                </div>

                <div class="pt-6">
                  <dt class="text-base font-medium text-gray-300">Customers</dt>
                  <dd class="text-3xl font-extrabold tracking-tight text-white">
                    81,356
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div class="mt-12 lg:pt-8">
            <ElemMap container="mapContainer" />
          </div>
        </div>
      </div>
    </div>

    <!-- newsletter -->

    <div class="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:pt-20 lg:px-8">
      <div class="border-2 border-gray-900 rounded-lg shadow-2xl p-6 lg:p-16">
        <div class="sm:text-center">
          <h2
            class="text-3xl font-extrabold text-white tracking-tight sm:text-4xl"
          >
            Join the Email List
          </h2>
          <p class="mt-6 mx-auto max-w-2xl text-lg text-gray-300">
            We'll send you special updates and invites to Fiction events.
          </p>
        </div>
        <ElemForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import { ref } from "vue"

import FictionAndrew from "../img/fiction-andrew.jpg"
import FictionRaymond from "../img/fiction-raymond.jpg"
import imageFounders1 from "../img/founders1.jpg"
import imageFounders2 from "../img/founders2.jpg"
import imageFounders3 from "../img/founders3.jpg"
import imageSplash from "../img/splash.jpg"
import ElemForm from "./ElemForm.vue"
import ElemMap from "./ElemMap.vue"

export default {
  components: {
    ElemForm,
    ElemMap,
  },
  setup() {
    useMeta({
      title: "Fiction - Let's Build Something Incredible Together",
      meta: [
        {
          name: `description`,
          content:
            "For over a decade, Fiction has been developing, funding and running web services companies.",
        },
      ],
    })

    const companyList = ref([
      {
        //imgOLD: `<svg class="h-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 303 60"> <path fill="#D29BF3" d="M66.507 8.786C61.07 3.159 53.697 0 46.008 0H0v6.522c0 2.76 1.072 5.153 2.037 6.803a24.348 24.348 0 003.635 4.664 25.494 25.494 0 002.849 2.502c.071 4.323 1.876 9.652 4.335 13.88a24.005 24.005 0 004.596 5.838 13.65 13.65 0 002.09 1.537l-.005.94c.04 2.06.506 4.086 1.362 5.947a22.773 22.773 0 003.024 4.99c2.17 2.726 6.15 6.377 11.37 6.377h10.715c7.688 0 15.064-3.16 20.5-8.786 5.437-5.626 8.49-13.256 8.49-21.211 0-7.959-3.053-15.591-8.49-21.217zm-43.64 27.408a6.526 6.526 0 01-1.314-.932 17.67 17.67 0 01-3.297-4.251c-1.426-2.452-2.472-5.184-3.02-7.566.174.012.34.035.518.035h30.252c2.35 0 3.592.848 4.355 1.754.864 1.044 1.45 2.66 1.431 4.565a7.581 7.581 0 01-1.512 4.682c-.782.96-1.96 1.715-3.959 1.715H22.867v-.002zm39.185 10.407c-4.254 4.402-10.026 6.877-16.044 6.877H35.293c-2.447 0-4.898-1.897-6.693-4.24-1.658-2.163-2.755-4.709-2.76-6.476v-.046h20.484c15.44 0 16.072-25.76-.316-25.76H15.756c-1.316 0-3.839-1.696-5.95-3.914-1.93-2.029-3.503-4.5-3.503-6.522h39.705c6.018 0 11.787 2.474 16.044 6.876s6.645 10.374 6.645 16.601c0 6.23-2.391 12.2-6.645 16.604z"/> <path fill="#E9E9EE" d="M106.525 6.1c-6.8 0-11.772.048-14.781.142l-.1.01c-.649.11-1.05.609-1.05 1.307V54.05c0 1.024.63 1.388 1.155 1.388 4.407.094 8.943.142 13.483.142 2.523 0 5.02-.26 7.426-.768 2.421-.515 4.834-1.393 7.174-2.612 2.355-1.228 4.435-2.796 6.181-4.664 1.757-1.882 3.195-4.341 4.275-7.31 1.074-2.96 1.621-6.31 1.621-9.961 0-7.139-2.192-13.015-6.514-17.46-4.328-4.447-10.678-6.705-18.87-6.705zm-5.346 8.307c.83-.046 2.398-.087 5.346-.087 4.636 0 8.261 1.345 10.779 3.995 2.523 2.66 3.78 6.728 3.735 12.095 0 5.787-1.373 10.104-4.084 12.836-2.706 2.729-6.578 4.114-11.507 4.114-1.393 0-2.826-.036-4.272-.104v-32.85h.003zm64.399 18.727c0-4.379-1.273-7.958-3.781-10.644-2.525-2.699-6.275-4.068-11.145-4.068-4.886 0-9.728.985-12.966 2.64-.558.213-.876.72-.876 1.4l.993 5.588c.015.489.188.837.512 1.036.224.14.606.25 1.145-.018 3.127-1.609 6.314-2.426 9.473-2.426 1.752 0 3.155.344 4.173 1.02 1.003.668 1.614 1.315 1.823 1.915.234.685.354 1.375.354 2.052v.461c-.255-.005-.576-.013-.96-.023a132.11 132.11 0 00-2.811-.035c-5.086 0-9.234.99-12.324 2.945-3.2 2.024-4.824 5.043-4.824 8.974 0 4.104 1.443 7.212 4.287 9.239 2.764 1.968 6.395 2.968 10.784 2.968 5.338 0 10.626-1.204 15.631-3.546.448-.148.728-.527.721-1.09-.138-1.061-.209-2.62-.209-4.63V33.133zm-14.567 15.445c-2.185 0-3.799-.463-4.799-1.38-.996-.91-1.479-2.067-1.479-3.536 0-1.471.575-2.584 1.756-3.398 1.253-.863 3.111-1.301 5.525-1.301 1.374 0 2.469.056 3.269.165v8.755c-1.273.464-2.707.695-4.272.695zm38.429-30.157c-4.522 0-6.675 1.631-8.959 4.401-.165-1.102-.366-1.963-.603-2.604-.245-.733-.789-1.153-1.495-1.153h-7.092c-.489 0-.769.208-.919.382a1.135 1.135 0 00-.252.929c.234 2.696.356 5.927.356 9.605v24.142c0 .8.545 1.316 1.39 1.316h7.879c.787 0 1.317-.53 1.317-1.316V32.778c0-.517.14-.907.425-1.194 2.408-2.409 5.718-3.493 9.86-3.221.786 0 1.316-.53 1.316-1.316l-1.988-7.492c-.044-.683-.53-1.133-1.235-1.133zm57.917.644h-7.377c-.688 0-1.182.412-1.301 1.084-2.358 8.317-4.326 15.988-5.861 22.854-.98-4.272-2.846-11.813-5.641-22.798-.102-.702-.576-1.138-1.238-1.138h-7.736c-.362 0-1.016.15-1.365 1.197a4946.12 4946.12 0 00-6.006 22.7c-1.056-4.928-2.899-12.453-5.595-22.84l-.036-.105c-.257-.605-.741-.952-1.329-.952h-8.096c-.56 0-.868.237-1.026.438-.16.201-.325.558-.19 1.156l9.607 33.628c.245.733.843 1.153 1.637 1.153h7.951c.784 0 1.332-.471 1.446-1.232.81-2.762 1.82-6.245 3.03-10.443l2.757-9.562c.201-.698.379-1.34.534-1.922.978 4.129 2.791 11.491 5.423 22.008.244.733.789 1.154 1.494 1.154h8.022c.367 0 1.047-.14 1.5-1.166l10.517-33.63c.198-.533.066-.897-.079-1.108-.145-.22-.446-.476-1.042-.476zm-20.962 1.08s0-.003 0 0l.005-.003-.005.002zm35.278-1.08h-7.951c-.787 0-1.316.53-1.316 1.316V54.05c0 .843.545 1.388 1.39 1.388h7.879c.787 0 1.316-.53 1.316-1.316V20.384c-.002-.789-.532-1.318-1.318-1.318zM257.805 3.45c-1.631 0-2.988.532-4.037 1.578-1.049 1.049-1.579 2.406-1.579 4.035 0 1.678.507 3.035 1.507 4.035 1.001 1 2.358 1.507 4.038 1.507 1.678 0 3.035-.506 4.035-1.507 1.001-1 1.507-2.357 1.507-4.035 0-1.622-.501-2.976-1.494-4.022-1.003-1.054-2.34-1.591-3.977-1.591zm40.68 18.462c-2.52-2.317-5.532-3.49-8.956-3.49-3.745 0-7.062 1.125-9.88 3.35a9.903 9.903 0 00-.375-1.622l-.076-.16c-.479-.761-1.112-.922-1.561-.922h-6.876c-.534 0-.825.232-.977.425-.146.189-.296.515-.189 1.011.186 1.98.28 4.542.28 7.617v25.932c0 .843.517 1.387 1.316 1.387h7.88c.842 0 1.39-.516 1.39-1.316V29.626c1.69-1.813 3.676-2.696 6.061-2.696 1.737 0 3.002.52 3.862 1.586.891 1.102 1.342 2.678 1.342 4.69V54.05c0 .843.545 1.388 1.387 1.388h7.882c.8 0 1.317-.545 1.317-1.388V33.42c-.006-5.3-1.291-9.173-3.827-11.507z"/> </svg>`,
        img: `<svg class="h-10 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280.41 61.54" > <path d="M104.66,51.66V11.42a.43.43,0,0,1,.37-.49q3.91-.13,12.77-.13,10.42,0,15.88,5.61t5.45,14.67a24.43,24.43,0,0,1-1.36,8.4,17.6,17.6,0,0,1-3.57,6.1A18.76,18.76,0,0,1,129,49.49a23.74,23.74,0,0,1-6,2.2,29.77,29.77,0,0,1-6.29.65c-4,0-7.85,0-11.66-.12C104.79,52.22,104.66,52,104.66,51.66Zm7.88-34.91V46.39c1.48.08,2.93.12,4.34.12q6.69,0,10.41-3.75T131,31.2q.06-7.26-3.41-10.91t-9.8-3.66C115,16.63,113.2,16.67,112.54,16.75Z" fill="#E9E9EE" /> <path d="M167.78,33.56v11.9a34.94,34.94,0,0,0,.18,4.09.24.24,0,0,1-.18.25,31.16,31.16,0,0,1-13.33,3,15.12,15.12,0,0,1-9-2.45c-2.3-1.63-3.44-4.12-3.44-7.47a8,8,0,0,1,3.87-7.22c2.58-1.64,6-2.45,10.32-2.45l2.42,0,1.49,0V32.25a6,6,0,0,0-.34-2,4.36,4.36,0,0,0-1.83-2,7,7,0,0,0-4-1,18.47,18.47,0,0,0-8.49,2.17c-.33.17-.5.05-.5-.37V24.32a.58.58,0,0,1,.37-.62,21.83,21.83,0,0,1,10.11-2.23q6.08,0,9.18,3.31A12.39,12.39,0,0,1,167.78,33.56Zm-7.63,13.2V38.21a17.1,17.1,0,0,0-3.47-.25,9,9,0,0,0-5.15,1.24,4,4,0,0,0-1.8,3.47,4.56,4.56,0,0,0,1.49,3.53,6.63,6.63,0,0,0,4.59,1.37A11.08,11.08,0,0,0,160.15,46.76Z" fill="#E9E9EE" /> <path d="M172.73,22h6.14a.7.7,0,0,1,.68.56,10.5,10.5,0,0,1,.66,3.06,13.3,13.3,0,0,1,7-3.18l1.12-.17c.39-.06.47.06.56.37l1.89,6.63a.44.44,0,0,1-.5.49c-3.76-.25-6.94.75-9.17,3a2,2,0,0,0-.56,1.49V51.72a.44.44,0,0,1-.5.5h-6.82c-.37,0-.55-.17-.55-.5V30.83c0-3.23-.11-6-.31-8.37C172.31,22.17,172.44,22,172.73,22Z" fill="#E9E9EE" /> <path d="M227.78,52.22h-6.94a.69.69,0,0,1-.68-.56q-4.53-18.1-5.27-21.58h-.06c-.17,1-.52,2.36-1.06,4.22s-1.33,4.62-2.39,8.28-1.93,6.68-2.63,9.08a.56.56,0,0,1-.62.56h-6.88a.78.78,0,0,1-.81-.56l-8.31-29.08c-.08-.37.07-.56.44-.56h7a.6.6,0,0,1,.56.44q4.22,16.24,5.33,22.19h.13q2.1-8.11,5.83-22.07c.12-.37.31-.56.55-.56h6.7c.25,0,.39.15.43.44q4.71,18.54,5.46,22.38h.12q2.12-9.92,5.65-22.38a.45.45,0,0,1,.49-.44h6.39c.37,0,.49.17.37.5l-9.11,29.14C228.3,52,228.07,52.22,227.78,52.22Z" fill="#E9E9EE" /> <path d="M247.87,15.76a4.67,4.67,0,0,1-6.07,0,4.07,4.07,0,0,1-1.12-3,4,4,0,0,1,4.21-4.21,3.89,3.89,0,0,1,3,1.18,4.23,4.23,0,0,1,1.12,3A4.11,4.11,0,0,1,247.87,15.76Zm-7,35.9V22.52a.44.44,0,0,1,.5-.5h6.88a.44.44,0,0,1,.5.5v29.2a.44.44,0,0,1-.5.5h-6.82A.5.5,0,0,1,240.86,51.66Z" fill="#E9E9EE" /> <path d="M253.63,51.66V29.22c0-2.73-.09-5-.25-6.7-.08-.33,0-.5.37-.5h5.95a.94.94,0,0,1,.81.5,10.56,10.56,0,0,1,.43,2.48A12.78,12.78,0,0,1,270,21.47a10.45,10.45,0,0,1,7.31,2.85q3.1,2.85,3.1,9.48V51.66c0,.37-.16.56-.49.56h-6.83a.49.49,0,0,1-.55-.56v-18a7,7,0,0,0-1.3-4.47,4.67,4.67,0,0,0-3.85-1.61,7.58,7.58,0,0,0-5.89,2.73V51.72c0,.33-.18.5-.56.5h-6.82C253.79,52.22,253.63,52,253.63,51.66Z" fill="#E9E9EE" /> <path d="M68.42,9a29,29,0,0,0-21-9H0V6.37a13.62,13.62,0,0,0,2.06,6.87A24.82,24.82,0,0,0,5.78,18a26.71,26.71,0,0,0,2.91,2.57l.16.12v.19c.06,4.18,1.77,9.63,4.45,14.23a24.31,24.31,0,0,0,4.7,6,13.67,13.67,0,0,0,2.1,1.55l.2.12V44a15,15,0,0,0,1.38,6,23.51,23.51,0,0,0,3.09,5.11c1.93,2.42,6,6.47,11.5,6.47H47.41a29,29,0,0,0,21-9,31.13,31.13,0,0,0,8.71-21.76A31.14,31.14,0,0,0,68.42,9ZM23,37.62v-.17a8.43,8.43,0,0,1-1.23-.91A18.55,18.55,0,0,1,18.21,32a29.85,29.85,0,0,1-3.18-8l-.12-.53.72.05.34,0H47.4a5.91,5.91,0,0,1,4.84,2,7.78,7.78,0,0,1,1.58,5,8.26,8.26,0,0,1-1.65,5.1,5.37,5.37,0,0,1-4.44,1.95ZM64.37,48.3a23.43,23.43,0,0,1-17,7.27H36.27c-2.4,0-5.05-1.66-7.28-4.56-1.78-2.33-2.94-5.07-2.95-7v-.4l.41-.05H47.73c7.77,0,11.84-6.58,11.84-13.08,0-6.2-3.81-12.88-12.16-12.88H16c-1.71,0-4.56-2.17-6.48-4.19C7.11,10.92,5.74,8.35,5.74,6.37V6H47.41a23.46,23.46,0,0,1,17,7.26,25.41,25.41,0,0,1,0,35.07Z" class="a" fill="#D29BF3" /> </svg>`,
        title: "Darwin",
        content: "Behavioral Analytics",
        link: "https://www.darwin.so",
      },
      {
        //imgOLD: `<svg class="h-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 273 60"> <path fill="#E9E9EE" d="M113.263 12.742a1.358 1.358 0 001.434-1.623L113.4 5.342a1.453 1.453 0 00-1.514-1.337H86.634a1.331 1.331 0 00-1.44 1.37v47.618a1.324 1.324 0 001.366 1.44h8.194a1.362 1.362 0 001.44-1.44V34.32h10.794a1.33 1.33 0 001.44-1.372l.572-5.92a1.363 1.363 0 00-.875-1.357 1.367 1.367 0 00-.565-.088H96.194v-12.84h17.069zm32.023 32.863V31.559c0-4.492-1.309-8.172-3.892-10.937-2.583-2.766-6.445-4.183-11.428-4.183a26.694 26.694 0 00-12.263 2.703 1.514 1.514 0 00-.955 1.52l-.571 5.634a1.304 1.304 0 00.571 1.211 1.232 1.232 0 001.263 0 23.2 23.2 0 0110.2-2.468 7.552 7.552 0 014.206 1.028 4.478 4.478 0 011.8 1.903c.23.664.35 1.36.354 2.063v.371h-.88c-1.08-.028-2.034-.04-2.857-.04-5.211 0-9.463 1.018-12.64 3.023-3.297 2.086-4.966 5.195-4.966 9.246 0 4.223 1.486 7.429 4.418 9.514 2.857 2.017 6.565 3.046 11.068 3.046a37.804 37.804 0 0016.052-3.651 1.146 1.146 0 00.748-1.08v-.115a38.933 38.933 0 01-.228-4.742zm-15 1.628c-2.206 0-3.829-.468-4.835-1.383A4.55 4.55 0 01124 42.313a3.86 3.86 0 011.748-3.394c1.263-.869 3.143-1.309 5.583-1.309a25.44 25.44 0 013.24.16v8.783c-1.379.47-2.828.7-4.285.68zm48.314 6.452a1.145 1.145 0 00.766-1.418l-1.652-5.742a1.143 1.143 0 00-1.411-.783 17.145 17.145 0 01-4.874.72 9.981 9.981 0 01-7.023-2.726c-1.909-1.8-2.857-4.48-2.857-8 0-3.274.897-5.909 2.662-7.834 1.766-1.926 4.663-2.858 7.657-2.858.848 0 1.694.064 2.532.19a1.146 1.146 0 001.001-.364 1.144 1.144 0 00.268-1.031c-.212-1.966-.572-4.435-.852-6.217a1.085 1.085 0 00-1.103-.852c-.571-.034-1.925-.223-2.554-.223-6.006 0-11.531 1.852-15.286 5.509-3.754 3.657-5.674 8.371-5.674 14s1.714 10.286 5.143 13.829c3.428 3.542 8.183 5.388 14.154 5.388a33.487 33.487 0 009.103-1.589zm25.434-7.058a1.252 1.252 0 00-1.143-.165h-.045c-.873.303-1.79.46-2.715.462-1.234 0-2.08-.274-2.52-.817-.44-.542-.72-1.628-.72-3.08v-17.56h6.252a1.265 1.265 0 001.297-1.365v-5.56a1.334 1.334 0 00-.823-1.346 1.337 1.337 0 00-.548-.1h-6.143c.097-4.154.234-7.28.417-9.303v-.08a1.201 1.201 0 00-.469-1.023 1.22 1.22 0 00-1.068-.183L188 7.53a1.593 1.593 0 00-1.286 1.326 69.017 69.017 0 00-.765 8.257h-4.572a1.196 1.196 0 00-1.143 1.412 47.38 47.38 0 00.852 5.645 1.709 1.709 0 001.657 1.32h3.143v18.48c0 7.309 3.662 11.172 10.588 11.172 2.857 0 5.246-.44 7.057-1.309a1.594 1.594 0 00.966-1.669v-4.44a1.292 1.292 0 00-.463-1.097zm22.4-30.188c-5.674 0-10.326 1.834-13.817 5.457-3.491 3.623-5.251 8.291-5.251 13.908 0 5.355 1.623 9.96 4.817 13.715 3.194 3.754 7.971 5.674 14.108 5.674 5.572 0 10.16-1.771 13.629-5.263 3.469-3.491 5.223-8.314 5.223-14.274 0-5.509-1.674-10.137-4.977-13.743-3.303-3.606-7.949-5.474-13.732-5.474zm-5.817 10.908a6.407 6.407 0 015.452-2.805c2.645 0 4.571.96 5.868 2.942 1.297 1.983 2.052 4.87 2.052 8.343 0 3.778-.749 6.64-2.229 8.498a6.502 6.502 0 01-5.326 2.714 6.68 6.68 0 01-5.811-2.932c-1.446-2.04-2.183-4.874-2.183-8.428 0-3.555.731-6.372 2.177-8.332zm50.469-10.908c-4.486 0-8.206 1.503-11.092 4.468a14.295 14.295 0 00-.605-2.565 1.662 1.662 0 00-1.618-1.229h-7.24a1.286 1.286 0 00-1.011.423 1.224 1.224 0 00-.28 1.023c.24 2.748.36 6.046.36 9.8V53.01a1.403 1.403 0 00.934 1.365c.186.066.384.091.58.075h8.046a1.364 1.364 0 001.446-1.44V31.193a1.54 1.54 0 01.405-1.143c2.475-2.474 5.715-3.537 10-3.257a1.365 1.365 0 001.44-1.446V17.81a1.286 1.286 0 00-1.365-1.371z"/> <path fill="#00D1FF" d="M34.966 6.05a.504.504 0 01.505.505v17.974h8.899a9.58 9.58 0 019.58 9.58v.857a.504.504 0 01-.505.505H35.471v8.899a9.58 9.58 0 01-9.58 9.58h-.857a.504.504 0 01-.505-.505V35.471H15.63a9.58 9.58 0 01-9.58-9.58v-.857a.504.504 0 01.505-.505h17.974V15.63a9.58 9.58 0 019.58-9.58h.857zm0-6.05h-.857a15.63 15.63 0 00-15.63 15.63v2.849H6.555A6.555 6.555 0 000 25.034v.857a15.63 15.63 0 0015.63 15.63h2.849v11.924A6.555 6.555 0 0025.034 60h.857a15.63 15.63 0 0015.63-15.63V41.52h11.924A6.555 6.555 0 0060 34.966v-.857a15.63 15.63 0 00-15.63-15.63H41.52V6.555A6.555 6.555 0 0034.966 0z"/> </svg>`,
        img: `<svg class="h-10 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245.71 62.54"><path d="M46.4 19.46h-3.32V6.58A6.59 6.59 0 0036.5 0h-.9a16.16 16.16 0 00-16.14 16.14v3.32H6.58A6.59 6.59 0 000 26v.9a16.16 16.16 0 0016.14 16.18h3.32V56A6.59 6.59 0 0026 62.54h.9A16.16 16.16 0 0043.08 46.4v-3.32H56a6.59 6.59 0 006.58-6.58v-.9A16.16 16.16 0 0046.4 19.46zM16.14 37.35A10.42 10.42 0 015.73 26.94V26a.85.85 0 01.85-.85h18.61v-9A10.42 10.42 0 0135.6 5.73h.9a.85.85 0 01.85.85v18.61h9A10.42 10.42 0 0156.81 35.6v.9a.85.85 0 01-.85.85H37.35v9a10.42 10.42 0 01-10.41 10.46H26a.85.85 0 01-.85-.85V37.35z" fill="#00d1ff"/><path d="M98.69 34.53v16a.42.42 0 01-.48.48h-6.72q-.42 0-.42-.48V11.49q0-.42.48-.42h23.34a.49.49 0 01.54.48l.6 4.74q.06.54-.48.54H98.69v11.94h15.18a.42.42 0 01.48.48v4.86q0 .42-.48.42zM143 33v11.49a32.81 32.81 0 00.18 4 .24.24 0 01-.18.24 30.2 30.2 0 01-12.9 2.94 14.62 14.62 0 01-8.67-2.37q-3.33-2.37-3.33-7.23a7.75 7.75 0 013.75-7q3.75-2.37 10-2.37h3.78v-1a5.87 5.87 0 00-.33-1.92 4.2 4.2 0 00-1.77-1.92 6.82 6.82 0 00-3.84-1 17.8 17.8 0 00-8.22 2.1q-.48.24-.48-.36V24a.55.55 0 01.36-.6 21.1 21.1 0 019.78-2.16q5.88 0 8.88 3.21A11.93 11.93 0 01143 33zm-7.38 12.78v-8.31a17 17 0 00-3.36-.24 8.72 8.72 0 00-5 1.2 3.85 3.85 0 00-1.74 3.36 4.43 4.43 0 001.48 3.42 6.4 6.4 0 004.44 1.32 10.77 10.77 0 004.15-.78zM169 45.21V50a.52.52 0 01-.3.54 18.48 18.48 0 01-6.9 1.08q-7.08 0-11.1-4.2a15.06 15.06 0 01-4-10.86 14.66 14.66 0 014.44-11 15.9 15.9 0 0111.58-4.32 15.71 15.71 0 015.94.84.86.86 0 01.36.66l-.06 4.8q0 .6-.48.36a11.57 11.57 0 00-5.22-1.08 8.18 8.18 0 00-6.33 2.58 9.8 9.8 0 00-2.37 6.9q0 4.62 2.58 7.05a8.77 8.77 0 006.24 2.43 13.56 13.56 0 005.22-.9q.4-.15.4.33zM191 46.23v3.66q0 .6-.36.72a12.71 12.71 0 01-5.52 1q-8 0-8-8.46V27.27h-3.66q-.42 0-.42-.54v-4.44a.42.42 0 01.48-.48h3.6a62.31 62.31 0 01.66-7.32q.12-.48.48-.54l6.42-.84q.42-.12.42.3-.24 2.7-.36 8.4h5.76q.42 0 .42.48v4.56q0 .42-.36.42h-5.82v15.12a4.73 4.73 0 00.75 3 3.18 3.18 0 002.61.93 7.4 7.4 0 002.46-.42q.44-.15.44.33zM208.37 21.27q6.84 0 10.74 4.26a15.38 15.38 0 013.9 10.8q0 7.08-4.08 11.19a14.39 14.39 0 01-10.68 4.11q-7.26 0-11-4.41a16 16 0 01-3.78-10.77 15.08 15.08 0 014.11-10.92 14.36 14.36 0 0110.79-4.26zm-.3 5.22a6 6 0 00-5 2.61 12 12 0 00-1.92 7.23 12.41 12.41 0 001.85 7.32 6.19 6.19 0 005.34 2.7 6.05 6.05 0 004.92-2.49q2-2.49 2-7.41a13 13 0 00-1.8-7.23 6 6 0 00-5.39-2.73zM227.93 21.81h5.94a.67.67 0 01.66.54 15.5 15.5 0 01.66 3.54 11.45 11.45 0 019.6-4.62.37.37 0 01.42.42v6.18a.42.42 0 01-.48.48q-5.46-.36-8.7 2.88a2 2 0 00-.54 1.44v17.88a.42.42 0 01-.49.45h-6.6q-.54 0-.54-.48V30.33q0-4.68-.3-8.1-.05-.42.37-.42z" stroke="#E9E9EE" fill="#E9E9EE" stroke-miterlimit="10"/></svg>`,
        title: "Factor",
        content: "JavaScript CMS",
        link: "https://www.factor.so",
      },
    ])

    const whyList1 = ref([
      {
        content: "Improve software and services.",
      },
      {
        content: "Improve business processes",
      },
      {
        content: "No commitment. We're flexible.",
      },
    ])

    const whyList2 = ref([
      {
        content: "Network benefits",
      },
      {
        content: "We'll handle legal and admin.",
      },
      {
        content: "Long term commitment.",
      },
    ])

    const faqs = ref([
      {
        title: "Will you invest in my company?",
        content:
          "We've just invested in 9 new startups, and are busy getting things set up with them at the moment. However, we are always interested in hearing new proposals, we are always interested in good ideas.",
      },
      {
        title: `Why the name "Fiction"?`,
        content:
          "Fiction is a metaphor for what we do. We help turn ideas/dreams into reality.",
      },
      {
        title: "Will you expand to other cities and countries?",
        content: "Cities, yes; countries, possibly.",
      },
      {
        title: "Are you hiring?",
        content: "Hiring is obsolete. We're funding.",
      },
      {
        title: "Are you looking for investors?",
        content: "Not at the moment.",
      },
    ])

    const team = ref([
      {
        img: FictionAndrew,
        name: "Andrew Powers",
        content: `Andrew is the founder of several software companies in the web creation space (Darwin Analytics, Factor CMS, PageLines).
          He has published papers on ultrasound positioning systems, and ultrasound imaging for medical devices.
          For fun he reverse-engineers synthesizers and builds guitars. He has a Masters in Engineering for University of Utah and an MBA from San Diego State.`,
        social: [
          {
            icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" > <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" /> </svg>`,
            name: "LinkedIn",
            link: "https://www.linkedin.com/in/arpowers/",
          },
        ],
      },
      {
        img: FictionRaymond,
        name: "Raymond Aleman",
        content: `Raymond is a co-founder of several companies including Darwin, Factor and PageLines.
          He is an accomplished UX designer who spends his days analyzing customer behavior using custom databases he's created from scratch.
          Ray holds a degree in CS from San Diego State.`,
        social: [
          {
            icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" > <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" /> </svg>`,
            name: "LinkedIn",
            link: "https://www.linkedin.com/in/raylopezaleman/",
          },
        ],
      },
    ])

    return {
      companyList,
      whyList1,
      whyList2,
      faqs,
      team,
      ElemMap,
      imageSplash,
      imageFounders1,
      imageFounders2,
      imageFounders3,
    }
  },
  metaInfo(this: any) {
    return {
      title: "Fiction - Let's Build Something Together",
      description:
        "For over a decade, we've been partnering with founders to give them quick, straightforward exits that protect their team and culture and keep their businesses operating for the longterm.",
    }
  },
}
</script>

<style lang="less">
.image-splash {
  height: 100%;
  @media (min-width: 1280px) {
    height: 126%;
  }
}
</style>
