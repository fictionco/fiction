<script lang="ts" setup>
import type {
  FactorRouter,
  MemberAccess,
  MenuItem,
} from '@factor/api'
import {
  localRef,
  onResetUi,
  useService,
  vue,
} from '@factor/api'
import type { FactorUser } from '@factor/api/plugin-user'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type { FictionPayment } from '../plugin-payment'

defineProps({
  requires: {
    type: Array as vue.PropType<('plan' | 'instance')[]>,
    default: undefined,
  },
  access: {
    type: String as vue.PropType<MemberAccess>,
    default: 'view',
  },
  format: {
    type: String as vue.PropType<'container' | 'full'>,
    default: 'container',
  },
})

const { fictionPayment, factorUser, factorRouter } = useService<{
  fictionPayment: FictionPayment
  factorUser: FactorUser
  factorRouter: FactorRouter
}>()

const showOrgMenu = localRef({
  key: 'showOrgMenu',
  def: false,
  lifecycle: 'local',
})

const activeCustomer = vue.computed(() => {
  return fictionPayment.activeCustomer.value
})

onResetUi(() => (showOrgMenu.value = false))

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
</script>

<template>
  <div class="relative">
    <div
      class="border-theme-300 absolute bottom-full mb-4 w-full rounded-md border shadow-lg"
      :class="!showOrgMenu ? 'hidden' : ''"
    >
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
    </div>
    <div
      class="border-theme-300 text-theme-800 cursor-pointer rounded-md border bg-gradient-to-b"
      :class="
        showOrgMenu
          ? 'from-theme-50 via-theme-50 to-theme-0'
          : 'from-theme-0 via-theme-0 to-theme-50  shadow hover:shadow-md'
      "
    >
      <div
        class="flex min-w-0 items-center space-x-3 p-2 font-semibold"
        @click.stop="showOrgMenu = !showOrgMenu"
      >
        <div>
          <ElAvatar
            :email="factorUser.activeUser.value?.email"
            class="h-8 w-8 rounded-full"
          />
        </div>
        <div class="min-w-0 grow">
          <div
            class="text-theme-600 flex items-center space-x-3 text-xs font-bold leading-tight"
          >
            <span class="truncate font-bold tracking-tight">{{
              factorUser.activeUser.value?.email
            }}</span>
          </div>
          <div
            class="text-theme-400 space-x-1 truncate whitespace-nowrap text-xs font-bold tracking-tight"
          >
            <span class=" ">{{ activeCustomer?.planName }}</span>
            <span
              v-if="activeCustomer?.isTrial"
              class="text-primary-500 text-xs font-bold"
            >(Trial)</span>
          </div>
        </div>
        <div>
          <div
            class="text-xl"
            :class="
              showOrgMenu ? 'i-heroicons-x-mark' : 'i-heroicons-chevron-up'
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
