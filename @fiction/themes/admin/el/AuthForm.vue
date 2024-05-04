<script lang="ts" setup>
import type { ActionItem, FictionUser,
} from '@fiction/core'
import { emitEvent, toLabel, useService, vue } from '@fiction/core'
import { googleOneTap } from '@fiction/core/plugin-user/google'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElSpinner from '@fiction/ui/ElSpinner.vue'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './AuthWrap.vue'

const props = defineProps({
  itemId: { type: String as vue.PropType<Modes>, required: true },
  form: { type: Object as vue.PropType<AuthForm>, required: true },
  loading: { type: Boolean, default: false },
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const emit = defineEmits<{
  (event: 'update:itemId', payload: Modes): void
  (event: 'update:form', payload: AuthForm): void
  (event: 'signedIn', payload: AuthForm): void
}>()

const uc = vue.computed(() => props.card.userConfig.value)

const { fictionUser } = useService<{ fictionUser: FictionUser }>()

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

function validateForm(keys: (keyof AuthForm)[]): boolean {
  for (const key of keys) {
    if (!props.form[key]) {
      formError.value = `Please enter your ${toLabel(key)}.` // Customize this message as needed
      return false // Validation failed
    }
  }
  formError.value = '' // Clear any existing error message
  return true // Validation passed
}

async function handleFormSubmit() {
  sending.value = true
  formError.value = ''

  try {
    switch (props.itemId) {
      case 'register':
        await sendRegister()
        break
      case 'verify':
        await sendVerifyCode()
        break
      case 'login':
        await sendLogin()
        break
      case 'setPassword':
        await sendNewPassword()
        break
      case 'resetPassword':
        await sendResetPassword()
        break
      default:
        throw new Error('Invalid form action')
    }
  }
  catch (error) {
    formError.value = (error as Error).message || 'An error occurred'
  }
  finally {
    sending.value = false
  }
}

async function sendRegister() {
  sending.value = true
  emit('update:form', { ...props.form, isNewUser: true, flow: 'register' })

  if (!validateForm(['email', 'password', 'fullName']))
    return

  const { email = '', password = '', fullName, orgName } = props.form

  const r = await fictionUser.requests.ManageUser.request({ _action: 'create', email, fields: { email, password, fullName }, orgName })

  if (r.status === 'success') {
    emit('update:form', { ...props.form, isNewUser: true, flow: 'register' })
    emit('signedIn', props.form)
  }
  else if (r.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }

  sending.value = false
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

  const r = await fictionUser.requests.VerifyAccountEmail.request({ verificationCode: code, email })

  if (r.status === 'success')
    emit('update:itemId', 'setPassword')

  sending.value = false
}

async function sendLogin(): Promise<void> {
  sending.value = true
  formError.value = ''

  if (!validateForm(['email', 'password']))
    return

  const { email = '', password = '' } = props.form

  const r = await fictionUser.requests.Login.request({ email, password })

  if (r.status === 'success') {
    if (r.user?.emailVerified) {
      emit('signedIn', props.form)
    }
    else {
      emit('update:form', { ...props.form, isNewUser: true, flow: 'register' })
      emit('update:itemId', 'verify')
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
    const result = await fictionUser.requests.NewVerificationCode.request({ email, orgName, fullName })

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
  if (!validateForm(['email', 'code', 'password']))
    return

  const { email = '', code = '', password = '' } = props.form

  sending.value = true
  const r = await fictionUser.requests.SetPassword.request({ email, password, verificationCode: code, isNewUser: props.form.isNewUser }, { debug: true })

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

  emit('update:itemId', 'verify')
  sending.value = false
}

async function showGoogle() {
  await googleOneTap({
    autoSignIn: false,
    showPrompt: false,
    fictionUser,
    isSending: isSendingGoogleAuth,
    isDarkMode: props.card.site?.isDarkMode.value,
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
          //  emit('update:itemId', 'setPassword')
        }

        emit('signedIn', { ...props.form, flow: 'register', isNewUser: true, email })
      }
      else {
        emit('signedIn', { ...props.form, flow: 'login', isNewUser: false, email })
      }
    },
  })
}

vue.onMounted(async () => {
  vue.watch(
    () => props.itemId,
    async (itemId) => {
      await fictionUser.userInitialized({ caller: 'AuthForm' })
      await showGoogle()

      if (itemId === 'setPassword' && (!props.form.email || !props.form.code))
        emit('update:itemId', 'verify')
    },
    { immediate: true },
  )
})

type Title = { title: string, subTitle?: string, links?: ActionItem[] }

const titles = vue.computed<Title | undefined>(() => {
  const mapping: Record<string, Title> = {
    register: {
      title: 'Create New Account',
      links: [{ name: 'Login Instead', onClick: () => emit('update:itemId', 'login'), key: 'to-login' }],
    },
    resetPassword: {
      title: 'Reset Password',
      subTitle: 'We\'ll send you a verification code',
    },
    setPassword: {
      title: 'Create a Password',
    },
    verify: {
      title: 'Verify Your Email',
      subTitle: !codeSent.value ? 'Enter the email you used to register.' : 'We sent you a confirmation email. Please enter the code below.',
    },
    login: {
      title: 'Login',
      links: [{ name: 'Create Account Instead', onClick: () => emit('update:itemId', 'register'), key: 'to-register' }],
    },
  }

  return mapping[props.itemId]
})
</script>

<template>
  <ElForm class="relative" :notify="formError" :class="sending || isSendingGoogleAuth ? 'opacity-20' : ''" @submit="handleFormSubmit">
    <div v-if="titles" class="mb-8 text-left md:text-center">
      <h1 class="x-font-title text-2xl font-bold tracking-tight" v-html="titles.title" />
      <div class="mt-2 text-sm font-medium x-font-title text-theme-500">
        <h4 v-if="titles.subTitle" class="space-x-2" v-html="titles.subTitle" />
        <div v-if="titles.links && titles.links.length" class="s">
          <span v-for="(action, i) in titles.links" :key="i" :data-test-id="action.key" class="text-primary-500 hover:opacity-70 cursor-pointer" @click="action.onClick?.({ event: $event, item: action })">{{ action.name }} &rarr;</span>
        </div>
      </div>
    </div>

    <div class="pb-24 md:pb-8">
      <template v-if="itemId === 'verify'">
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

        <div v-else>
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
        </div>
      </template>
      <template v-else-if="itemId === 'login'">
        <div class="account-services text-center">
          <div
            id="google-signin-button"
            class="flex w-full justify-start text-left md:justify-center md:text-center"
          />
        </div>
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="border-theme-100 dark:border-theme-700 w-full border-t" />
          </div>
          <div class="relative flex justify-center">
            <span class="text-theme-200 bg-theme-0 dark:bg-theme-950 px-2 text-sm italic">
              or
            </span>
          </div>
        </div>
        <div>
          <ElInput
            key="inputEmail"
            data-test-id="input-email"
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
            key="inputPassword"
            data-test-id="input-password"
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
              data-test-id="email-login-button"
              type="submit"
              format="block"
              btn="primary"
              :loading="sending"
              size="lg"
            >
              Login
            </ElButton>
          </div>
        </div>
      </template>
      <template v-else-if="itemId === 'register'">
        <div class="account-services text-center" data-test="google-button">
          <div
            id="google-signin-button"
            data-test-id="google-signin-button"
            class="flex w-full justify-start text-left md:justify-center md:text-center"
          />
        </div>
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="border-theme-100 dark:border-theme-700 w-full border-t" />
          </div>
          <div class="relative flex justify-center">
            <span class="text-theme-200 bg-theme-0 dark:bg-theme-950 px-2 text-sm italic">
              or
            </span>
          </div>
        </div>
        <div
          class="space-y-6"
        >
          <ElInput
            data-test-id="input-name"
            :value="form.fullName"
            label="Your Name"
            input="InputText"
            required
            placeholder="Name"
            @input="handleEmit('fullName', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <ElInput
            data-test-id="input-email"
            :value="form.email"
            label="Your Email"
            input="InputEmail"
            description="Work email is preferred"
            required
            placeholder="Email"
            @input="handleEmit('email', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <ElInput
            key="inputPassword"
            data-test-id="input-password"
            :value="form.password"
            class="my-6"
            input="InputPassword"
            label="Create Password"
            description="Minimum 6 characters"
            autocomplete="new-password"
            placeholder="Password"
            required
            @input="handleEmit('password', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <ElInput
            id="input-org-name"
            :value="form.orgName"
            label="Organization"
            description="(optional) Organizations allow you to manage multiple users and projects."
            input="InputText"
            placeholder="Company"
            @input="handleEmit('orgName', $event.target.value)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <div class="action text-center">
            <ElButton
              data-test-id="email-register-button"
              btn="primary"
              format="block"
              :loading="sending"
              size="lg"
              type="submit"
            >
              Create Account &rarr;
            </ElButton>
          </div>
          <div class="text-[10px] font-sans text-balance text-center">
            By creating an account, you agree to the
            <a class="text-primary-500" :href="uc.termsUrl" target="_blank">terms</a>
            and
            <a class="text-primary-500" :href="uc.privacyUrl" target="_blank">privacy policy</a>.
          </div>
        </div>
      </template>
      <template v-else-if="itemId === 'setPassword'">
        <div data-test-id="set-password-form">
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
              size="lg"
              :loading="sending"
              :class="form.password && form.password.length < 6 ? 'opacity-80 cursor-not-allowed' : ''"
            >
              Set Password
            </ElButton>
          </div>
        </div>
      </template>
      <template v-else-if="itemId === 'resetPassword'">
        <div data-test-id="reset-password-form">
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
              size="lg"
              btn="primary"
              :class="!form.email ? 'cursor-not-allowed' : ''"
              :disabed="!form.email"
            >
              Continue
            </ElButton>
          </div>
        </div>
      </template>

      <div class="form-footer mt-6 text-center text-xs font-medium font-sans text-theme-400 dark:text-theme-300">
        <template v-if="itemId === 'resetPassword'">
          Return to
          <a class="text-theme-600 dark:text-theme-0 cursor-pointer hover:opacity-70" @click.prevent="emit('update:itemId', 'login')">Login</a>
        </template>

        <template v-else-if="itemId === 'verify'">
          <div class="flex justify-center space-x-6">
            <a class="text-theme-600 dark:text-theme-0 cursor-pointer hover:opacity-70" @click.prevent="codeSent = false">Resend Code</a>
            <a class="text-theme-600 dark:text-theme-0 cursor-pointer hover:opacity-70" @click.prevent="emit('update:itemId', 'login')">Login</a>
          </div>
        </template>
        <template v-else-if="itemId === 'login'">
          <div class="flex justify-center space-x-6">
            <a class="text-theme-600 dark:text-theme-300 ml-1 cursor-pointer hover:opacity-70" @click.prevent="emit('update:itemId', 'resetPassword')">Reset Password</a>
          </div>
        </template>
      </div>
    </div>
    <div
      v-if="loading"
      class="text-theme-300 dark:text-theme-600 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
    >
      <ElSpinner class="h-10 w-10" />
    </div>
  </ElForm>
</template>
