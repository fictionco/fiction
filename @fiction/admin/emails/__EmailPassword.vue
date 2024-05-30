<script setup lang="ts">
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
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
  password: '',
})

async function sendRequest() {
  await props.action.requestTransaction(form.value)
}

vue.onMounted(() => {
})
</script>

<template>
  <ElForm class="mx-auto max-w-xs min-h-[50dvh] py-12" @submit="sendRequest()">
    <div class="mb-8 text-left md:text-center">
      <h1 class="x-font-title text-2xl font-bold tracking-tight">
        Set Your Password
      </h1>
    </div>
    <div data-test-id="set-password-form">
      <ElInput
        :value="form.email"
        class="my-6"
        input="InputEmail"
        label="Email Address"
        autocomplete="username"
        placeholder="Email"
        disabled
      />

      <ElInput
        key="inputPassword"
        :value="form.password"
        class="my-6"
        input="InputPassword"
        label="Create Password"
        sub-label="Minimum 6 characters"
        autocomplete="new-password"
        placeholder="Password"
        required
      />

      <div class="action">
        <ElButton
          format="block"
          btn="primary"
          type="submit"
          size="lg"
        >
          Set Password
        </ElButton>
      </div>
    </div>
  </ElForm>
</template>
