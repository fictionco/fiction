<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  useService,
} from '@factor/api'
import AdminElOrganizationSwitch from './AdminElOrganizationSwitch.vue'
import AdminPage from './AdminPage.vue'
import AdminNav from './AdminNav.vue'
import AdminWrap from './AdminWrap.vue'

const { factorRouter } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
</script>

<template>
  <AdminWrap>
    <AdminPage>
      <template #menu>
        <div class="space-y-6 p-6">
          <div>
            <RouterLink
              :to="factorRouter.link(`orgHome`).value"
              class="text-theme-700 bg-theme-100 hover:bg-theme-200 rounded-full px-4 py-2 font-sans text-xs font-bold"
            >
              &larr; Home
            </RouterLink>
          </div>
          <div class="">
            <div
              class="text-theme-300 mb-1 pb-1 font-sans text-sm font-semibold"
            >
              Current Organization
            </div>
            <AdminElOrganizationSwitch />
          </div>
          <AdminNav />
        </div>
      </template>
      <slot />
    </AdminPage>
  </AdminWrap>
</template>
