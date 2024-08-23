<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import DashBarMenu from './DashBarMenu.vue'
import type { UserConfig } from './DashWrap.vue'

const props = defineProps({
  iconDashboard: { type: String, default: '' },
  accountMenu: { type: Array as vue.PropType<NavItem[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const emit = defineEmits<{
  (event: 'nav', payload: boolean): void
}>()

const uc = vue.computed(() => props.card.userConfig.value)
</script>

<template>
  <div
    v-if="card.site"
    class="navbar text-sm font-medium"
  >
    <div class="mx-auto flex items-center justify-between  px-4 py-2">
      <div class="flex items-center md:min-w-[150px]">
        <CardLink :card href="/" class="active:opacity-80 sm:hidden">
          <ElImage class="h-[21px]" :media="uc.homeIcon" />
        </CardLink>
        <div class="hidden sm:block dark:text-theme-0 text-theme-700 md:flex gap-2 items-center">
          <div v-if="uc.navIcon || uc.navIconAlt" :class="uc.navIconAlt || uc.navIcon" class="text-xl" />
          <div class="hidden text-base font-semibold sm:block  dark:text-theme-0  text-theme-700 ">
            {{ card.site.currentPage.value?.title.value }}
          </div>
        </div>
      </div>
      <div />

      <div class="flex h-full justify-end space-x-4 md:min-w-[150px]">
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
