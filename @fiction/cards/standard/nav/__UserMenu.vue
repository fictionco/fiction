<script lang="ts" setup>
import type { FictionAdmin } from '@fiction/admin'
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { getFictionAuthUrl, getFictionNavItems } from '@fiction/admin'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import NavMobile from './NavMobile.vue'

defineOptions({ name: 'UserMenu' })

const { card, nav } = defineProps<{ card: Card<UserConfig>, nav?: NavListItem[] }>()
const { fictionUser, fictionAdmin } = useService<{ fictionAdmin: FictionAdmin }>()
const uc = vue.computed(() => card.userConfig.value || {})
const user = vue.computed(() => fictionUser.activeUser?.value)
const mobileMenuVisible = vue.ref(false)

const isEditable = vue.computed(() => card.site?.isEditable.value)
const showSubscribeButton = vue.computed(() => {
  return !user && !isEditable && !uc.value.hideSubscribe
})

const isSubscribed = vue.computed(() => card.site?.activeContact?.value?.status === 'active')
</script>

<template>
  <div class="flex items-center relative gap-4">
    <XButton
      v-if="!user || isEditable"
      class="hidden md:block"
      :href="getFictionAuthUrl({ fictionAdmin, site: card.site })"
      icon-after="i-tabler-chevron-right"
      :design="showSubscribeButton ? 'link' : 'solid'"
    >
      Sign In
    </XButton>
    <XButton
      v-if="showSubscribeButton "
      :theme="isSubscribed ? 'default' : 'primary'"
      :design="isSubscribed ? 'ghost' : 'solid'"
      icon-after="i-tabler-chevron-right"
      :href="isSubscribed ? undefined : `?_subscribe=1`"
    >
      {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
    </XButton>

    <XDropDown
      v-if="user"
      :site="card.site"
      dropdown-alignment="end"
      mode="click"
      :class="card.site?.isEditable.value ? 'pointer-events-none' : 'pointer-events-none md:pointer-events-auto '"
      :classes="{ width: 'w-64' }"
      :items="getFictionNavItems({ fictionAdmin, fictionUser })"
    >
      <template #top>
        <div
          class="border-theme-200 dark:border-theme-700 flex items-center space-x-3 border-b px-4 py-4 text-sm"
        >
          <div>
            <ElAvatar
              class="size-8"
              :user="user"
            />
          </div>
          <div class="font-sans min-w-0 space-y-0.5">
            <div class="truncate font-bold leading-tight">
              {{ user?.fullName || user?.email || 'Sign In' }}
            </div>
            <div class="text-xs text-theme-500 dark:text-theme-400 truncate">
              {{ user?.email || 'Connect Fiction Account' }}
            </div>
          </div>
        </div>
      </template>
      <template #default="{ isActive }">
        <div class="flex items-center relative hover:opacity-80 active:opacity-50">
          <ElAvatar
            class="size-8 mr-1.5"
            :user="user"
          />
          <div
            class="flex z-20 rounded-full ring-1 ring-white bg-theme-600 dark:bg-theme-700 text-theme-100 dark:text-theme-300 size-4  items-center justify-center absolute bottom-0 right-0"
          >
            <XIcon
              class="hidden md:block size-[80%] transition-all text-theme-400 dark:text-theme-200"
              :class="isActive ? 'rotate-180' : ''"
              :media="{ class: 'i-tabler-chevron-down' }"
            />
            <XIcon
              class="md:hidden size-[80%] transition-all text-theme-400 dark:text-theme-200"
              :class="isActive ? 'rotate-180' : ''"
              :media="{ class: 'i-tabler-menu-2' }"
            />
          </div>
        </div>
      </template>
    </XDropDown>
    <div class="absolute inset-0 md:hidden z-40" @click.stop="mobileMenuVisible = !mobileMenuVisible" />
    <NavMobile
      :vis="mobileMenuVisible"
      :nav
      @update:vis="mobileMenuVisible = $event"
    />
  </div>
</template>
