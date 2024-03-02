<script lang="ts" setup>
import { emitEvent, useService, vue } from '@fiction/core'
import { googleOneTap } from '@fiction/core/plugin-user/google'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElSpinner from '@fiction/ui/ElSpinner.vue'

const props = defineProps({
  form: { type: Object as vue.PropType<AuthForm>, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'update:mode', payload: Modes): void
  (event: 'update:form', payload: AuthForm): void
  (event: 'signedIn', payload: AuthForm): void
}>()

const { factorUser } = useService()

type Modes = 'login' | 'register' | 'setPassword' | 'verify' | 'resetPassword'
interface AuthForm {
  email?: string
  password?: string
  fullName?: string
  tos?: boolean
  code?: string
  orgName?: string
  flow?: string
  isNewUser?: boolean
}
async function handleEmit(key: string, value: unknown): Promise<void> {
  emit('update:form', { ...props.form, [key]: value })
}

const sending = vue.ref(false)
const isSendingGoogleAuth = vue.ref(false)
const formError = vue.ref('')

async function sendAuth(): Promise<void> {
  sending.value = true
  formError.value = ''
  const { email, password } = props.form

  if (!email) {
    formError.value = 'Please enter your email'
    return
  }
  if (!password) {
    formError.value = 'Please enter your password'
    return
  }
  const r = await factorUser.requests.Login.request({
    email,
    password,
    createOnEmpty: true,
  })

  if (r.status === 'success') {
    if (r.user?.emailVerified) {
      emit('signedIn', props.form)
    }
    else {
      emit('update:form', { ...props.form, isNewUser: true, flow: 'register' })
      emit('update:mode', 'verify')
    }
  }

  sending.value = false
}

async function showGoogle() {
  await googleOneTap({
    autoSignIn: false,
    promptParentId: 'google-signin-prompt',
    showPrompt: false,
    factorUser,
    isSending: isSendingGoogleAuth,
    callback: async (r) => {
      const email = r.user?.email
      if (email) {
        emit('signedIn', {
          ...props.form,
          flow: r.isNew ? 'register' : 'login',
          isNewUser: r.isNew,
          email,
        })
      }
    },
  })
}

vue.onMounted(async () => {
  await factorUser.userInitialized()
  await showGoogle()
})
</script>

<template>
  <div :class="sending || isSendingGoogleAuth ? 'opacity-20' : ''">
    <div class="pb-24 md:pb-8">
      <div class="account-services text-center" data-test="google-button">
        <div
          id="google-signin-button"
          class="flex w-full justify-start text-left md:justify-center md:text-center"
        />
      </div>
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-slate-200" />
        </div>
        <div class="relative flex justify-center">
          <span class="text-theme-400 bg-white px-2 text-sm"> or </span>
        </div>
      </div>
      <ElForm
        :notify="formError"
        class="space-y-6"
        @submit="sendAuth()"
      >
        <ElInput
          id="input-email"
          :value="form.email"
          label="Your Email"
          input="InputEmail"
          required
          placeholder="Email"
          @input="handleEmit('email', $event.target.value)"
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElInput
          key="inputPassword"
          :value="form.password"
          class="my-6"
          input="InputPassword"
          label="Create Password"
          sub-label="Minimum 6 characters"
          autocomplete="current-password"
          placeholder="Password"
          required
          @input="handleEmit('password', $event.target.value)"
          @keyup.enter.stop="emitEvent('submit')"
        />

        <div class="action text-center">
          <ElButton
            id="email-signin-button"
            btn="primary"
            format="block"
            :loading="sending"
          >
            Create Account &rarr;
          </ElButton>
        </div>
        <div class="text-xs">
          By creating an account, you agree to the
          <a
            class="text-primary-700"
            href="#"
            target="_blank"
          >terms</a>
          and
          <a
            class="text-primary-700"
            href="#"
            target="_blank"
          >privacy policy</a>.
        </div>
      </ElForm>

      <div class="form-footer mt-6 text-center text-xs font-medium">
        <div class="flex justify-center space-x-6">
          <a
            class="hover:text-theme-500 text-theme-600 ml-1 cursor-pointer"
            @click.prevent="emit('update:mode', 'resetPassword')"
          >Reset Password</a>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="loading"
    class="text-theme-300 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
  >
    <ElSpinner class="h-10 w-10" />
  </div>
</template>
