<script lang="ts" setup>
import type { MediaObject, NavItem } from '@fiction/core'
import type { CustomerData } from '@fiction/plugin-stripe/utils'
import type { Card } from '@fiction/site'
import type { UserConfig } from './DashWrap.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { vue } from '@fiction/core'
import XMenuButton from '@fiction/ui/common/XMenuButton.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import DashBarMenu from './DashBarMenu.vue'

const { accountMenu = [], card, customer, showMobileNav, icon } = defineProps<{
  accountMenu: NavItem[]
  card: Card<UserConfig>
  customer?: CustomerData
  showMobileNav: boolean
  icon: MediaObject
}>()

const emit = defineEmits<{
  (event: 'update:showMobileNav', payload: boolean): void
}>()

const uc = vue.computed(() => card.userConfig.value)
</script>

<template>
  <div
    v-if="card.site"
    class="navbar text-sm font-medium"
  >
    <div class="mx-auto flex items-center justify-between ">
      <div class="flex items-center md:min-w-[150px] ">
        <div class="flex md:hidden px-2 py-2">
          <XMenuButton
            class="size-8"
            :is-open="showMobileNav"
            @click.stop="emit('update:showMobileNav', !showMobileNav)"
          />
        </div>
        <div class="flex items-center px-3 py-2">
          <CardLink :card href="/" class="active:opacity-80 md:hidden">
            <XMedia class="h-[21px]" :media="icon" />
          </CardLink>
          <div class="hidden dark:text-theme-0 text-theme-700 md:flex gap-2 items-center">
            <div v-if="uc.navIcon || uc.navIconAlt" :class="uc.navIconAlt || uc.navIcon" class="text-xl" />
            <div class="hidden text-base font-semibold sm:block  dark:text-theme-0  text-theme-700 ">
              {{ card.site.currentPage.value?.title.value }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center h-full justify-end gap-4 md:gap-5 md:min-w-[150px] py-2 px-3">
        <DashBarMenu
          size="md"
          direction="left"
          default-text="Menu"
          class="block"
          :account-menu="accountMenu"
          :site="card.site"
        />
      </div>
    </div>
  </div>
</template>
