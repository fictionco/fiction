<script lang="ts" setup>
import { formatNumber, vue } from '@factor/api'
import { setPageMode } from '../util'
import GridBg from '../ui/EffectGridBg.vue'

setPageMode('darkHeader')

const billingCycle = vue.ref<'month' | 'year' | ''>('month')
const plans = vue.ref([
  {
    name: 'Free',
    description: 'Forms, surveys, basic analytics',
    price: 'It\'s <span class=\'text-primary-500\'>free</span>',
    cta: 'Create Account',
    link: 'https://app.kaption.co/register',
    responses: 500,
    events: 50_000,
    sessions: 5000,
    features: ['Custom Dashboards', 'Free widgets'],
  },
  {
    name: 'Pro',
    description: 'More advanced, better customization',
    price: 'Starts at <span class=\'text-primary-500\'>$25/mo</span>',
    cta: 'Start 14-Day Trial',
    link: 'https://app.kaption.co/register?plan=pro',
    responses: 1000,
    events: 200_000,
    sessions: 20_000,
    features: [
      'Behavioral Tracking',
      'Replays',
      'Heatmaps',
      'Custom Dashboards',
      'Free/Pro Widgets',
    ],
  },

  {
    name: 'Pro Business',
    description: 'Enterprise-grade features and customization.',
    price: 'Starts at <span class=\'text-primary-500\'>$99/mo</span>',
    cta: 'Start 14-Day Trial',
    link: 'https://app.kaption.co/register?plan=business',
    responses: 5000,
    events: 1_000_000,
    sessions: 100_000,
    features: [
      'All Pro Features',
      'Kaption Frontline',
      'Review Management',
      'User Generated Content',
      'Support Tools',
    ],
  },
])

interface PageItem {
  title: string
  description: string
  path?: string
  icon?: string
  button?: { text: string, href?: string, to?: string }
}

const faqs = vue.ref<PageItem[]>([
  {
    title: 'How do I use Kaption?',
    description:
      'Kaption is either installed on your website or setup and linked to directly. In most cases, you use it like Google Analytics or any other tracking script. Just add a small piece of code to your site via tag manager or html.',
  },
  {
    title: 'Does Kaption help [my type of business]?',
    description:
      'Probably! Kaption works best with businesses that have websites and use them to manage part of the user experience.',
  },
  {
    title: 'Is Kaption free?',
    description:
      'Yes, Kaption offers a free forms and analytics package. The free plan includes many useful features for most businesses.',
  },

  {
    title: 'Does Kaption play well with user privacy?',
    description:
      'Kaption is compliant with current laws regarding user privacy. It is fully compliant with GDPL and other statutes.',
  },
  {
    title: 'What exactly is Kaption?',
    description:
      'Kaption combines data tools with management tools to help businesses execute (way) more efficiently.',
  },
  {
    title: 'Can I get my money back after I pay for the Pro solution?',
    description:
      'Yes, Kaption offers a no-questions-asked satisfaction guarantee.',
  },
])
</script>

<template>
  <div class="view-pricing overflow-x-hidden">
    <div
      class="relative z-0 border-b border-slate-300 bg-gradient-to-br from-slate-900 via-black to-slate-900 pt-32 text-white"
    >
      <div class="relative z-10 mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
        <div class="sm:align-center sm:flex sm:flex-col">
          <h1 class="text-5xl font-bold tracking-tight sm:text-center">
            Plans &amp; Pricing
          </h1>
          <p class="mt-5 text-xl sm:text-center">
            Pro packages start at $25/month or try Kaption
            <a href="https://app.kaption.co/register" class="underline">free</a>
          </p>
        </div>
      </div>
      <GridBg />
    </div>

    <div class="relative mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
      <div
        class="-mt-16 space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 md:grid-cols-3 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none"
      >
        <div
          v-for="(plan, i) in plans"
          :key="i"
          class="plan-shadow divide-y divide-slate-200 rounded-lg bg-white"
        >
          <div class="p-6">
            <h2 class="text-lg font-bold">
              {{ plan.name }}
            </h2>
            <p class="text-theme-500 h-8 text-sm">
              {{ plan.description }}
            </p>
            <p class="mt-8">
              <span
                class="text-xl font-bold tracking-tight text-primary-300 xl:text-xl"
                v-html="plan.price"
              />
            </p>
            <a
              href="#"
              class="bg-theme-800 hover:bg-theme-900 mt-8 block w-full space-x-2 rounded-md border border-slate-800 py-2 text-center text-sm font-medium text-white"
            ><span>{{ plan.cta }}</span>
              <span class="text-theme-400">&rarr;</span>
            </a>
          </div>
          <div class="px-6 pt-6 pb-8">
            <h3 class="text-sm font-medium">
              What's included
            </h3>

            <ul role="list" class="mt-6 space-y-4">
              <li class="flex items-center space-x-3">
                <div
                  class="i-carbon-document-import text-xl text-green-500"
                />
                <div class="">
                  {{ formatNumber(plan.responses) }} Responses
                </div>
              </li>
              <li class="flex items-center space-x-3">
                <div
                  class="i-carbon-user-activity text-xl text-green-500"
                />
                <div class="">
                  {{ formatNumber(plan.sessions) }} Tracked Users
                </div>
              </li>
              <li class="flex items-center space-x-3">
                <div class="i-carbon-activity text-xl text-green-500" />
                <div class="">
                  {{ formatNumber(plan.events) }} Analytics Events
                </div>
              </li>
              <li
                v-for="(feature, ii) in plan.features"
                :key="ii"
                class="flex space-x-3"
              >
                <div class="i-carbon-checkmark text-xl text-green-500" />
                <span class="text-theme-500 text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- FAQ -->
    <section
      class="mx-auto max-w-md divide-y-2 divide-slate-200 py-24 px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:py-32 lg:px-8"
      aria-labelledby="faq-heading"
    >
      <h2 id="faq-heading" class="text-3xl font-extrabold">
        Frequently answered questions
      </h2>
      <div class="mt-6 pt-10">
        <dl
          class="space-y-10 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 md:space-y-0"
        >
          <div v-for="(faq, i) in faqs" :key="i">
            <dt class="text-xl font-medium">
              {{ faq.title }}
            </dt>
            <dd class="text-theme-500 mt-2 text-base">
              {{ faq.description }}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style lang="less">
.plan-shadow {
  box-shadow: var(--cardShadowSmall);
}
</style>
