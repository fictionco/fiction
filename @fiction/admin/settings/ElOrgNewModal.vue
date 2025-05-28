<script lang="ts" setup>
import type { ClickCallbackArgs } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { useService, vue, vueRouter } from '@fiction/core'
import FormEngineModal from '@fiction/ui/inputs/FormEngineModal.vue'

import { createOption } from '@fiction/ui/inputs/index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, required: true },
})

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

const { fictionUser } = useService()

const router = vueRouter.useRouter()
const form = vue.ref({
  orgName: '',
  orgEmail: '',
})
const formError = vue.ref('')
const sending = vue.ref(false)

vue.onMounted(async () => {
  await fictionUser.userInitialized({ caller: 'ViewNewOrganization' })
})

function closeModal() {
  emit('update:vis', false)
}

async function send(args: ClickCallbackArgs): Promise<void> {
  const { validate } = args.context || {}

  if (validate && !validate({ reportValidity: true })) {
    formError.value = 'Please fill out all required fields'
    return
  }

  sending.value = true

  const { orgName, orgEmail } = form.value

  const userId = fictionUser.activeUser.value?.userId

  if (!userId)
    throw new Error('userId is missing')

  const r = await fictionUser.requests.ManageOrganization.request({
    userId,
    fields: { orgName, orgEmail, needsOnboarding: true },
    _action: 'create',
  })

  if (r.status === 'success') {
    const orgId = r.data?.orgId
    await router.push(props.card.link(`/settings/manage-organizations?orgId=${orgId}`))
    closeModal()
  }
  sending.value = false
}

const options = vue.computed(() => {
  return [
    createOption({
      key: 'orgName',
      label: 'Title',
      input: 'InputText',
      placeholder: 'My Workspace',
      isRequired: true,
    }),
    createOption({
      key: 'orgEmail',
      label: 'Primary Email',
      subLabel: 'Used for notifications and billing',
      placeholder: 'Enter an email address',
      input: 'InputEmail',
      isRequired: true,
    }),
  ]
})

const buttons = vue.computed(() => {
  return [
    {
      testId: 'create-workspace-button',
      label: 'Create New Workspace',
      theme: 'primary' as const,
      onClick: send,
      loading: sending.value,
    },
  ]
})
</script>

<template>
  <FormEngineModal
    v-model="form"
    :vis
    :options
    title="Create New Workspace',"
    sub-title="Enter the details"
    :buttons="buttons"
    @update:vis="closeModal"
  />
</template>
