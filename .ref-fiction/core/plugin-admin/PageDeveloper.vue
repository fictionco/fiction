<script lang="ts" setup>
import AdminPanelDeveloper from '@factor/ui/AdminUtilDeveloper.vue'
import AdminPageSettings from './AdminPageSettings.vue'
</script>

<template>
  <AdminPageSettings access="manager">
    <AdminPanelDeveloper />
  </AdminPageSettings>
</template>
