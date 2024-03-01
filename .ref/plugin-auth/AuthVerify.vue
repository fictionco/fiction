<script lang="ts" setup>
// eslint-disable import/no-extraneous-dependencies
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import { emitEvent, vue } from '../utils'
import { useService } from '../inject'
import type { FactorRouter } from '../plugin-router'
import type { FactorUser } from '../plugin-user'
import RegisterWrap from './AuthWrap.vue'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
const form = vue.ref({
  verificationCode: '',
  email: factorUser.activeUser.value?.email ?? '',
})
const formError = vue.ref('')
const sending = vue.ref(true)
const disabled = vue.computed(() => form.value.verificationCode.length !== 6)

const flow = vue.computed(() => factorRouter.query.value.flow ?? 'register')

const email = vue.computed(
  () => factorRouter.query.value.email as string | undefined,
)
const organizationName = vue.computed(
  () => factorRouter.query.value.organizationName as string | undefined,
)
const alreadyRegistered = vue.ref(false)

const subTitle = vue.computed(() => {
  return 'Hey! We sent you a confirmation email. Please enter the code below.'
})

async function handleEmail(action: 'add' | 'remove'): Promise<void> {
  const q = factorRouter.query.value
  if (action === 'remove') {
    await factorRouter.push({
      query: { ...q, email: undefined },
    })
  }
  else if (action === 'add' && form.value.email) {
    await factorRouter.replace({
      query: { ...q, email: form.value.email },
    })
  }
}

async function start(): Promise<void> {
  sending.value = true

  const { email, fullName, organizationName } = factorRouter.query
    .value as Record<string, string>

  if (email) {
    const result = await factorUser.requests.NewVerificationCode.request({
      email,
      organizationName,
      fullName,
    })

    const data = result.data

    if (data?.exists && flow.value === 'register')
      alreadyRegistered.value = true
  }
  else {
    formError.value = 'Please enter your email'
  }
  sending.value = false
}

vue.watch(
  () => factorRouter.query.value.email,
  async (v) => {
    if (v)
      await start()
  },
)

vue.onMounted(async () => {
  await start()
})

async function send(): Promise<void> {
  sending.value = true

  const { verificationCode, email: formEmail } = form.value

  const verifyEmail = email.value || formEmail

  if (!verifyEmail)
    formError.value = 'please enter your email'

  const r = await factorUser.requests.VerifyAccountEmail.request({
    verificationCode,
    email: verifyEmail,
  })

  const q = factorRouter.query.value
  if (r.status === 'success') {
    // await factorUser.requestCurrentUser()

    await factorRouter.goto(
      'authSetPassword',
      {},
      {
        ...q,
        email: verifyEmail,
        code: verificationCode,
        flow: flow.value,
      },
    )
  }
  sending.value = false
}
</script>

<template>
  <RegisterWrap
    title="Verify Email"
    :sub-title="subTitle"
    :loading="sending"
  >
    <div v-if="!email">
      <ElInput
        key="inputEmail"
        v-model="form.email"
        label="Email Address"
        input="InputEmail"
        class="my-6"
        required
        placeholder="Email"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElButton
        format="block"
        btn="primary"
        size="lg"
        type="submit"
        @click.prevent="handleEmail('add')"
      >
        Continue &rarr;
      </ElButton>
    </div>

    <ElForm
      v-else
      :notify="formError"
      @submit="send()"
    >
      <ElInput
        id="input-verify"
        key="inputVerify"
        v-model="form.verificationCode"
        label="Verification Code"
        sub-label="This helps us make sure you're a real person."
        input="InputText"
        autocomplete="one-time-code"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="******"
        class="my-6"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />
      <div class="action">
        <ElButton
          id="verify-button"
          format="block"
          btn="primary"
          type="submit"
          :class="disabled ? 'opacity-80 cursor-not-allowed' : ''"
          :disabed="disabled"
        >
          Verify Email
        </ElButton>
      </div>
    </ElForm>

    <template #footer>
      <div class="flex justify-center space-x-6">
        <a
          class="hover:text-primary-500 cursor-pointer"
          @click.prevent="handleEmail('remove')"
        >Resend Code</a>

        <router-link
          class="hover:text-primary-500"
          :to="factorRouter.link('authLogin').value"
        >
          Login
        </router-link>
      </div>
    </template>
  </RegisterWrap>
</template>
