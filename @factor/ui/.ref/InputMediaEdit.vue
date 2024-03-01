<script lang="ts" setup>
// @unocss-include
import type { FactorMedia, ImageFilter, ImageFilterConfig, MediaDisplayObject, OverlaySetting } from '@factor/api'
import { getImageFilter, imageFilters, vue } from '@factor/api'
import { v } from 'vitest/dist/reporters-qc5Smpt5'
import ElModal from './ElModal.vue'
import InputDropDown from './InputDropDown.vue'
import InputOverlay from './InputOverlay.vue'
import InputRange from './InputRange.vue'
import ElButton from './ElButton.vue'
import ElRichImage from './ElRichImage.vue'

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<MediaDisplayObject>,
    default: () => [],
  },
  service: {
    type: Object as vue.PropType<{ factorMedia?: FactorMedia }>,
    default: () => {},
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaDisplayObject): void
}>()
const vis = vue.ref(false)
const editingIndex = vue.ref<number | undefined>()

async function updateValue(value: MediaDisplayObject): Promise<void> {
  emit('update:modelValue', value)
}

const editingItem = vue.computed(() => {
  if (editingIndex.value === undefined)
    return
  return props.modelValue
})

const filters = vue.computed<ImageFilterConfig[]>(() => {
  return editingItem.value?.filters || []
})

const overlay = vue.computed<OverlaySetting | undefined>(() => {
  return editingItem.value?.overlay
})

async function updateFilters(f: ImageFilterConfig) {
  const filtersValue = filters.value

  const ind = filtersValue.findIndex(i => i.filter === f.filter)
  if (ind > -1)
    filtersValue[ind] = f
  else
    filtersValue.push(f)

  const newFilters = filtersValue.map((f) => {
    return { ...f, value: getImageFilter(f.filter, f.percent) }
  })

  const value = props.modelValue
  if (editingIndex.value !== undefined) {
    value[editingIndex.value].filters = newFilters
    await updateValue(value)
  }
}

async function updateField(field: string, value: unknown): Promise<void> {
  if (editingIndex.value !== undefined)
    await updateValue({ ...props.modelValue, [field]: value })
}

async function removeFilter(f: { filter: ImageFilter, percent?: number }) {
  const filtersValue = filters.value
  const index = filtersValue.findIndex(i => i.filter === f.filter)
  if (index > -1)
    filtersValue.splice(index, 1)

  const value = props.modelValue
  if (editingIndex.value) {
    value.filters = filtersValue
    await updateValue(value)
  }
}

function editItem(ind: number): void {
  editingIndex.value = ind
  vis.value = true
}

async function removeItem(item: MediaDisplayObject): Promise<void> {
  const confirmed = confirm('Are you sure?')

  if (confirmed) {
    const value = props.modelValue.filter(i => i.url !== item.url)
    await updateValue(value)
  }
}
</script>

<template>
  <div v-if="modelValue" class="flex space-x-4">
    <div
      v-for="(item, i) in modelValue"
      :key="i"
      class="flex items-center space-x-1"
    >
      <ElRichImage
        :media="item"
        class="relative aspect-video h-12 max-w-[60px] cursor-pointer overflow-hidden rounded-md shadow ring-1 ring-black/10 hover:opacity-80"
        @click.stop="editItem(i)"
      />
      <div class="flex flex-col">
        <div
          class="flex cursor-pointer items-center rounded-md p-1 hover:bg-slate-100"
          @click.stop="editItem(i)"
        >
          <div class="i-carbon-settings text-base text-slate-400" />
        </div>

      </div>
    </div>
    <ElModal v-model:vis="vis" modal-class="max-w-3xl">
      <div v-if="editingItem" class="grid-cols-12 md:grid">
        <div class="relative col-span-6">
          <ElRichImage
            :media="editingItem"
            fit="cover"
            class="absolute inset-0"
          />
        </div>
        <div class="col-span-6 min-h-0 overflow-scroll">
          <div class="mx-auto max-w-sm">
            <div
              class="border-theme-300 flex items-center justify-between border-b py-2 px-4"
            >
              <div class="">
                Edit Image
              </div>
              <ElButton
                btn="primary"
                size="xs"
                @click="vis = false"
              >
                Done
              </ElButton>
            </div>
            <div class="max-h-96 space-y-4 overflow-scroll p-4 md:p-6">
              <div class="border-theme-300 rounded-md border p-4">
                <div
                  class="text-theme-300 mb-2 text-xs font-semibold uppercase"
                >
                  Filters
                </div>
                <div class="space-y-4">
                  <div class="mb-2 text-sm">
                    <InputDropDown
                      default-text="Add Image Filter"
                      :list="
                        imageFilters.filter(
                          (filt) => !filters.some((f) => f.filter === filt),
                        )
                      "
                      @update:model-value="
                        updateFilters({ filter: $event as ImageFilter })
                      "
                    />
                  </div>

                  <div
                    v-for="(f, i) in filters"
                    :key="i"
                    class="flex items-center justify-between space-x-2"
                  >
                    <InputRange
                      :model-value="f.percent"
                      @update:model-value="
                        updateFilters({ filter: f.filter, percent: $event })
                      "
                    />

                    <div class="flex grow justify-between">
                      <span
                        class="bg-theme-500 text-theme-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                      >
                        {{ f.filter }}</span>
                      <span
                        class="bg-theme-100 text-theme-500 hover:bg-theme-200 inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        @click.stop="removeFilter(f)"
                      >
                        <div class="i-carbon-trash-can" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-theme-300 mt-4 rounded-md border p-4">
                <div
                  class="text-theme-300 mb-2 text-xs font-semibold uppercase"
                >
                  Image Overlay
                </div>
                <InputOverlay
                  :model-value="overlay"
                  @update:model-value="updateField('overlay', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="p-12 text-center">
        No Editing Item
      </div>
    </ElModal>
  </div>
</template>
