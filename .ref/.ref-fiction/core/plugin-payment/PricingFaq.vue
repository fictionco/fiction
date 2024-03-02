<script lang="ts" setup>
import { vue } from '@factor/api'
import ContentBox from '../ui/ContentBox.vue'

const selectedItem = vue.ref(-1)
const items = vue.computed(() => {
  return [
    {
      name: 'What happens if I hit my plan\'s server time limit?',
      desc: [
        `If you hit the server time limit associate with your plan, you can do one of two things:`,
        `A. You can upgrade to a higher pricing tier.`,
        `B. You can wait until the next billing cycle to continue using the service. If you choose option B, you won't be able to continue using the service until the end of the billing cycle. If you choose option A, you will be able to continue using the service immediately.`,
      ],
    },
    {
      name: 'Does is cost anything to add people to my organization?',
      desc: [
        `If you are on the pro plan (or higher) then you can add unlimited members to your organization. If you are on the standard plan, you can add up to 5 members to your organization. If you need to add more members to your organization, you can upgrade to a higher pricing tier.`,
      ],
    },
    {
      name: 'What is Fiction\'s refund policy?',
      desc: [
        `During your 5-day free trial, make an informed decision if Fiction meets your expectations.`,
        `Please be aware that, due to the costs associated with reserving dedicated servers from our infrastructure providers, most transactions are considered final.`,
        `However, we do understand that your content requirements may evolve, and we are more than happy to assist you with any upgrades, downgrades, or cancellations as needed.`,
      ],
    },
    {
      name: 'What is Fiction\'s AI technology based on?',
      desc: [
        'Fiction is focused on open-source AI tools like Stable Diffusion and similar models. We use a proprietary Python based server called \'AIM\' which stands for \'Artificial Intelligence Machine\'.',
      ],
    },
    {
      name: 'What are the available payment methods?',
      desc: [
        'Fiction supports all major credit cards and debit cards. We secure your payment method with a 3D secure authentication for your privacy and protection. Fiction does not accept Paypal, prepaid cards, or other cash apps at this time.',
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
    <ContentBox wrap-class="py-8 px-12 md:py-12 ">
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
    </ContentBox>
  </div>
</template>
