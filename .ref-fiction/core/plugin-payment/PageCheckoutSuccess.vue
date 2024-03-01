<script lang="ts" setup>
import { vue } from '@factor/api'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import AdminPage from '../plugin-admin/AdminPage.vue'
import { useFictionApp } from '../util'

const { factorRouter, fictionPayment } = useFictionApp()

vue.onMounted(async () => {
  await fictionPayment.setCustomerData()
})

const proStatus = vue.computed(() => {
  return fictionPayment.activeCustomer.value
})
</script>

<template>
  <AdminPage title="Success">
    <ElPanel>
      <ElZeroBanner
        sub-title="Welcome to Premium"
        title="Success!"
        :description="`You did it! You're currently on the '${proStatus?.planName}' tier.`"
        :actions="[
          {
            name: 'View Dashboard',
            href: factorRouter.link('home', {}).value,
            btn: 'primary',
          },
        ]"
        :bullets="[
          {
            name: `Pro Features`,
            desc: `We've enabled professional grade features, limits and processing. Thanks for your support.`,
          },
          {
            name: `Satisfaction Guarantee`,
            desc: `We only want to be successful if you are. Let us know if you have any issues.`,
          },
          {
            name: `Priority Support`,
            desc: `Let's work on this together. Join the forum or Discord, tell us what you're working on.`,
          },
        ]"
      />
    </ElPanel>
  </AdminPage>
</template>
