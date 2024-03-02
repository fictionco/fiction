<script lang="ts" setup>
import { dayjs, vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { useSiteService } from '../../../www/src/inject'
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
      'Subscribe now and lock in your early bird price. Pro Team allows a team of 10 people.  Save 50% when paying yearly.',
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
      productKey: 'proBusiness',
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
          class="bg-theme-100 relative mx-auto mt-6 grid w-72 select-none grid-cols-2 self-center rounded-lg p-0.5 text-sm font-medium uppercase tracking-wide sm:mt-8"
        >
          <div
            class="z-10 cursor-pointer p-2"
            :class="duration === 'month' ? 'text-white' : 'text-theme-500'"
            @click="duration = 'month'"
          >
            Monthly
          </div>
          <div
            class="z-10 cursor-pointer p-2"
            :class="duration === 'year' ? 'text-white' : 'text-theme-500'"
            @click="duration = 'year'"
          >
            Yearly
          </div>
          <div
            class="glider absolute z-0 h-full w-[50%] rounded-lg bg-primary-500 transition-all"
            :class="duration === 'month' ? 'left-0' : 'left-1/2'"
          />
        </div>
      </div>
      <div class="mt-12">
        <div class="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          <div
            v-for="(item, i) in options"
            :key="i"
            class="rounded-m cursor-pointer p-4"
          >
            <div class="mb-2">
              <div class="text-theme-400 inline-block rounded-full">
                <div class="text-3xl" :class="item.icon" />
              </div>
            </div>
            <div class="font-medium">
              {{ item.title }}
            </div>
            <div class="text-theme-500 mt-2 text-sm">
              {{ item.description }}
            </div>
            <div class="price my-2 flex items-center">
              <div class="text-4xl font-bold">
                ${{ item.pricing[duration] }}
              </div>
              <div class="leading-1 ml-2 text-[10px]">
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
              <div class="mb-3 text-[10px] uppercase tracking-wider">
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
        <div class="mt-6 text-center">
          <div class="text-theme-500 text-xs">
            As seen in
          </div>
          <div>
            <a
              href="https://www.nytimes.com/2022/10/21/technology/generative-ai.html"
              class="inline-block w-40"
              target="_blank"
            >
              <img :src="nyTimes"></a>
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
