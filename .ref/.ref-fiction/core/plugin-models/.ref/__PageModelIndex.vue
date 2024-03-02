<script lang="ts" setup>
import { useFictionApp } from '../../util'
import PageWrap from './PageWrap.vue'
import ElModelList from './ElModelList.vue'

const { kaptionAdmin } = useFictionApp()
const activeProject = kaptionAdmin.activeProject
</script>

<template>
  <PageWrap>
    <ElModelList :project="activeProject" />
  </PageWrap>
</template>
