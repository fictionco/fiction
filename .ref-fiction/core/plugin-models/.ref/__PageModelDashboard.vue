<script lang="ts" setup>
import ElDashboard from '@kaption/core/plugin-dashboards/app/ElDashboard.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { useKaption } from '@kaption/core/utils'
import EventWrap from './__PageWrap.vue'

const { factorRouter } = useKaption()
</script>

<template>
  <EventWrap>
    <template #actions>
      <ElButton
        btn="slate"
        class="hidden lg:inline-flex"
        :to="factorRouter.link('eventNew').value"
      >
        Create New Event
      </ElButton>
    </template>

    <ElDashboard />
  </EventWrap>
</template>
