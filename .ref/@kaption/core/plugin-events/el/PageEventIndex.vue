<script lang="ts" setup>
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import EventWrap from './EventWrap.vue'
import ElEventList from './ElEventList.vue'

const { factorRouter, factorAdmin } = useKaption()
const activeProject = factorAdmin.activeProject
</script>

<template>
  <EventWrap>
    <template #actions>
      <ElButton
        btn="slate"
        class="hidden lg:inline-flex"
        :to="factorRouter.link('eventNew').value"
      >
        New Custom Event
      </ElButton>
    </template>

    <ElEventList :project="activeProject" />
  </EventWrap>
</template>
