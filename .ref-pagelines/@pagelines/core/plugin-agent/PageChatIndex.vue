<script setup lang="ts">
import type { FactorRouter, FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import AdminPage from '../plugin-admin/AdminPage.vue'
import ElChatList from './ElChatList.vue'
import ElChatStart from './ElChatStart.vue'

const { factorRouter } = useService<{
  factorUser: FactorUser
  factorRouter: FactorRouter
}>()

const startModelVis = vue.computed(
  () => !!(factorRouter.query.value.create as string),
)

async function removeQuery(_v: boolean) {
  // remove create from query url
  await factorRouter.replace({ query: { create: undefined } })
}
</script>

<template>
  <AdminPage>
    <ElPanel title="Your Chat Agents">
      <ElChatList />
    </ElPanel>
    <ElChatStart
      :vis="startModelVis"
      @update:vis="removeQuery($event)"
    />
  </AdminPage>
</template>

<style lang="less"></style>
