<script lang="ts" setup>
import { vue } from '@factor/api'

const selectedItem = vue.ref(-1)
const items = vue.computed(() => {
  return [
    {
      name: 'How does billing work?',
      desc: [
        `During the planning phase we'll identify the scope of work and estimate the number of hours required to complete the project. We'll then create a custom plan for you that includes a fixed number of billable hours. `,
      ],
    },
    {
      name: 'Who pays for infrastructure and 3rd party services?',
      desc: [
        `To prevent any vendor lock-in, you do. All infrastructure and cloud costs are still under your payment method of choice. If we recommend a 3rd party service, you'll signup, provide your own billing details, and then give us credentials/access to the service.`,
      ],
    },
    {
      name: 'How are payments handled?',
      desc: [
        `We process all payments via Stripe and offer two payment options.`,
        `- ACH debit bank transfer. (US only)`,
        `- All major credit cards. Note, there is a 3% processing fee for credit card transactions.`,
      ],
    },
    {
      name: 'What happens if I go over my plans included hours?',
      desc: [
        'After you\'ve utilized your plans included hours, you will be billed at your plans billable hourly rate above.',
      ],
    },
    {
      name: 'Do you have smaller plans with less billable hours?',
      desc: [
        'Unfortunately no. The standard plan is the smallest plan we can offer while maintaining a high level of quality service.',
      ],
    },
    {
      name: 'Can I change plans at any time?',
      desc: [
        'Sure, you can upgrade and downgrade plans at any time we only ask for 30 days notice when downgrading.',
      ],
    },
    {
      name: 'Can I cancel at anytime?',
      desc: [
        'We require a three month commitment at the start, but after that all of our plans are month-to-month so you may cancel at any time. As a courtesy, we can provide a detailed "exit briefing" to the new party taking over.',
      ],
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
  <div class="mx-auto max-w-screen-md">
    <div wrap-class="py-8 px-12 md:py-12 ">
      <div class="flex items-center justify-between space-x-12">
        <div class="">
          <div class="text-2xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </div>
          <div class="text-theme-400 mt-4 text-xl font-medium">
            Here are some answers to commonly asked questions. Please reach out
            if you have special concerns.
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
              v-show="selectedItem === i"
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
        </dl>
      </div>
    </div>
  </div>
</template>
