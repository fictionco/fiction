<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
  MenuItem,
} from '@factor/api'
import {
  useService,
} from '@factor/api'
import type { FictionPayment } from '../../plugin-payment'

const { fictionPayment, factorUser, factorRouter } = useService<{
  fictionPayment: FictionPayment
  factorUser: FactorUser
  factorRouter: FactorRouter
}>()

function getComponentType(item: MenuItem): string {
  if (item.onClick)
    return 'div'
  else if (item.url)
    return 'a'
  else
    return 'router-link'
}
async function handleClick(event: MouseEvent, item: MenuItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick(event, item)
  }
}

function getOrgMenu(): (MenuItem & { noHover?: boolean })[] {
  if (!factorRouter)
    throw new Error('no router')

  const baseMenu = [
    {
      name: 'Email Support',
      value: 'support',
      onClick: async (): Promise<void> => {
        window.location.href = 'mailto:hello@fiction.com'
      },
    },
    {
      name: 'Logout',
      value: 'logout',
      onClick: async (): Promise<void> => {
        await factorUser.logout()
      },
    },
  ]

  return baseMenu
}
</script>

<template>
  <div class="divide-theme-200 divide-y text-xs">
    <component
      :is="getComponentType(sub)"
      v-for="(sub, ii) in getOrgMenu()"
      :key="ii"
      class="block cursor-pointer items-center rounded-lg px-3 py-2 focus:outline-none"
      :to="sub.route?.value"
      :href="sub.route?.value"
      :class="[
        sub.active?.value
          ? 'bg-primary-50 text-primary-600 font-bold'
          : 'active:bg-theme-200 text-theme-700 hover:text-theme-900 font-semibold',
        !sub.noHover ? 'hover:bg-theme-100' : '',
      ]"
      @click="handleClick($event, sub)"
    >
      <div class="">
        {{ sub.name }}
      </div>
    </component>
  </div>
</template>

<style lang="less"></style>
