<script lang="ts" setup>
import AppPage from '@factor/ui/AppPage.vue'
import { useFictionApp } from '../util'
import ElPricing from './ElPricing.vue'

const { factorUser } = useFictionApp()
</script>

<template>
  <AppPage>
    <ElPricing
      title="Try it free for 5 days"
      :sup="`${factorUser.activeOrganization.value?.organizationName} Organization`"
      sub-title="Pay just for the server time you need"
    />
  </AppPage>
</template>
