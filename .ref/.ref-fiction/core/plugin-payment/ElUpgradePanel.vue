<script lang="ts" setup>
import ElPanel from '@factor/ui/ElPanel.vue'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import type { FactorRouter } from '@factor/api'
import { useService } from '@factor/api'

const { factorRouter } = useService<{
  factorRouter: FactorRouter
}>()
</script>

<template>
  <ElPanel title="AI Server Needed">
    <ElZeroBanner
      sub-title="AI Server Is Off"
      title="Pick a Plan"
      description="To activate your custom AI server, you'll need a plan. They start
          at just $19/month and include a trial."
      :actions="[
        {
          name: 'Pick a Plan',
          href: factorRouter.link('plans').value,
          icon: 'i-heroicons-arrow-right-20-solid',
          btn: 'primary',
        },
      ]"
    />
  </ElPanel>
</template>
