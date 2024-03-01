<script lang="ts" setup>
import IntegrationSetup from '@kaption/connect/plugin-integrations/IntegrationSetup.vue'
import { useKaption } from '../../utils/inject'

const { kaptionForms } = useKaption()
const activeForm = kaptionForms.activeForm
</script>

<template>
  <IntegrationSetup
    :integrations="['googleSheets', 'slack']"
    :context="activeForm?.formId"
    :state="{
      listName: activeForm?.formName.value,
      columns: activeForm?.columns.value,
      formId: activeForm?.formId,
    }"
  />
</template>
