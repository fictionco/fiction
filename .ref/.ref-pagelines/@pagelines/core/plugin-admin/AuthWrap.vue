<script lang="ts" setup>
import AuthForm from '@factor/ui/AuthForm.vue'
import type {
  FactorApp,
  FactorRouter,
} from '@factor/api'
import {
  getColorScheme,
  useMeta,
  useService,
  vue,
} from '@factor/api'
import ElIcon from '../ui/ElIcon.vue'

const { factorRouter } = useService<{
  factorApp: FactorApp
  factorRouter: FactorRouter
}>()

const theme = vue.computed(() => {
  return getColorScheme('gray').colors
})

type AuthModes =
  | 'login'
  | 'register'
  | 'setPassword'
  | 'verify'
  | 'resetPassword'

const routeAuthMode = vue.computed<AuthModes>({
  get: () => factorRouter.params.value.mode as AuthModes,
  set: (val) => {
    return factorRouter.goto(
      'auth',
      { mode: val as AuthModes },
      factorRouter.query.value,
    )
  },
})
const form = vue.ref({
  email: '',
  password: '',
  fullName: '',
  tos: false,
  accessCode: '',
  organizationName: '',
  flow: 'login',
  isNewUser: false,
  redirect: '',
})

async function handleSignedIn() {
  const q = factorRouter.query.value
  let pt = q.redirect ? decodeURIComponent(q.redirect as string) : '/org'

  if (form.value.isNewUser) {
    pt += `${pt.includes('?') ? '&' : '?'}newUser=1`

    // report sign up conversion to google
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-11108559681/hxwTCI7k0qUYEMHW_LAp',
      })
    }
  }

  if (pt.includes('http'))
    location.href = pt
  else await factorRouter.push(pt)
}

useMeta({
  title: `${routeAuthMode.value} - PageLines`,
  meta: [
    {
      name: `description`,
      content: `The interface to ${routeAuthMode.value}.`,
    },
  ],
})
</script>

<template>
  <div class="auth-wrap relative flex overflow-hidden bg-white">
    <div
      class="relative hidden w-[50%] overflow-hidden bg-gradient-to-br from-black via-black to-slate-900 text-white"
    >
      <div class="relative z-20 p-6">
        <ElIcon class="w-10" />
      </div>
    </div>
    <div class="relative flex min-h-screen grow flex-col items-center">
      <div class="relative">
        <div
          class="relative mx-auto flex items-center justify-between px-4 py-2 text-xs md:max-w-7xl"
        >
          <div class="mt-2 text-center">
            <ElIcon class="w-10" />
          </div>
          <div
            id="google-signin-prompt"
            class="absolute right-0 top-full"
          />
        </div>
      </div>
      <div
        class="relative z-20 mx-auto flex w-full grow flex-col justify-center"
      >
        <div class="auth-form pb-24 transition-all">
          <div
            class="bg-theme-0 text-theme-900 mx-auto w-full max-w-xs rounded-lg"
          >
            <div class="relative px-4 py-24">
              <AuthForm
                v-model:view-id="routeAuthMode"
                v-model:form="form"
                @signed-in="handleSignedIn()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.auth-wrap {
  --theme-0: v-bind("theme[0]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-1000: v-bind("theme[1000]");
}
</style>
