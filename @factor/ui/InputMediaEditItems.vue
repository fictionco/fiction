<template>
  <div v-if="modelValue" class="mb-2">
    <div v-for="(item, i) in modelValue" :key="i" class="flex space-x-2">
      <div
        class="aspect-video h-10 max-w-[50px] rounded-md bg-cover bg-center shadow ring-1 ring-black/10"
        :style="{ 'background-image': `url(${encodeURI(item.url)})` }"
      />
      <div
        class="flex cursor-pointer items-center rounded-md px-2 hover:bg-slate-100"
        @click.stop="removeItem(item)"
      >
        <div class="i-carbon-close text-2xl text-slate-400"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// @unocss-include
import { vue, FactorMedia, MediaDisplayObject } from "@factor/api"
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

const removeItem = async (item: MediaDisplayObject): Promise<void> => {
  const confirmed = confirm("Are you sure?")

  if (confirmed) {
    const value = props.modelValue.filter((i) => i.mediaId !== item.mediaId)
    await updateValue(value)
  }
}
</script>
