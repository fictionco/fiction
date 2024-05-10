<script lang="ts" setup>
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import { useService } from '@fiction/core'

const { fictionUser } = useService()
</script>

<template>
  <ElAvatar
    :email="fictionUser.activeOrganization.value?.orgEmail"
  />
</template>
