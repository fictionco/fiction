<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

defineOptions({
  name: 'UserMenu',
})

const { card } = defineProps<{
  card: Card
}>()

const { fictionUser, fictionEnv } = useService()

const authUrlWithRedirect = vue.computed(() => {
  const baseUrl = fictionEnv.isProd.value ? 'https://www.fiction.com' : 'http://localhost:4444'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const urlEncodedCurrentUrl = encodeURIComponent(currentUrl)
  return `${baseUrl}/app/auth?redirect=${urlEncodedCurrentUrl}`
})

// Function to open auth popup when user clicks "Sign In"
function openAuthPopup() {
  // Determine the auth URL based on environment
  const baseUrl = fictionEnv.isProd.value ? 'https://www.fiction.com' : 'http://localhost:4444'
  const authUrl = `${baseUrl}/app/auth`

  // Calculate popup dimensions and position
  const width = 450
  const height = 600
  const left = (window.innerWidth - width) / 2 + window.screenX
  const top = (window.innerHeight - height) / 2 + window.screenY

  // Open popup with specified dimensions and position
  const popup = window.open(
    authUrl,
    'fiction-auth-popup',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`,
  )

  // Focus the popup if it was successfully created
  if (popup) {
    popup.focus()
  }
  else {
    // If popup was blocked, fallback to redirect
    console.warn('Popup blocked. Consider enabling popups for this site.')
    const authUrlWithRedirect = `${authUrl}?redirect=${window.location.href}`
    window.location.href = authUrlWithRedirect
  }

  // Set up message listener for auth completion
  window.addEventListener('message', async (event) => {
    // Only accept messages from fiction domains
    if (!event.origin.match(/^https?:\/\/(.*\.)?fiction\.com|localhost/)) {
      return
    }

    if (event.data?.type === 'auth-success' && event.data?.token) {
      // Handle successful authentication
      await fictionUser.setCurrentUser({
        token: event.data.token,
        user: event.data.user,
        reason: 'auth-popup',
      })

      // // Close the popup if it's still open
      // if (popup && !popup.closed) {
      //   popup.close()
      // }
    }
  }, false)
}
</script>

<template>
  <div>
    <XDropDown
      v-if="fictionUser.activeUser?.value"
      :site="card.site"
      dropdown-alignment="end"
      mode="click"
      :classes="{ width: 'w-56' }"
      :items="[
        // { label: 'Feed', href: 'https://www.fiction.com', icon: { class: 'i-tabler-news' } },
        { label: 'Dashboard', href: 'https://www.fiction.com/app', icon: { class: 'i-tabler-tools' } },
        { label: 'Account Settings', href: 'https://www.fiction.com/app/settings/account', icon: { class: 'i-tabler-user' } },
        { label: 'Sign Out', href: '/?_logout=1', icon: { class: 'i-tabler-logout' } },
      ]"
    >
      <template #top>
        <div
          class="border-theme-200 dark:border-theme-700 flex items-center space-x-3 border-b px-4 py-4 text-sm"
        >
          <div>
            <ElAvatar
              class="ring-theme-300 dark:ring-theme-0 size-7 rounded-full ring-2"
              :user="fictionUser.activeUser?.value"
            />
          </div>
          <div class="font-sans min-w-0">
            <div class="truncate font-bold leading-tight">
              {{ fictionUser.activeUser.value?.fullName || fictionUser.activeUser.value?.email }}
            </div>
            <div class="text-xs text-theme-500 dark:text-theme-400 truncate">
              {{ fictionUser.activeUser.value?.email }}
            </div>
          </div>
        </div>
      </template>
      <template #default="{ isActive }">
        <div class="flex items-center">
          <ElAvatar
            class="size-[1.7em] mr-1.5 rounded-full ring-2 ring-theme-200 dark:ring-theme-0"
            :user="fictionUser.activeUser?.value"
          />
          <XIcon
            class="size-[1em] transition-all text-theme-400 dark:text-theme-500"
            :class="isActive ? 'rotate-180' : ''"
            :media="{ class: 'i-tabler-chevron-down' }"
          />
        </div>
      </template>
    </XDropDown>
    <XButton
      v-else
      icon-after="i-tabler-arrow-right"
      data-test-id="sign-in-button"
      :href="authUrlWithRedirect"
    >
      Sign In
    </XButton>
  </div>
</template>
