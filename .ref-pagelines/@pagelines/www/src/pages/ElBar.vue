<script lang="ts" setup>
import type { FactorUser } from '@factor/api'
import { dayjs, formatNumber, useService } from '@factor/api'
import { getDashboardUrl } from '@fiction/core/util'
useService<{ factorUser: FactorUser }>()
// Get the current date
const now = dayjs()

// Calculate the number of days since the start date (using a fixed start date of January 1, 2022)
const start = dayjs('2023-03-18')
const daysSinceStart = now.diff(start, 'day')

// Calculate the MRR based on the number of days since the start date, with some randomization added
const startingMRR = 3251
const mrrPerDay = 40
const randomMRR = Math.random() * 50 - 25
const mrr = startingMRR + daysSinceStart * mrrPerDay + randomMRR

// Calculate the number of subscribers
const avgRevenuePerSubscriber = 29
const subscribers = Math.round(mrr / avgRevenuePerSubscriber)

// Calculate the number of images generated per day based on the number of subscribers
const imagesPerSubscriber = 22
const imagesPerDay = subscribers * imagesPerSubscriber
</script>

<template>
  <div
    class="bar from-theme-800 to-theme-900 text-theme-300 bg-gradient-to-br text-center text-[10px] font-semibold tracking-tight"
  >
    <div
      class="mx-auto flex max-w-screen-xl justify-center px-4 py-2 md:justify-between md:space-x-8"
    >
      <div class="text-theme-400 hidden md:block">
        {{ formatNumber(mrr, "dollar") }} MRR &mdash;
        {{ formatNumber(imagesPerDay) }} AI Generations / Day
      </div>
      <div class="flex space-x-4">
        <div class="text-theme-400">
          Ready to start building your AI toolkit?
        </div>
        <a
          :href="getDashboardUrl({ path: '/register' })"
          class="hover:text-theme-200 bg-theme-700 rounded-sm px-2"
        >Yes, show me the future</a>
        <a href="/" class="hover:text-theme-200 bg-theme-700 rounded-sm px-2">No, I'm good with the old way</a>
      </div>
    </div>
  </div>
</template>
