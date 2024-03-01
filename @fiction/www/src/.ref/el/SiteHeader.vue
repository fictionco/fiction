<script setup lang="ts">
import { useService, vue } from '@factor/api'
import FictionLogo from '@fiction/core/ui/FictionLogo.vue'
import { googleOneTap } from '@factor/api/plugin-user/google'
import ElBadge from '@fiction/core/ui/ElBadge.vue'
import { getDashboardUrl } from '@fiction/core/util'
import { accountMenu, nav } from '../util'
import ElBar from './ElBar.vue'
import NavMobile from './NavMobile.vue'
import NavAccount from './NavAccount.vue'

const { factorUser } = useService()

const activeUser = factorUser.activeUser
/* Nav visibility */
const vis = vue.ref(false)

vue.onMounted(async () => {
  const user = await factorUser.userInitialized()

  if (!user) {
    await googleOneTap({
      promptParentId: 'google-signin-prompt',
      factorUser,

      callback: async (r) => {
        const email = r.user?.email
        if (r.user && r.isNew && email) {
          if (r.code) {
            location.href = getDashboardUrl({
              path: `/set-password`,
              queryArgs: {
                flow: 'register',
                code: r.code,
                email,
              },
            })
          }
          else {
            location.href = getDashboardUrl({
              path: `/`,
              queryArgs: {
                flow: 'register',
                newUser: '1',
                email,
              },
            })
          }
        }
      },
    })
  }
})
</script>

<template>
  <div class="relative z-30">
    <ElBar />
    <div class="header mx-auto flex max-w-screen-xl justify-between p-4">
      <div class="logo col-span-4 flex items-center">
        <RouterLink to="/">
          <FictionLogo class="w-24" />
        </RouterLink>
      </div>

      <div
        class="col-span-8 flex items-center justify-end text-right lg:hidden"
      >
        <NavAccount
          class="ml-4 lg:hidden"
          :menu="[...nav, ...accountMenu({ factorUser })]"
        />
      </div>
      <div
        class="nav col-span-8 hidden items-center justify-end space-x-4 lg:flex"
      >
        <ElBadge
          v-for="item in nav"
          :key="item.value"
          :href="item.value"
          @click="item.cb ? item.cb($event) : null"
        >
          {{ item.name }}
        </ElBadge>
        <NavAccount
          v-if="activeUser"
          :menu="accountMenu({ factorUser })"
        />

        <ElBadge
          v-else
          :href="getDashboardUrl({ path: activeUser ? '/login' : '/' })"
        >
          Login / Sign Up &rarr;
        </ElBadge>
      </div>
    </div>
    <div id="google-signin-prompt" class="absolute right-0 top-full" />
  </div>
  <!-- Mobile Nav -->
  <NavMobile v-model:vis="vis" />
</template>
@factor/api/plugin-user/google
