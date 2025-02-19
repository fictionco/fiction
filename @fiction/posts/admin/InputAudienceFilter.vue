<script lang="ts" setup>
import type { ComplexDataFilter, StandardSize } from '@fiction/core'
import type { TopValueResult } from '@fiction/core/plugin-user/endpointTopValues'
import type { FictionSubscribe } from '@fiction/plugins/plugin-subscribe'
import { debounce, useService, vue } from '@fiction/core'
import XNumber from '@fiction/ui/common/XNumber.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

defineOptions({ name: 'InputAudienceFilter' })

const { modelValue = [], uiSize } = defineProps<{
  modelValue?: ComplexDataFilter[]
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ComplexDataFilter[]): void
}>()

const { fictionSubscribe } = useService<{ fictionSubscribe: FictionSubscribe }>()

const orGroups = vue.computed<ComplexDataFilter[]>({
  get: () => modelValue,
  set: (groups) => {
    emit('update:modelValue', groups)
  },
})

const recipientCount = vue.ref()
const isLoading = vue.ref(false)
const availableTags = vue.ref<TopValueResult[]>([])

const selectedTags = vue.ref<string[]>([])

async function fetchTags() {
  const response = await fictionSubscribe.getTags()

  availableTags.value = response.data || []

  console.warn('Fetching tags', response)
}

const fetchCount = debounce(async () => {
  if (!orGroups.value.length) {
    recipientCount.value = 0
    return
  }

  isLoading.value = true
  try {
    const response = await fictionSubscribe.requests.ManageSubscription.projectRequest({
      _action: 'count',
      filters: orGroups.value,
    })

    console.warn('Fetching recipient count', response)
    recipientCount.value = response.indexMeta?.count || 0
  }
  catch (error) {
    console.error('Error fetching recipient count:', error)
    recipientCount.value = 0
  }
  isLoading.value = false
}, 300)

// Initial load
vue.onMounted(async () => {
  await fetchTags()

  // Watch for changes
  vue.watch(
    () => orGroups.value,
    () => {
      fetchCount()
    },
    { deep: true, immediate: true },
  )

  vue.watch(
    () => selectedTags.value,
    () => {
      orGroups.value = selectedTags.value.map(tag => [{
        field: 'tags',
        operator: 'in',
        value: [tag],
      }])
    },
    { deep: true, immediate: true },
  )
})

// Helper to format tag groups for display
const tagGroupDisplay = vue.computed(() => {
  if (!orGroups.value.length)
    return ''

  return orGroups.value.map((group) => {
    const tags = group.find(f => f.field === 'tags')?.value as string[] || []
    return tags.join(' <span class="opacity-50">and</span> ')
  }).join(' <span class="opacity-50">OR</span> ')
})
</script>

<template>
  <div class="space-y-6">
    <div class="border border-theme-200 dark:border-theme-600 rounded-lg p-4">
      <div class="text-xl font-medium text-theme-600 dark:text-theme-200 space-x-2">
        <XNumber
          tag="span"
          :animate="true"
          :model-value="recipientCount"
          class="mt-4 text-5xl lg:text-6xl font-bold x-font-title"
          format="number"
        />
        <span>recipients</span>
      </div>

      <div v-if="orGroups.length" class="mt-3">
        <div class="text-theme-500 text-sm">
          Sending to contacts that have:
        </div>
        <div class="font-medium" v-html="tagGroupDisplay" />
      </div>
    </div>

    <div>
      <ElInput
        v-model="selectedTags"
        label="Select Tags"
        input="InputCheckboxMulti"
        :list="availableTags"
      />
    </div>
  </div>
</template>
