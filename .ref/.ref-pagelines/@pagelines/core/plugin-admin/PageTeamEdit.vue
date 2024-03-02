<script lang="ts" setup>
import AdminPanelTeamEdit from '@factor/ui/AdminPanelTeamEdit.vue'
import AdminPageSettings from './AdminPageSettings.vue'
</script>

<template>
  <AdminPageSettings access="manager">
    <AdminPanelTeamEdit />
  </AdminPageSettings>
</template>
