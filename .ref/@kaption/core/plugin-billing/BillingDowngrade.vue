<script lang="ts" setup>
import { onResetUi, resetUi, vue } from '@factor/api'

import ElemModal from '@factor/ui/ElModal.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '../ui/ElButton.vue'
import { useKaption } from '../utils'

const { factorStripe, kaptionBilling } = useKaption()

const form = vue.ref<{
  downgradeReason: string
}>({
  downgradeReason: '',
})

const vis = vue.ref(false)
const step = vue.ref('')
const isValid = vue.ref<boolean>(false)
const sending = vue.ref(false)

onResetUi(() => (step.value = 'one'))

const warnings = vue.ref([
  {
    name: 'You\'ll be limited to 5,000 monthly sessions.',
  },
  {
    name: 'You will lose access to all professional features and support.',
  },
  {
    name: 'Data will no longer be collected for professional features.',
  },
])

async function downgradeOrganization(): Promise<void> {
  sending.value = true

  if (!kaptionBilling.activeSubscription.value?.id)
    throw new Error('activeSubscription required')

  if (!kaptionBilling.activeCustomerId.value)
    throw new Error('activeCustomerId required')

  await factorStripe.requests.ManageSubscription.request({
    subscriptionId: kaptionBilling.activeSubscription.value?.id,
    note: form.value.downgradeReason,
    _action: 'delete',
    customerId: kaptionBilling.activeCustomerId.value,
  })
  sending.value = false
  vis.value = false
  resetUi({ scope: 'all', cause: 'downgradeOrganization' })
}

async function cancel(): Promise<void> {
  vis.value = false
  step.value = 'one'
}
</script>

<template>
  <ElemModal>
    <div v-if="step === 'two'">
      <h2 class="text-xl font-semibold">
        Downgrade Organization
      </h2>
      <p class="text-theme-500 mt-2">
        Before we downgrade your account, could you tell us why the plan didn’t
        work out?
      </p>

      <ElForm
        v-model:valid="isValid"
        :data="form"
        @submit="downgradeOrganization()"
      >
        <ElInput
          v-model="form.downgradeReason"
          input="InputRadio"
          class="text-sm font-medium text-gray-500"
          :list="[
            {
              value: 'setup',
              name: 'Setup - I wasn’t able to implement the service.',
            },
            {
              value: 'adoption',
              name: `Adoption - I set it up, but didn’t get as much value as I hoped.`,
            },
            {
              value: 'product',
              name: `Product - I ultimately wasn't happy with how the product worked.`,
            },
            {
              value: 'company_issues',
              name: `Company issues - Our company/product is not doing well.`,
            },
            {
              value: 'found_better_solution',
              name: `Found a better solution - We found a better solution.`,
            },
            {
              value: 'expensive',
              name: `Expensive - The price was too high for me.`,
            },
            {
              value: 'other',
              name: `Other`,
            },
          ]"
          required
        />

        <div class="mt-6 flex justify-end border-t border-slate-200 pt-4">
          <ElButton btn="default" @click.stop="cancel()">
            Cancel
          </ElButton>
          <ElButton
            class="my-0 ml-2"
            input="submit"
            :loading="sending"
          >
            Downgrade Organization
          </ElButton>
        </div>
      </ElForm>
    </div>
    <div v-else>
      <div>
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
        >
          <svg
            class="h-6 w-6 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      <div class="py-3">
        <h2 class="text-xl font-semibold">
          Downgrade Organization
        </h2>
        <p class="text-theme-500 mt-2">
          As you downgrade your organization plan, there are a few changes we
          want to make sure you are aware of:
        </p>

        <div class="mt-6">
          <dl class="divide-y divide-slate-200 border-y border-slate-200">
            <div
              v-for="(f, i) in warnings"
              :key="i"
              class="flex justify-between py-3 text-sm font-medium"
            >
              <dt class="flex items-center text-gray-500">
                <div class="shrink-0">
                  <svg
                    class="mr-2 h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                {{ f.name }}
              </dt>
            </div>
          </dl>
          <div class="text-theme-500 mt-6">
            This is not something that can be undone, are you sure you want to
            continue?
          </div>

          <div class="mt-6 flex justify-end border-t border-slate-200 pt-4">
            <ElButton btn="default" @click.stop="cancel()">
              Cancel
            </ElButton>
            <ElButton
              class="ml-4"
              btn="slate"
              @click.stop="step = 'two'"
            >
              Continue
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </ElemModal>
</template>
