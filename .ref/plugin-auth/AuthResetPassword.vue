<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import { emitEvent, vue } from '@factor/api/utils'
import type { FactorRouter } from '@factor/api/plugin-router'
import { useService } from '@factor/api/inject'
import RegisterWrap from './AuthWrap.vue'

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()
const form = vue.ref({ email: '' })
const sending = vue.ref(false)
const formError = vue.ref('')

const disabled = vue.computed(() => !form.value.email)

async function send(): Promise<void> {
  sending.value = true

  formError.value = ''
  const { email } = form.value

  if (!email)
    formError.value = 'Please enter your email'

  await factorRouter.goto('authVerify', {}, { email, flow: 'reset' })
  sending.value = false
}
</script>

<template>
  <RegisterWrap
    title="Reset Password"
    sub-title="We'll email you a verification code"
    :loading="sending"
  >
    <template #footer>
      Return to
      <router-link to="/login" class="text-primary-500 hover:text-primary-400">
        Login &rarr;
      </router-link>
    </template>
    <ElForm :notify="formError" @submit="send()">
      <ElInput
        key="inputEmail"
        v-model="form.email"
        label="Email"
        class="my-6"
        input="InputEmail"
        required
        placeholder="Email"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <div class="action">
        <ElButton
          type="submit"
          format="block"
          btn="primary"
          :class="disabled ? 'cursor-not-allowed' : ''"
          :disabed="disabled"
        >
          Continue
        </ElButton>
      </div>
    </ElForm>
  </RegisterWrap>
</template>
