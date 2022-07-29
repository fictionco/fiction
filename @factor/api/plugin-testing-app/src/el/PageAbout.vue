<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
      <div class="space-y-12">
        <div
          class="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none"
        >
          <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Our Team
          </h2>
          <p class="text-xl text-gray-500">
            Odio nisi, lectus dis nulla. Ultrices maecenas vitae rutrum dolor
            ultricies donec risus sodales. Tempus quis et.
          </p>
        </div>
        <ul
          role="list"
          class="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
        >
          <li v-for="(item, i) in 3" :key="i">
            <div class="space-y-4">
              <div class="aspect-w-3 aspect-h-2">
                <img
                  class="rounded-lg object-cover shadow-lg"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                  alt=""
                />
              </div>

              <div class="space-y-2">
                <div class="space-y-1 text-lg font-medium leading-6">
                  <h3>Lindsay Walton</h3>
                  <p class="text-indigo-600">Position</p>
                </div>
                <ul role="list" class="flex space-x-5">
                  <li>
                    <RouterLink
                      :to="randomRoute()"
                      class="text-gray-400 hover:text-gray-500"
                    >
                      <span class="sr-only">Twitter</span>
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                        />
                      </svg>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink
                      :to="randomRoute()"
                      class="text-gray-400 hover:text-gray-500"
                    >
                      <span class="sr-only">LinkedIn</span>
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <!-- More people... -->
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RouterLink } from "vue-router"
import { randomRoute } from "../utils"
</script>
