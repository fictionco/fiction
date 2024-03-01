<template>
  <AppContent />
  <LoadingVeil
    :factor-user="service.factorUser"
    :factor-router="service.factorRouter"
  />
  <NotifyToaster />
</template>

<script lang="ts" setup>
import LoadingVeil from "@factor/ui/LoadingVeil.vue"
import NotifyToaster from "@factor/plugin-notify/NotifyToaster.vue"

import { useService } from "@factor/api"
import AppContent from "./AppContent.vue"
import type { ServiceContainer } from "."

const service = useService<ServiceContainer>()
</script>
