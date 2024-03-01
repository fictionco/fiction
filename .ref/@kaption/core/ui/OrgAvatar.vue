<script lang="ts" setup>
import { vue } from '@factor/api'
import type { Organization } from '@factor/api/plugin-admin'
import { useKaption } from '../utils'

const props = defineProps({
  organization: {
    type: Object as vue.PropType<Organization>,
    default: undefined,
  },
})

const { factorAdmin } = useKaption()

const org = vue.computed<Organization | undefined>(() => {
  return props.organization || factorAdmin.activeOrganization.value
})

const firstLetters = vue.computed(() => {
  return org.value?.organizationName?.slice(0, 2) ?? 'or'
})
</script>

<template>
  <span class="inline-flex items-center justify-center rounded-full bg-white">
    <span class="text-theme-400 text-xs font-bold uppercase leading-none">{{
      firstLetters
    }}</span>
  </span>
</template>
