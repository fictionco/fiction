<script lang="ts" setup>
import DropDown from '@factor/ui/DropDown.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type {
  FactorRouter,
  FactorUser,
  MenuItem,
} from '@factor/api'
import {
  onResetUi,
  useService,
  vue,
} from '@factor/api'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const accountMenu: MenuItem[] = [
  {
    name: 'Account Settings',
    value: 'accountSettings',
    link: factorRouter.link('accountSettings'),
  },
  {
    name: 'Organizations',
    value: 'organizations',
    link: factorRouter.link('organizationIndex'),
  },
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

const activeOrganization = factorUser.activeOrganization
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

async function handle(value?: string) {
  if (!value)
    return

  const v = accountMenu.find(m => m.value === value)

  if (v?.onClick)
    await v.onClick()
  else if (v?.link?.value)
    await factorRouter.push(v?.link?.value)
}
</script>

<template>
  <DropDown
    :list="accountMenu"
    :default-text="
      factorUser.activeUser.value?.fullName
        ?? factorUser.activeUser.value?.email
    "
    @update:model-value="handle($event as string)"
  >
    <template #top>
      <div class="px-4 py-3 text-sm" role="none">
        <p class="truncate" role="none">
          {{ factorUser.activeUser.value?.email }}
        </p>
        <p class="text-theme-300 mt-1 capitalize" role="none">
          {{ factorUser.activeOrganization.value?.relation?.memberAccess }}
        </p>
      </div>
    </template>
    <template #sel>
      <ElAvatar
        class="h-5 w-5 rounded-full"
        :user-id="factorUser.activeUser.value?.userId"
      />
    </template>
  </DropDown>
</template>
