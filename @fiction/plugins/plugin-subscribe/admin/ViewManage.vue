<script lang="ts" setup>
import SettingsTool from '@fiction/admin/settings/SettingsTool.vue'
import { useService } from '@fiction/core'
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
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
