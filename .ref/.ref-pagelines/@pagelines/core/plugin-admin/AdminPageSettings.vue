<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
  NavGroup,
} from '@factor/api'
import {
  useService,
  vue,
} from '@factor/api'
import ElNavMenu from '@factor/ui/ElNavMenu.vue'
import AdminPage from '@factor/ui/AdminPage.vue'
import AdminElOrganizationSwitch from '@factor/ui/AdminElOrganizationSwitch.vue'

const { factorRouter } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
const menu = vue.computed<NavGroup[]>(() => {
  // const orgGroup = `Settings`
  // const standardMenus = [
  //   {
  //     title: orgGroup,
  //     menu: [
  //       factorRouter.getRouteMenuItem('orgSettings', {
  //         item: { name: 'General' },
  //       }),
  //       factorRouter.getRouteMenuItem('team'),
  //       factorRouter.getRouteMenuItem('developer'),
  //     ],
  //   },
  //   {
  //     title: 'Plans and Billing',
  //     menu: [factorRouter.getRouteMenuItem('manageBilling')],
  //   },
  //   {
  //     title: 'Account and Profile',
  //     menu: [
  //       factorRouter.getRouteMenuItem('accountSettings'),
  //       factorRouter.getRouteMenuItem('editProfile'),
  //       factorRouter.getRouteMenuItem('accountChangePassword'),
  //       factorRouter.getRouteMenuItem('organizationIndex'),
  //     ],
  //   },
  // ]

  return []
})
</script>

<template>
  <AdminPage>
    <template #menu>
      <div class="space-y-6 p-6">
        <div>
          <RouterLink
            :to="factorRouter.link(`orgHome`).value"
            class="text-theme-700 bg-theme-100 hover:bg-theme-200 rounded-md px-3 py-2 text-xs font-bold"
          >
            &larr; Home
          </RouterLink>
        </div>
        <div>
          <div class="font-brand font-bold">
            Settings
          </div>
        </div>
        <div class="">
          <div
            class="text-theme-300 mb-1 pb-1 text-[11px] font-bold uppercase tracking-widest"
          >
            Active Organization
          </div>
          <AdminElOrganizationSwitch />
        </div>
        <ElNavMenu :menu="menu" />
      </div>
    </template>
    <slot />
  </AdminPage>
</template>
