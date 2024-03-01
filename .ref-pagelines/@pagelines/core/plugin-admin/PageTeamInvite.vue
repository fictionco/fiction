<script lang="ts" setup>
import AdminPanelTeamInvite from '@factor/ui/AdminPanelTeamInvite.vue'
import AdminPageSettings from './AdminPageSettings.vue'
</script>

<template>
  <AdminPageSettings access="manager">
    <AdminPanelTeamInvite />
  </AdminPageSettings>
</template>
