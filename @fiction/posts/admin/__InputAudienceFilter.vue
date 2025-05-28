<script lang="ts" setup>
import type { ComplexDataFilter, NavListItem, StandardSize } from '@fiction/core'
import type { FictionContact } from '@fiction/plugins/plugin-contact'
import type { Post } from '../post'
import { debounce, useService, vue } from '@fiction/core'
import XNumber from '@fiction/ui/common/XNumber.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { getPostEmailRecipientCount } from '../utils/email'

defineOptions({ name: 'InputAudienceFilter' })

const { modelValue = [], uiSize, post } = defineProps<{
  modelValue?: ComplexDataFilter[]
  uiSize?: StandardSize
  post: Post
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ComplexDataFilter[]): void
}>()

const { fictionContact } = useService<{ fictionContact: FictionContact }>()

const orGroups = vue.computed<ComplexDataFilter[]>({
  get: () => modelValue,
  set: (groups) => {
    emit('update:modelValue', groups)
  },
})

const recipientCount = vue.ref()
const isLoading = vue.ref(false)
const availableTags = vue.ref<NavListItem[]>([])

const selectedTags = vue.ref<string[]>([])

async function fetchTags() {
  const response = await fictionContact.getTags()

  const rawTags = response.data || []

  availableTags.value = rawTags.map(tag => ({
    ...tag,
    label: tag.value,
  }))

  console.warn('Fetching tags', response)
}

const fetchCount = debounce(async () => {
  isLoading.value = true
  recipientCount.value = await getPostEmailRecipientCount({ post, fictionContact })
  isLoading.value = false
}, 300)

// Initial load
vue.onMounted(async () => {
  await fetchTags()

  // Watch for changes
  vue.watch(
    () => [orGroups.value, post.audience.value],
    () => {
      fetchCount()
    },
    { deep: true, immediate: true },
  )

  vue.watch(
    () => selectedTags.value,
    () => {
      orGroups.value = selectedTags.value.map(tag => [{ field: 'tags', operator: 'in', value: [tag] }])
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
    return tags.join(' <span class="text-theme-500">and</span> ')
  }).join(' <span class="text-theme-500">OR</span> ')
})
</script>

<template>
  <div class="space-y-6">
    <div class="border rounded-lg border-theme-200 dark:border-theme-600/60 p-6 lg:p-8 flex gap-6 justify-between items-center">
      <div class="text-xl font-medium text-theme-600 dark:text-theme-200 space-x-2">
        <XNumber
          tag="span"
          :animate="false"
          :model-value="recipientCount"
          class="mt-4 text-5xl font-bold x-font-title"
          format="number"
        />
        <span class="text-theme-500">contacts</span>
      </div>

      <div class="text-sm space-y-1 bg-theme-100 dark:bg-theme-700/70 p-4 rounded-lg">
        <div class="text-theme-500 dark:text-theme-400">
          {{ post.audience.value === 'all'
            ? 'Sending to all active contacts'
            : post.audience.value === 'filtered' ? 'Sending to contacts with filters' : 'No email will be sent' }}
        </div>
        <div v-if="tagGroupDisplay" class="font-medium" v-html="tagGroupDisplay" />
      </div>
    </div>

    <div v-if="post.audience.value === 'filtered'">
      <ElInput
        v-model="selectedTags"
        label="Contact Tags"
        sub-label="Include contacts with these tags"
        input="InputCheckboxMulti"
        :list="availableTags"
      />
    </div>
  </div>
</template>
