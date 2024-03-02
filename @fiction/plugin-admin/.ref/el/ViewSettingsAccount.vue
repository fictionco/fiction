<script lang="ts" setup>
import AccountWrap from './AccountWrap.vue'
import EditAccount from './EditAccount.vue'
import EditProfile from './EditProfile.vue'
import ElPanelSettings from './ElPanelSettings.vue'
</script>

<template>
  <AccountWrap>
    <ElPanelSettings title="Edit Account">
      <EditAccount />
    </ElPanelSettings>
    <ElPanelSettings title="Edit Profile">
      <EditProfile />
    </ElPanelSettings>
  </AccountWrap>
</template>
