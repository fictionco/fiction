<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import SettingsTool from '@fiction/admin/settings/SettingsTool.vue'
import { useService } from '@fiction/core'
import { getTools } from './tools'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const service = useService()
</script>

<template>
  <SettingsTool base-path="/subscriber-manage" :tools="getTools({ service })" :card />
</template>
