<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '../../../card'
import AccountWrap from './AccountWrap.vue'
import SettingsAccountEdit from './SettingsAccountEdit.vue'
import SettingsAccountEditProfile from './SettingsAccountEditProfile.vue'
import ElPanelSettings from './ElPanelSettings.vue'

type UserConfig = { isNavItem?: boolean, icon?: string, parentItemId?: string }
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

//
</script>

<template>
  <AccountWrap>
    <ElPanelSettings title="Edit Account">
      <SettingsAccountEdit :card="card" />
    </ElPanelSettings>
    <ElPanelSettings title="Edit Profile">
      <SettingsAccountEditProfile :card="card" />
    </ElPanelSettings>
  </AccountWrap>
</template>
