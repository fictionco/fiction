<script lang="ts" setup>
import ElDashboard from '@factor/api/plugin-dashboards/app/ElDashboard.vue'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import EventWrap from './EventWrap.vue'

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
