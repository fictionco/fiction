<script lang="ts" setup>
import type {
  FactorUser,
} from '@factor/api'
import {
  emitEvent,
  useService,
  vue,
} from '@factor/api'
import { googleOneTap } from '@factor/api/plugin-user/google'
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'

const props = defineProps({
  viewId: { type: String as vue.PropType<Modes>, required: true },
  form: { type: Object as vue.PropType<AuthForm>, required: true },
  loading: { type: Boolean, default: false },
  termsUrl: { type: String, default: '/terms' },
  privacyUrl: { type: String, default: '/privacy' },
})

const emit = defineEmits<{
  (event: 'update:viewId', payload: Modes): void
  (event: 'update:form', payload: AuthForm): void
  (event: 'signedIn', payload: AuthForm): void
}>()

const { factorUser } = useService<{ factorUser: FactorUser }>()

type Modes = 'login' | 'register' | 'setPassword' | 'verify' | 'resetPassword'
type AuthForm = {
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

async function sendRegister() {
  sending.value = true
  emit('update:form', { ...props.form, isNewUser: true, flow: 'register' })
  await createVerification()
  sending.value = false
  emit('update:viewId', 'verify')
}

async function sendVerifyCode(): Promise<void> {
  sending.value = true

  const { code, email } = props.form

  if (!email) {
    formError.value = 'please enter your email'
    return
  }

  if (!code) {
    formError.value = 'no code provided'
    return
  }

  const r = await factorUser.requests.VerifyAccountEmail.request({
    verificationCode: code,
    email,
  })

  if (r.status === 'success')
    emit('update:viewId', 'setPassword')

  sending.value = false
}

async function sendLogin(): Promise<void> {
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
  const r = await factorUser.requests.Login.request({ email, password })

  if (r.status === 'success') {
    if (r.user?.emailVerified) {
      emit('signedIn', props.form)
    }
    else {
      emit('update:form', { ...props.form, isNewUser: true, flow: 'register' })
      emit('update:viewId', 'verify')
    }
  }

  sending.value = false
}

const codeSent = vue.ref(false)

const alreadyRegistered = vue.ref(false)
async function createVerification(): Promise<void> {
  sending.value = true

  const { email, fullName, orgName } = props.form

  if (email) {
    const result = await factorUser.requests.NewVerificationCode.request({
      email,
      orgName,
      fullName,
    })

    const data = result.data

    if (data?.exists)
      alreadyRegistered.value = true

    codeSent.value = true
  }
  else {
    formError.value = 'Please enter your email'
  }
  sending.value = false
}

async function sendNewPassword(): Promise<void> {
  if (!props.form.email) {
    formError.value = 'account email address is missing'
    return
  }

  if (!props.form.code) {
    formError.value = 'verification code is missing'
    return
  }

  if (!props.form.password) {
    formError.value = 'new password missing'
    return
  }

  sending.value = true
  const r = await factorUser.requests.SetPassword.request(
    {
      email: props.form.email,
      password: props.form.password,
      verificationCode: props.form.code,
      isNewUser: props.form.isNewUser,
    },
    { debug: true },
  )

  if (r.status === 'success')
    emit('signedIn', props.form)

  sending.value = false
}
async function sendResetPassword(): Promise<void> {
  sending.value = true

  formError.value = ''
  const { email } = props.form

  if (!email)
    formError.value = 'Please enter your email'

  emit('update:viewId', 'verify')
  sending.value = false
}

async function showGoogle() {
  await googleOneTap({
    autoSignIn: false,
    promptParentId: 'google-signin-prompt',
    showPrompt: false,
    factorUser,
    isSending: isSendingGoogleAuth,
    callback: (r) => {
      const email = r.user?.email
      if (email && r.isNew) {
        if (r.code) {
          emit('update:form', {
            ...props.form,
            flow: 'register',
            isNewUser: true,
            email,
            code: r.code,
          })
          emit('update:viewId', 'setPassword')
        }
        else {
          emit('signedIn', { ...props.form, flow: 'register', isNewUser: true, email })
        }
      }
      else {
        emit('signedIn', { ...props.form, flow: 'login', isNewUser: false, email })
      }
    },
  })
}

vue.onMounted(async () => {
  vue.watch(
    () => props.viewId,
    async (viewId) => {
      await factorUser.userInitialized({ caller: 'AuthForm' })
      await showGoogle()

      if (viewId === 'setPassword' && (!props.form.email || !props.form.code))
        emit('update:viewId', 'verify')
    },
    { immediate: true },
  )
})
</script>

<template>
  <div :class="sending || isSendingGoogleAuth ? 'opacity-20' : ''">
    <div class="mb-12 text-left md:text-center">
      <h1 class="x-font-title text-2xl font-bold tracking-tight">
        <template v-if="viewId === 'register'">
          Create New Account
        </template>
        <template v-else-if="viewId === 'resetPassword'">
          Reset Password
        </template>
        <template v-else-if="viewId === 'setPassword'">
          Create a Password
        </template>
        <template v-else-if="viewId === 'verify'">
          Verify Your Email
        </template>
        <template v-else>
          Login
        </template>
      </h1>

      <h4 class="font-brand mt-2 text-base font-medium">
        <template v-if="viewId === 'register'">
          Have an account?
          <a
            id="to-login"
            class="text-primary-500 hover:text-primary-600 cursor-pointer"
            @click.prevent="emit('update:viewId', 'login')"
          >Login
          </a>
        </template>
        <template v-else-if="viewId === 'resetPassword'">
          We'll send you a verification code
        </template>
        <template v-else-if="viewId === 'verify' && !codeSent">
          Enter the email you used to register.
        </template>
        <template v-else-if="viewId === 'verify'">
          We sent you a confirmation email. Please enter the code below.
        </template>
        <template v-else-if="viewId === 'login'">
          No account?
          <a
            id="to-login"
            class="text-primary-500 hover:text-primary-600 cursor-pointer"
            @click.prevent.stop="emit('update:viewId', 'register')"
          >Create One
          </a>
        </template>
      </h4>
    </div>
    <div class="pb-24 md:pb-8">
      <template v-if="viewId === 'verify'">
        <div v-if="!codeSent">
          <ElInput
            key="inputEmail"
            :value="form.email"
            label="Email Address"
            input="InputEmail"
            class="my-6"
            required
            placeholder="Email"
            @input="handleEmit('email', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <ElButton
            format="block"
            btn="primary"
            type="submit"
            :loading="sending"
            @click.prevent="createVerification()"
          >
            Continue &rarr;
          </ElButton>
        </div>

        <ElForm
          v-else
          :notify="formError"
          @submit="sendVerifyCode()"
        >
          <ElInput
            id="input-verify"
            key="inputVerify"
            :value="form.code"
            label="Verification Code"
            sub-label="This helps us make sure you're a real person."
            input="InputText"
            autocomplete="one-time-code"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="******"
            class="my-6"
            required
            @input="handleEmit('code', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />
          <div class="action">
            <ElButton
              id="verify-button"
              format="block"
              btn="primary"
              type="submit"
              :loading="sending"
              :class="
                !form.code || form.code.length < 6
                  ? 'opacity-80 cursor-not-allowed'
                  : ''
              "
              :disabed="!form.code || form.code.length < 6"
            >
              Verify
            </ElButton>
          </div>
        </ElForm>
      </template>
      <template v-else-if="viewId === 'login'">
        <div class="account-services text-center">
          <div
            id="google-signin-button"
            class="flex w-full justify-start text-left md:justify-center md:text-center"
          />
        </div>
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="border-theme-200 w-full border-t" />
          </div>
          <div class="relative flex justify-center">
            <span class="text-theme-200 bg-white px-2 text-sm italic">
              or
            </span>
          </div>
        </div>
        <ElForm :notify="formError" @submit="sendLogin()">
          <ElInput
            id="input-email"
            key="inputEmail"
            :value="form.email"
            class="my-6"
            label="Email Address"
            input="InputEmail"
            required
            placeholder="Email"
            @input="handleEmit('email', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <ElInput
            id="input-password"
            key="inputPassword"
            :value="form.password"
            class="my-6"
            input="InputPassword"
            label="Password"
            autocomplete="current-password"
            required
            @input="handleEmit('password', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <div class="action">
            <ElButton
              id="email-signin-button"
              type="submit"
              format="block"
              btn="primary"
              :loading="sending"
            >
              Login
            </ElButton>
          </div>
        </ElForm>
      </template>
      <template v-else-if="viewId === 'register'">
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
            <span class="text-theme-400 bg-white px-2 text-sm italic">
              or
            </span>
          </div>
        </div>
        <ElForm
          :notify="formError"
          class="space-y-6"
          @submit="sendRegister()"
        >
          <ElInput
            id="input-name"
            :value="form.fullName"
            label="Your Name"
            input="InputText"
            required
            placeholder="Name"
            @input="handleEmit('fullName', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

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
            id="input-org-name"
            :value="form.orgName"
            label="Organization"
            input="InputText"
            placeholder="Company"
            @input="handleEmit('orgName', $event.target.value)"
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
              class="text-primary-500"
              :href="termsUrl"
              target="_blank"
            >terms</a>
            and
            <a
              class="text-primary-500"
              :href="privacyUrl"
              target="_blank"
            >privacy policy</a>.
          </div>
        </ElForm>
      </template>
      <template v-else-if="viewId === 'setPassword'">
        <ElForm :notify="formError" @submit="sendNewPassword()">
          <ElInput
            :value="form.email"
            class="my-6"
            input="InputEmail"
            label="Email Address"
            autocomplete="username"
            placeholder="Email"
            disabled
            @input="handleEmit('email', $event.target.value)"
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
            @input="handleEmit('password', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <div class="action">
            <ElButton
              format="block"
              btn="primary"
              type="submit"
              :loading="sending"
              :class="
                form.password && form.password.length < 6
                  ? 'opacity-80 cursor-not-allowed'
                  : ''
              "
            >
              Set Password
            </ElButton>
          </div>
        </ElForm>
      </template>
      <template v-else-if="viewId === 'resetPassword'">
        <ElForm :notify="formError" @submit="sendResetPassword()">
          <ElInput
            key="inputEmail"
            :value="form.email"
            label="Email"
            class="my-6"
            input="InputEmail"
            required
            placeholder="Email"
            @input="handleEmit('email', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <div class="action">
            <ElButton
              type="submit"
              format="block"
              btn="primary"
              :class="!form.email ? 'cursor-not-allowed' : ''"
              :disabed="!form.email"
            >
              Continue
            </ElButton>
          </div>
        </ElForm>
      </template>

      <div class="form-footer mt-6 text-center text-xs font-medium font-sans">
        <template v-if="viewId === 'register'">
          <a
            class="text-primary-500 hover:text-primary-400 cursor-pointer"
            @click.prevent="emit('update:viewId', 'login')"
          >Login Instead</a>
        </template>
        <template v-else-if="viewId === 'resetPassword'">
          Return to
          <a
            class="text-primary-500 hover:text-primary-400 cursor-pointer"
            @click.prevent="emit('update:viewId', 'login')"
          >Login</a>
        </template>

        <template v-else-if="viewId === 'verify'">
          <div class="flex justify-center space-x-6">
            <a
              class="text-primary-500 hover:text-primary-400 cursor-pointer"
              @click.prevent="codeSent = false"
            >Resend Code</a>

            <a
              class="text-primary-500 hover:text-primary-400 cursor-pointer"
              @click.prevent="emit('update:viewId', 'login')"
            >Login</a>
          </div>
        </template>
        <template v-else-if="viewId === 'login'">
          <div class="flex justify-center space-x-6">
            <a
              class="hover:text-theme-500 text-theme-600 ml-1 cursor-pointer"
              @click.prevent="emit('update:viewId', 'register')"
            >New Account</a>

            <a
              class="hover:text-theme-500 text-theme-600 ml-1 cursor-pointer"
              @click.prevent="emit('update:viewId', 'resetPassword')"
            >Reset Password</a>
          </div>
        </template>
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
