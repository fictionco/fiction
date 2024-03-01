<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
  MenuGroup,
} from '@factor/api'
import {
  useService,
  vue,
} from '@factor/api'
import ElNavMenu from '@factor/ui/ElNavMenu.vue'
import ElPage from '@factor/ui/AdminPage.vue'
import AdminElOrganizationSwitch from '@factor/ui/AdminElOrganizationSwitch.vue'

const { factorRouter } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
const menu = vue.computed<MenuGroup[]>(() => {
  const orgGroup = `Settings`
  const standardMenus = [
    {
      groupName: orgGroup,
      menu: [
        factorRouter.getRouteMenuItem('orgSettings', {
          item: { name: 'General' },
        }),
        factorRouter.getRouteMenuItem('team'),
        factorRouter.getRouteMenuItem('developer'),
      ],
    },
    {
      groupName: 'Plans and Billing',
      menu: [factorRouter.getRouteMenuItem('manageBilling')],
    },
    {
      groupName: 'Account and Profile',
      menu: [
        factorRouter.getRouteMenuItem('accountSettings'),
        factorRouter.getRouteMenuItem('editProfile'),
        factorRouter.getRouteMenuItem('accountChangePassword'),
        factorRouter.getRouteMenuItem('organizationIndex'),
      ],
    },
  ]

  return standardMenus
})
</script>

<template>
  <ElPage>
    <template #menu>
      <div class="space-y-6 p-4">
        <div>
          <RouterLink
            to="/"
            class="text-theme-500 bg-theme-100 hover:bg-theme-200 rounded-md px-3 py-1 text-xs font-bold uppercase"
          >
            &larr; Back
          </RouterLink>
        </div>
        <div class="">
          <div
            class="text-theme-300 mb-1 pb-1 text-[11px] font-bold uppercase tracking-wide"
          >
            Active Organization
          </div>
          <AdminElOrganizationSwitch />
        </div>
        <ElNavMenu :menu="menu" class="text-sm" />
      </div>
    </template>
    <slot />
  </ElPage>
</template>
