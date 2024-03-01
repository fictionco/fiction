<script lang="ts" setup>
import { dayjs, vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { useSiteService } from './inject'
import nyTimes from './img/nytimes.svg'

const { factorRouter, factorStripe } = useSiteService()

const templateId = vue.ref('')
const formName = vue.ref(`New Form (${dayjs().format('MMM DD [at] h:mma')})`)
const sending = vue.ref(false)

const duration = vue.ref<'month' | 'year'>('month')

const std = [
  'Unlimited Renders',
  'Faster, Better Images',
  'Sharpening and Refinement',
  'Keep Private or Share',
  'Additional Styles and Settings',
]
const options = vue.ref([
  {
    icon: 'i-carbon-badge',
    title: 'Fiction Pro',
    description:
      'Subscribe now and lock in your early bird price. Pro is ideal for individuals working with AI. Save 50% when paying yearly.',
    pricing: { month: '29', year: '249' },
    features: [
      ...std,
      '20+ Additional Render Types',
      'Usage for 1 Person',
      '5 Custom AI Models / Trainings',
      'Cancel Anytime',
    ],
    href: factorStripe.getCheckoutUrl({
      productKey: 'pro',
      priceKey: duration.value,
    }),
  },
  {
    icon: 'i-carbon-group-access',
    title: 'Fiction Pro Team',
    description:
      'Subscribe now and lock in your early bird price. Pro Team allows a team of 10 people. Great for real estate or design agencies. Save 50% when paying yearly.',
    pricing: { month: '249', year: '1999' },
    features: [
      ...std,
      'Priority support & feature requests',
      '35+ Additional Render Types',
      'Usage for 10 People',
      '25 Custom AI Models / Trainings',
      'Cancel Anytime',
    ],
    href: factorStripe.getCheckoutUrl({
      productKey: 'proTeams',
      priceKey: duration.value,
    }),
  },
])
</script>

<template>
  <ElModal modal-class="max-w-screen-lg">
    <div class="p-8">
      <div class="text-center">
        <div
          class="relative mt-6 grid grid-cols-2 self-center rounded-lg bg-slate-100 p-0.5 sm:mt-8 w-72 text-sm font-medium uppercase tracking-wide select-none mx-auto"
        >
          <div
            class="p-2 z-10 cursor-pointer"
            :class="duration === 'month' ? 'text-white' : 'text-slate-500'"
            @click="duration = 'month'"
          >
            Monthly
          </div>
          <div
            class="p-2 z-10 cursor-pointer"
            :class="duration === 'year' ? 'text-white' : 'text-slate-500'"
            @click="duration = 'year'"
          >
            Yearly
          </div>
          <div
            class="glider w-[50%] transition-all absolute h-full bg-primary-500 rounded-lg z-0"
            :class="duration === 'month' ? 'left-0' : 'left-1/2'"
          />
        </div>
      </div>
      <div class="mt-12">
        <div class="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div
            v-for="(item, i) in options"
            :key="i"
            class="rounded-m cursor-pointer p-4"
          >
            <div class="mb-2">
              <div class="inline-block rounded-full text-slate-400">
                <div class="text-3xl" :class="item.icon" />
              </div>
            </div>
            <div class="font-medium">
              {{ item.title }}
            </div>
            <div class="text-sm text-slate-500 mt-2">
              {{ item.description }}
            </div>
            <div class="price flex my-2 items-center">
              <div class="font-bold text-4xl">
                ${{ item.pricing[duration] }}
              </div>
              <div class="leading-1 text-[10px] ml-2">
                <div>per</div>
                <div>{{ duration }}</div>
              </div>
            </div>
            <div class="mt-4">
              <ElButton
                class="font-medium"
                btn="primary"
                format="block"
                :href="item.href"
              >
                Subscribe
              </ElButton>
            </div>
            <div class="mt-8 text-xs">
              <div class="uppercase tracking-wider mb-3 text-[10px]">
                Includes:
              </div>
              <div class="space-y-2">
                <div
                  v-for="(feat, i) in item.features"
                  :key="i"
                  class="flex space-x-2"
                >
                  <div class="i-carbon-checkmark" />
                  <div>{{ feat }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-6">
          <div class="text-xs text-slate-500">
            As seen in
          </div>
          <div>
            <a href="https://www.nytimes.com" class="w-40 inline-block"><img :src="nyTimes"></a>
          </div>
        </div>
      </div>
    </div>
  </ElModal>
</template>

<style>
.nyfill {
  fill: "#000";
}
</style>
