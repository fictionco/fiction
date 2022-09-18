<template>
  <div v-if="modelValue" class="flex space-x-4">
    <div
      v-for="(item, i) in modelValue"
      :key="i"
      class="flex items-center space-x-1"
    >
      <div
        class="relative aspect-video h-12 max-w-[60px] overflow-hidden rounded-md shadow ring-1 ring-black/10"
      >
        <div class="absolute inset-0">
          <img
            class="h-full w-full object-cover"
            :src="encodeURI(item.url)"
            :style="{
              filter: item.filters?.map((_) => _.value).join(' '),
            }"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <div
          class="flex cursor-pointer items-center rounded-md p-1 hover:bg-slate-100"
          @click.stop="editItem(i)"
        >
          <div class="i-carbon-settings text-base text-slate-400"></div>
        </div>
        <div
          class="flex cursor-pointer items-center rounded-md p-1 hover:bg-slate-100"
          @click.stop="removeItem(item)"
        >
          <div class="i-carbon-trash-can text-base text-slate-400"></div>
        </div>
      </div>
    </div>
    <ElModal v-model:vis="vis" modal-class="max-w-xl">
      <div v-if="editingItem">
        <img
          :src="editingItem.url"
          :style="{
            filter: editingItem.filters?.map((_) => _.value).join(' '),
          }"
        />
        <div class="mx-auto max-w-sm p-4">
          <div class="mb-2 flex justify-center">
            <InputDropDown
              default-text="Add Image Filter"
              :list="
                imageFilters.filter(
                  (filt) => !filters.some((f) => f.filter == filt),
                )
              "
              direction="up"
              @update:model-value="
                updateFilters({ filter: $event as ImageFilter })
              "
            ></InputDropDown>
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
            ></InputRange>

            <div class="flex grow justify-between">
              <span
                class="bg-theme-500 text-theme-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
              >
                {{ f.filter }}</span
              >
              <span
                class="bg-theme-100 text-theme-500 hover:bg-theme-200 inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                @click.stop="removeFilter(f)"
              >
                Remove
              </span>
            </div>
          </div>
          <div class="mt-4 text-center">
            <ElButton btn="primary" size="sm" @click="vis = false"
              >Done Editing</ElButton
            >
          </div>
        </div>
      </div>
    </ElModal>
  </div>
</template>
<script lang="ts" setup>
// @unocss-include
import {
  vue,
  FactorMedia,
  MediaDisplayObject,
  getImageFilter,
  imageFilters,
  ImageFilter,
  ImageFilterConfig,
} from "@factor/api"
import ElModal from "./ElModal.vue"
import InputDropDown from "./InputDropDown.vue"
import InputRange from "./InputRange.vue"
import ElButton from "./ElButton.vue"
const vis = vue.ref()
const editingIndex = vue.ref<number | undefined>()

const filtersFull = vue.computed(() => {
  return filters.value.map((f) => {
    return { ...f, value: getImageFilter(f.filter, f.percent) }
  })
})

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<MediaDisplayObject[]>,
    default: () => [],
  },
  service: {
    type: Object as vue.PropType<{ factorMedia?: FactorMedia }>,
    default: () => {},
  },
})
const emit = defineEmits<{
  (event: "update:modelValue", payload: MediaDisplayObject[]): void
}>()

const updateValue = async (value: MediaDisplayObject[]): Promise<void> => {
  emit("update:modelValue", value)
}

const editingItem = vue.computed(() => {
  if (!editingIndex.value) return
  return props.modelValue[editingIndex.value]
})

const filters = vue.computed<ImageFilterConfig[]>(() => {
  return editingItem.value?.filters || []
})

const updateFilters = async (f: ImageFilterConfig) => {
  const filtersValue = filters.value

  const ind = filtersValue.findIndex((i) => i.filter == f.filter)
  if (ind > -1) {
    filtersValue[ind] = f
  } else {
    filtersValue.push(f)
  }

  const newFilters = filtersValue.map((f) => {
    return { ...f, value: getImageFilter(f.filter, f.percent) }
  })

  const value = props.modelValue
  if (editingIndex.value) {
    value[editingIndex.value].filters = newFilters
    await updateValue(value)
  }
}

const filterStyle = vue.computed(() => {
  return filtersFull.value.map((f) => f.value).join(" ")
})

const removeFilter = async (f: { filter: ImageFilter; percent?: number }) => {
  const filtersValue = filters.value
  const index = filtersValue.findIndex((i) => i.filter == f.filter)
  if (index > -1) {
    filtersValue.splice(index, 1)
  }
  const value = props.modelValue
  if (editingIndex.value) {
    value[editingIndex.value].filters = filtersValue
    await updateValue(value)
  }
}

const editItem = (ind: number): void => {
  editingIndex.value = ind
  vis.value = true
}

const removeItem = async (item: MediaDisplayObject): Promise<void> => {
  const confirmed = confirm("Are you sure?")

  if (confirmed) {
    const value = props.modelValue.filter((i) => i.url !== item.url)
    await updateValue(value)
  }
}
</script>
