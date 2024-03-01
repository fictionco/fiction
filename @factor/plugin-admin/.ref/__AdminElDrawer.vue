<script lang="ts" setup>
import type {
  FactorRouter,
  MemberAccess,
} from '@factor/api'
import {
  localRef,
  onResetUi,
  useService,
  vue,
} from '@factor/api'
import type { FactorUser } from '@factor/api/plugin-user'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type { FactorStripe } from '@factor/plugin-stripe'

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

const { factorUser, factorRouter, factorStripe } = useService<{
  factorUser: FactorUser
  factorRouter: FactorRouter
  factorStripe: FactorStripe
}>()

const showOrgMenu = localRef({
  key: 'showOrgMenu',
  def: false,
  lifecycle: 'local',
})

const activeCustomer = vue.computed(() => {
  return factorStripe.activeCustomer.value
})

onResetUi(() => (showOrgMenu.value = false))
</script>

<template>
  <div class="relative">
    <div
      class="border-theme-300 text-theme-800 hover:border-theme-400 cursor-pointer rounded-md border"
    >
      <div
        class="flex min-w-0 items-center space-x-3 py-3 pl-3 pr-2"
        @click.stop="factorRouter.goto('orgSettings')"
      >
        <div>
          <ElAvatar
            :email="factorUser.activeOrganization.value?.organizationEmail"
            class="ring-theme-300 h-9 w-9 rounded-full ring-2"
          />
        </div>
        <div class="font-brand min-w-0 grow text-base">
          <div class="flex items-center space-x-3 font-bold leading-tight">
            <span class="truncate font-bold">{{
              factorUser.activeOrganization.value?.organizationName
            }}</span>
          </div>
          <div class="space-x-1 truncate whitespace-nowrap text-sm">
            <span class=" ">{{ activeCustomer?.planName }} Plan</span>
            <span v-if="activeCustomer?.isTrial" class="italic">(Trial)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
