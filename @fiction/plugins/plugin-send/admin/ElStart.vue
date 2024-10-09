<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionSend } from '..'
import type { EmailCampaignConfig } from '../schema'
import { useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { manageEmailCampaign } from '../utils'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const { fictionSend } = useService<{ fictionSend: FictionSend }>()

const form = vue.ref<Partial<EmailCampaignConfig>>({
  title: '',
})
const isLoading = vue.ref(false)

async function start() {
  isLoading.value = true
  try {
    const fields = form.value
    const [_email] = await manageEmailCampaign({ fictionSend, params: { _action: 'create', fields: [fields] } })
    await props.card.goto(`/manage-campaign?campaignId=${_email?.campaignId}`)
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
        name: 'Send a New Email',
        desc: 'Give it a name...',
        key: 'name',
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
      <div v-if="step.key === 'name'" class="">
        <ElInput
          v-model="form.title"
          input="InputText"
          placeholder="Internal Title"
          ui-size="lg"
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
