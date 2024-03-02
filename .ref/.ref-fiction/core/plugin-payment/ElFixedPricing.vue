<script lang="ts" setup>
import { vue } from '@factor/api'
import AdminElOrganizationSwitch from '@factor/ui/AdminElOrganizationSwitch.vue'
import Logo from '../ui/FictionLogo.vue'
import ElBadge from '../ui/ElBadge.vue'
import { useFictionApp } from '../util'
import ElPricing from './ElPricing.vue'

const { factorUser, fictionPayment } = useFictionApp()

const changeOrg = vue.ref(false)
const show = vue.computed(() => {
  return (
    factorUser.activeUser.value
    && !fictionPayment.activeCustomer.value?.totalQuantity
    && !factorUser.activeUser.value?.isSuperAdmin
  )
})
</script>

<template>
  <div v-if="show" class="bg-theme-0 fixed inset-0 z-40 overflow-scroll">
    <div class="header flex justify-between px-8 py-4">
      <div>
        <Logo class="scheme-light h-[18px] w-auto md:h-[22px]" />
      </div>
      <div class="flex items-center space-x-6">
        <AdminElOrganizationSwitch
          v-if="changeOrg"
          class="w-full"
          direction="left"
          :hide-example="true"
        />
        <ElBadge
          v-if="!changeOrg"
          class="cursor-pointer"
          @click="changeOrg = true"
        >
          Change Organization
        </ElBadge>
        <ElBadge class="cursor-pointer" @click="factorUser.logout()">
          Sign Out
        </ElBadge>
      </div>
    </div>

    <ElPricing
      title="Try it free for 5 days"
      :sup="`${factorUser.activeOrganization.value?.organizationName} Organization`"
      sub-title="Pay just for the server time you need"
    />
  </div>
</template>
