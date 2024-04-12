<script lang="ts" setup>
import type { MediaDisplayObject } from '@fiction/core'
import { unhead, useService, vue } from '@fiction/core'
import ElImage from '@fiction/ui/ElImage.vue'
import type { Card } from '@fiction/site/card'
import AuthForm from './AuthForm.vue'

export type UserConfig = { logo?: MediaDisplayObject, termsUrl?: string, privacyUrl?: string }
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionApp } = useService()

const siteRouter = vue.computed(() => props.card.site?.siteRouter)
const uc = vue.computed(() => props.card.userConfig.value)

const authModes = ['login', 'register', 'setPassword', 'verify', 'resetPassword'] as const
type AuthModes = typeof authModes[number]

const routeAuthMode = vue.computed<AuthModes>({
  get: () => {
    const itemId = (siteRouter.value?.params.value.itemId as string) || 'login'
    const mode = authModes.includes(itemId as AuthModes) ? itemId : 'login'
    return (mode as AuthModes)
  },
  set: (val) => {
    return props.card.goto({ path: `/auth/${val}`, query: siteRouter.value?.query.value || {} })
  },
})
const form = vue.ref({
  email: '',
  password: '',
  fullName: '',
  tos: false,
  accessCode: '',
  orgName: '',
  flow: 'login',
  isNewUser: false,
  redirect: '',
})

async function handleSignedIn() {
  const q = props.card.site?.siteRouter.query.value || {}
  let pt = q.redirect ? decodeURIComponent(q.redirect as string) : props.card.link('/')

  if (form.value.isNewUser)
    pt += `${pt.includes('?') ? '&' : '?'}newUser=1`

  if (pt.includes('http'))
    location.href = pt
  else await props.card.goto(pt)
}

unhead.useHead({
  title: `${routeAuthMode.value} - ${fictionApp.fictionEnv.meta.app?.name || '?'}`,
  meta: [{ name: `description`, content: `The interface to ${routeAuthMode.value}.` }],
})
</script>

<template>
  <div class="auth-wrap relative flex overflow-hidden bg-white  dark:bg-theme-950 dark:text-theme-0">
    <div
      class="relative hidden w-[30%] overflow-hidden bg-theme-950 dark:bg-theme-800 text-theme-0 border-r border-theme-700 lg:block"
    >
      <div class="relative z-20 p-8">
        <ElImage :media="uc.logo" class="h-6 inline-block" />
      </div>
    </div>
    <div class="relative flex min-h-screen grow flex-col items-center">
      <div class="relative">
        <div
          class="relative mx-auto flex items-center justify-between px-4 py-2 text-xs md:max-w-7xl"
        >
          <div class="mt-2 text-center lg:hidden">
            <ElImage :media="uc.logo" class="h-6" />
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
            class="  mx-auto w-full max-w-xs rounded-lg"
          >
            <div class="relative px-4 py-24">
              <AuthForm
                v-model:itemId="routeAuthMode"
                v-model:form="form"
                :card="card"
                @signed-in="handleSignedIn()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
