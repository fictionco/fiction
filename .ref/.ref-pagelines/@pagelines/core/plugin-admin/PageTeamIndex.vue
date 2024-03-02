<script lang="ts" setup>
import AdminPanelTeamIndex from '@factor/ui/AdminUtilTeamIndex.vue'
import AdminPageSettings from './AdminPageSettings.vue'
</script>

<template>
  <AdminPageSettings access="manager">
    <AdminPanelTeamIndex />
  </AdminPageSettings>
</template>
