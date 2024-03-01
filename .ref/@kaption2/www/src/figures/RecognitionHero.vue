<script lang="ts" setup>
import { formatNumber, toLabel } from '@factor/api'
import { ref } from 'vue'
import avatarGirl1 from './img/avatarGirl1.svg'
import avatarBoy3 from './img/avatarBoy3.svg'

const metrics = ref<
  {
    type: string
    text?: string
    count?: number
    format?: 'dollar' | 'duration'
  }[]
>([
  {
    type: 'Average CSAT',
    count: 4.9,
  },

  {
    type: 'Average NPS',
    count: 79,
  },
],
)
</script>

<template>
  <div :style="{ perspective: `800px` }">
    <div
      class="overflow-hidden rounded-lg bg-primary-400 text-left text-xs text-white shadow-xl ring-1 ring-black/5"
      :style="{ transform: `rotateY(4deg) rotateZ(-2deg)` }"
    >
      <div class="flex items-center space-x-4 border-b border-primary-300 p-6">
        <div><img :src="avatarGirl1" class="h-14 w-14"></div>
        <div class="">
          <div class="text-2xl font-bold">
            Emily Johnson
          </div>
          <div class="text-primary-100">
            Employee Since 2020
          </div>
        </div>
      </div>
      <div class="bg-primary-400 p-6">
        <dl class="gap-4 gap-y-6 sm:grid sm:grid-cols-12">
          <div
            v-for="item in metrics"
            :key="item.type"
            class="col-span-12 flex flex-col md:col-span-6"
          >
            <dt
              class="order-2 mt-2 select-none text-sm font-medium leading-6 text-primary-200"
            >
              {{ toLabel(item.type) }}
            </dt>
            <dd class="order-1 select-none text-6xl font-extrabold">
              {{
                item.text
                  || formatNumber(item.count, item.format || "abbreviated")
              }}
            </dd>
          </div>
        </dl>
        <div class="mt-12 mb-4 text-xl font-bold text-primary-200">
          Emily's Customer Mentions &darr;
        </div>
        <article class="rounded-md bg-primary-300 p-4">
          <div>
            <div class="flex space-x-3">
              <div class="shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  :src="avatarBoy3"
                  alt=""
                >
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold">
                  <a href="#" class="hover:underline">Jon Switch</a>
                </p>
                <p class="text-sm text-primary-200">
                  <a href="#" class="hover:underline">
                    <time datetime="2020-12-09T11:43:00">December 9 at 11:43 AM</time>
                  </a>
                </p>
              </div>
            </div>
            <h2 id="question-title-81614" class="mt-4 text-base font-bold">
              What a wonderful experience.
            </h2>
          </div>
          <div class="mt-2 space-y-4 text-sm">
            <p>
              I had a great experience at Acme, thanks to the help of
              <span class="rounded-sm bg-primary-400 px-1">Emily Johnson</span>.
              She was wonderful.
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
