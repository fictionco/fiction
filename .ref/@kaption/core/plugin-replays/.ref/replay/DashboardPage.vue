<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ElButton from '../../el/ElButton.vue'
import ElemControls from '../controls/ElemControls.vue'
import DashboardGrid from '../DashboardGrid.vue'

import ElemBox from '../../el/ElemBox.vue'
import { replayRoute } from './util'
import ReplaySingle from './ReplaySingle.vue'

const route = useRoute()
</script>

<template>
  <div>
    <ElemControls :hide="['compare']" />

    <ElemBox v-if="route.query.replay" title="View Replay">
      <div class="p-6">
        <div class="mb-6">
          <ElButton btn="primary" @click.prevent="replayRoute()">
            &larr; Back to All Replays
          </ElButton>
        </div>
        <ReplaySingle />
      </div>
    </ElemBox>
    <DashboardGrid v-else v-bind="$attrs" />
  </div>
</template>
