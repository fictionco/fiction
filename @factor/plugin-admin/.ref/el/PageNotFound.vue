<script lang="ts" setup>
import ElZeroState from '@factor/ui/ElZeroState.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import APage from './APage.vue'
</script>

<template>
  <APage title="Page Missing">
    <ElPanel title="Page Not Found">
      <ElZeroState title="Not Found" note="We couldn't find this page.">
        <template #action>
          <ElButton btn="primary" to="/">
            Home &rarr;
          </ElButton>
        </template>
      </ElZeroState>
    </ElPanel>
  </APage>
</template>
