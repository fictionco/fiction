<script lang="ts" setup>
import { vue } from '@factor/api'
import InputSelectMulti from '@factor/ui/InputSelectMulti.vue'
import { useKaption } from '../utils'

const { factorAdmin } = useKaption()
const attrs = vue.useAttrs()
const list = vue.computed(() => {
  const members = factorAdmin.activeOrganization.value?.members ?? []
  return members.map(({ fullName, email, userId }) => {
    return {
      name: `${fullName ?? ''} (${email})`,
      value: userId,
    }
  })
})
</script>

<template>
  <InputSelectMulti :list="list" v-bind="attrs" />
</template>
