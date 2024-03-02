<script lang="ts" setup>
import { formatNumber, toLabel } from '@factor/api'
import { ref } from 'vue'
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
    type: 'purchases',
    count: 2,
  },

  {
    type: 'pageViews',
    count: 120,
  },
  {
    type: 'spending',
    count: 225,
    format: 'dollar',
  },
  {
    type: 'timeOnSite',
    count: 500,
    format: 'duration',
  },
  {
    type: 'messages',
    count: 1,
  },
  {
    type: 'supportResponseTime',
    count: 6000,
    format: 'duration',
  },
  {
    type: 'position',
    text: 'Acme Inc.',
  },
  {
    type: 'position',
    text: 'CEO',
  },
],
)
</script>

<template>
  <div :style="{ perspective: `800px` }">
    <div
      class="text-theme-800 rounded-lg bg-white text-left text-xs shadow-xl ring-1 ring-black/5"
      :style="{ transform: `rotateY(-4deg) rotateZ(2deg)` }"
    >
      <div
        class="bg-theme-50 flex items-center space-x-4 border-b border-slate-200 p-6"
      >
        <div><img :src="avatarBoy3" class="h-14 w-14"></div>
        <div class="">
          <div class="text-2xl font-bold">
            Adam Smith
          </div>
          <div class="text-primary-500">
            First seen 2 Months Ago
          </div>
        </div>
      </div>
      <div class="p-6">
        <dl class="gap-4 gap-y-6 sm:grid sm:grid-cols-12">
          <div
            v-for="item in metrics"
            :key="item.type"
            class="col-span-12 flex flex-col md:col-span-4"
          >
            <dt
              class="text-theme-400 order-2 mt-2 select-none text-sm font-medium leading-6"
            >
              {{ toLabel(item.type) }}
            </dt>
            <dd
              class="text-theme-600 order-1 select-none text-2xl font-extrabold tracking-tight"
            >
              {{
                item.text
                  || formatNumber(item.count, item.format || "abbreviated")
              }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
