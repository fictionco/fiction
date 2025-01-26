<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import type { CustomerData } from '@fiction/plugin-stripe/utils'
import type { Card } from '@fiction/site'
import type { UserConfig } from './DashWrap.vue'
import CardButton from '@fiction/cards/CardButton.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'
import DashBarMenu from './DashBarMenu.vue'

const { accountMenu = [], card, customer } = defineProps<{
  accountMenu: NavItem[]
  card: Card<UserConfig>
  customer?: CustomerData
}>()

const emit = defineEmits<{
  (event: 'nav', payload: boolean): void
}>()

const uc = vue.computed(() => card.userConfig.value)
</script>

<template>
  <div
    v-if="card.site"
    class="navbar text-sm font-medium"
  >
    <div class="mx-auto flex items-center justify-between  px-4 py-2">
      <div class="flex items-center md:min-w-[150px]">
        <CardLink :card href="/" class="active:opacity-80 sm:hidden">
          <XMedia class="h-[21px]" :media="uc.homeIcon" />
        </CardLink>
        <div class="hidden sm:block dark:text-theme-0 text-theme-700 md:flex gap-2 items-center">
          <div v-if="uc.navIcon || uc.navIconAlt" :class="uc.navIconAlt || uc.navIcon" class="text-xl" />
          <div class="hidden text-base font-semibold sm:block  dark:text-theme-0  text-theme-700 ">
            {{ card.site.currentPage.value?.title.value }}
          </div>
        </div>
      </div>
      <div />

      <div class="flex h-full justify-end gap-6 md:min-w-[150px]">
        <div class="flex items-center">
          <CardButton
            v-if="customer"
            :card
            design="outline"
            size="sm"
            theme="primary"
            href="/settings/billing"
          >
            {{ customer?.plan }} plan
          </CardButton>
        </div>
        <DashBarMenu
          size="md"
          direction="left"
          default-text="Menu"
          class="hidden sm:block"
          :account-menu="accountMenu"
          :site="card.site"
        />
        <div
          class="group flex h-8 w-8 cursor-pointer flex-col justify-center space-y-1 p-1 sm:hidden"
          @click="emit('nav', true)"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="bg-theme-300 dark:bg-theme-500 group-active:bg-theme-400 h-1 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
