<script lang="ts" setup>
import { vue } from '@factor/api'

const selectedItem = vue.ref(-1)
const items = vue.computed(() => {
  return [
    {
      name: 'Is there a free plan?',
      desc: [
        `Yes, just by signing up you get 200 message credits and 1 chatbot. This is a great way to get started and test out the platform.`,
      ],
    },
    {
      name: 'How do I add my data?',
      desc: [
        'Just add your website URL and we\'ll do the rest!',
        'Alternatively you can directly input your data via text',
      ],
    },
    {
      name: 'How do message credits work?',
      desc: [`One AI response costs 1 message credit.`],
    },
    {
      name: 'How are payments handled?',
      desc: [
        `We process all payments via Stripe and offer payment via all major credit card providers.`,
      ],
    },
    {
      name: 'How many people can use my chat agents?',
      desc: [
        'You can add your agents publicly to your website or other digital assets. For management of your data sources and messages, you can add additional team members to your organization.',
      ],
    },

    {
      name: 'Can I change plans at any time?',
      desc: ['Sure, you can upgrade and downgrade plans at any time.'],
    },
    {
      name: 'Can I cancel at anytime?',
      desc: ['Yes! We provide hassle free cancellation.'],
    },
  ]
})

function toggle(index: number) {
  if (selectedItem.value === index)
    selectedItem.value = -1
  else
    selectedItem.value = index
}
</script>

<template>
  <div class="text-theme-800 mx-auto max-w-screen-md">
    <div
      class="bg-theme-0 ring-theme-200 my-24 rounded-md px-12 py-8 ring-2 md:py-12"
    >
      <div class="flex items-center justify-between space-x-12">
        <div class="">
          <div class="font-brand text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </div>
          <div class="font-brand mt-4 text-3xl">
            Here are some answered to commonly asked questions. Contact us with
            special concerns.
          </div>
        </div>
      </div>
      <div>
        <dl class="divide-theme-200 mt-10 space-y-6 divide-y">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="pt-6"
          >
            <dt>
              <!-- Expand/collapse question button -->
              <button
                type="button"
                class="text-theme-900 flex w-full items-start justify-between text-left"
                aria-controls="faq-0"
                aria-expanded="false"
                @click.stop.prevent="toggle(i)"
              >
                <span class="text-base font-bold leading-7">{{
                  item.name
                }}</span>
                <span class="ml-6 flex h-7 items-center">
                  <!--
                    Icon when question is collapsed.

                    Item expanded: "hidden", Item collapsed: ""
                  -->
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                  <!--
                    Icon when question is expanded.

                    Item expanded: "", Item collapsed: "hidden"
                  -->
                  <svg
                    class="hidden h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M18 12H6"
                    />
                  </svg>
                </span>
              </button>
            </dt>
            <dd
              v-if="selectedItem === i"
              id="faq-0"
              class="mt-2 pl-2 pr-12"
            >
              <p
                v-for="(line, ii) in item.desc"
                :key="ii"
                class="text-theme-600 my-2 text-base leading-7"
                v-html="line"
              />
            </dd>
          </div>

          <!-- More questions... -->
        </dl>
      </div>
    </div>
  </div>
</template>
