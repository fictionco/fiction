<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '../index.js'
import AccountWrap from './AccountWrap.vue'
import ElPanelSettings from './ElPanelSettings.vue'
import SettingsAccountEdit from './SettingsAccountEdit.vue'
import SettingsAccountEditProfile from './SettingsAccountEditProfile.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<NavCardUserConfig>>, required: true },
})

//
</script>

<template>
  <AccountWrap>
    <ElPanelSettings title="Edit Account">
      <SettingsAccountEdit :card />
    </ElPanelSettings>
    <ElPanelSettings title="Edit Profile">
      <SettingsAccountEditProfile :card />
    </ElPanelSettings>
  </AccountWrap>
</template>
