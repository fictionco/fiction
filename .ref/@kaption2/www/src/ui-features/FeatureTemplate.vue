<script lang="ts" setup>
import { toLabel, useMeta } from '@factor/api'
import { computed, watch } from 'vue'

import { useRouter } from 'vue-router'
import type { FeaturePageKeysUnion } from '../featureMap'
import { featureList } from '../featureMap'
import { setPageMode } from '../util'
import FeatureElemMore from './FeatureElemMore.vue'

import FeatureElemAspect from './FeatureElemAspect.vue'
import FeatureElemHero from './FeatureElemHero.vue'
import FeatureHeaderFull from './FeatureHeaderFull.vue'

const router = useRouter()

setPageMode('darkHeader')

watch(
  () => router.currentRoute.value.path,
  () => {
    setPageMode('darkHeader')
  },
)
const featureId = computed(
  () => router.currentRoute.value.params.featureId as FeaturePageKeysUnion,
)

const currentFeature = computed(() => {
  return featureList.find(f => f.key === featureId.value)
})

const metaTitle = computed(() => {
  const r = router.currentRoute.value
  const featureName = (currentFeature.value?.name || r.path) as string
  return `${toLabel(featureName)} - Kaption.co`
})

const metaDescription = computed(() => {
  const featureDescription = currentFeature.value?.description as string
  return featureDescription
})

useMeta({
  title: metaTitle,
  meta: [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      name: 'og:title',
      content: metaTitle,
    },
    {
      name: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})
</script>

<template>
  <div :key="featureId" class="overflow-x-hidden">
    <FeatureHeaderFull :current-feature="currentFeature" />

    <div class="my-24">
      <template
        v-for="(aspect, i) in currentFeature?.aspects"
        :key="aspect.name"
      >
        <FeatureElemAspect
          v-if="aspect.align === 'wide'"
          :current-feature="currentFeature"
          :aspect="aspect"
          :class="i % 2 === 0 ? 'even' : 'odd'"
        />
        <FeatureElemHero
          v-else
          :current-feature="currentFeature"
          :aspect="aspect"
          :class="i % 2 === 0 ? 'even' : 'odd bg-color-50'"
        />
      </template>
    </div>

    <FeatureElemMore />
  </div>
</template>
