<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useMeta, useService } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import AdminPage from './AdminPage.vue'

useService<{ factorUser: FactorUser }>()

useMeta({
  title: 'AI Agents for Websites',
  meta: [
    {
      name: `description`,
      content: ``,
    },
  ],
})
</script>

<template>
  <AdminPage>
    <ElPanel title="Data Ingest" />
  </AdminPage>
</template>

<style lang="less"></style>
