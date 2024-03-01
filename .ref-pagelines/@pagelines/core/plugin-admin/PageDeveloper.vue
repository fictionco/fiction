<script lang="ts" setup>
import AdminUtilDeveloper from '@factor/ui/AdminUtilDeveloper.vue'
import AdminPageSettings from './AdminPageSettings.vue'
</script>

<template>
  <AdminPageSettings access="manager">
    <AdminUtilDeveloper />
  </AdminPageSettings>
</template>
