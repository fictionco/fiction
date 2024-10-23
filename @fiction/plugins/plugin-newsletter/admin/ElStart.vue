<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionNewsletter } from '..'
import type { EmailCampaignConfig } from '../schema'
import { dayjs, toLabel, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { manageEmailCampaign } from '../utils'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const { fictionNewsletter } = useService<{ fictionNewsletter: FictionNewsletter }>()

const form = vue.ref<Partial<EmailCampaignConfig>>({
  title: '',
})
const isLoading = vue.ref(false)

async function start() {
  isLoading.value = true
  try {
    const fields = form.value
    const [_email] = await manageEmailCampaign({ fictionNewsletter, params: { _action: 'create', fields: [fields] } })
    await props.card.goto(`/manage-newsletter?campaignId=${_email?.campaignId}`)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        name: 'Create New Email',
        desc: 'Give it a name...',
        key: 'emailTitle',
        class: 'max-w-lg',
        isNeeded: true,
        onClick: () => start(),
      },
    ]

    return out
  }),
}
</script>

<template>
  <ElModal
    modal-class="max-w-screen-md"
    style-class="pointer-events-none"
    :vis="vis"
    @update:vis="emit('update:vis', $event)"
  >
    <ElStepNav v-slot="{ step }" :step-config="stepConfig">
      <div v-if="step.key === 'emailTitle'" class="">
        <ElInput
          v-model="form.title"
          data-test-id="email-title-input"
          input="InputText"
          :placeholder="`Title (e.g. '${toLabel(dayjs().format('MMM'))} Newsletter')`"
          ui-size="lg"
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
