<script lang="ts" setup>
import type { FictionPayment } from '@fiction/core/plugin-payment'
import { onResetUi, useService, vue } from '@factor/api'
import type { FactorAdmin } from '@fiction/core/plugin-admin'
import type { FactorUser } from '@factor/api/plugin-user'
import ElPage from '@fiction/core/plugin-admin/ElPage.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElUpgradePanel from '@fiction/core/plugin-payment/ElUpgradePanel.vue'
import ElServerConnect from '@fiction/core/plugin-instance/ElServerConnect.vue'
import ElLoadingLogo from '@fiction/core/ui/ElLoadingLogo.vue'
import PreLaunch from '@fiction/core/plugin-admin/PreLaunch.vue'

defineProps({
  requires: {
    type: String as vue.PropType<'plan' | 'instance'>,
    default: undefined,
  },
})
const { factorAdmin, fictionPayment, factorUser } = useService<{
  factorAdmin: FactorAdmin
  fictionPayment: FictionPayment
  factorUser: FactorUser
}>()
const showPreLaunch = vue.computed(() => {
  if (
    typeof localStorage === 'undefined'
      || localStorage.getItem('FICTION_ACCESS')
  )
    return false
  else
    return true
})
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

const activeCustomer = vue.computed(() => {
  return fictionPayment.activeCustomer.value
})
</script>

<template>
  <ElPage :menu="factorAdmin.getOrgMenu().value">
    <template v-if="requires === 'plan'">
      <ElUpgradePanel class="mb-6" />
    </template>
    <template v-else-if="requires === 'instance'">
      <ElServerConnect class="mb-6" />
    </template>

    <slot />

    <template v-if="$slots.editor" #editor>
      <slot name="editor" />
    </template>

    <template #loader>
      <ElLoadingLogo class="w-24" />
    </template>

    <template #aside>
      <div class="border-theme-200 rounded-md border p-4">
        <div class="flex justify-between space-x-2">
          <div class="min-w-0 font-semibold">
            <div
              class="text-theme-400 truncate whitespace-nowrap text-[10px] font-bold uppercase tracking-wide"
            >
              Compute Plan
              <span class="opacity-50">({{
                factorUser.activeOrganization.value?.organizationName
              }})</span>
            </div>
            <div
              class="text-theme-600 my-1 flex items-center space-x-3 text-xl font-bold"
            >
              <span class="font-extrabold">{{ activeCustomer?.planName }}</span>
              <span
                v-if="activeCustomer?.isTrial"
                class="text-primary-600 bg-primary-100 rounded-md px-2 py-1 text-xs"
              >Trial</span>
            </div>
          </div>
        </div>
        <ElButton
          format="block"
          btn="default"
          class="mt-2"
          size="xs"
          :href="activeCustomer?.link"
        >
          Change Plan
        </ElButton>
      </div>
    </template>
    <PreLaunch v-if="showPreLaunch" />
  </ElPage>
</template>
