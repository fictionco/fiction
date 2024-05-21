<script setup lang="ts">
import type { Card } from '@fiction/site'
import { type EndpointResponse, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import type { FictionAdmin } from '..'

type VerifyEmailAction = FictionAdmin['emailActions']['verifyEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<VerifyEmailAction>, required: true },
  vars: { type: Object as vue.PropType<Record<string, any>>, required: true },
})

const form = vue.ref({
  email: '',
  code: '',
})

const sending = vue.ref(true)
const response = vue.ref<EndpointResponse>()

async function sendRequest() {
  response.value = await props.action.requestEndpoint(form.value)

  sending.value = false
}

vue.onMounted(async () => {
  form.value = {
    email: props.vars.email,
    code: props.vars.code,
  }

  await sendRequest()
})
</script>

<template>
  <div
    v-if="sending"
    class="text-theme-300 dark:text-theme-600 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
  >
    <ElSpinner class="h-10 w-10" />
  </div>
  <div v-else-if="response?.status === 'success'">
    Verified
  </div>
  <div v-else>
    {{ response?.message }}
  </div>
</template>
