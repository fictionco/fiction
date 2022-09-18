<template>
  <div>
    <InputMediaEditItems
      :model-value="modelValue"
      @update:model-value="updateValue($event)"
    ></InputMediaEditItems>
    <ElButton btn="theme" :loading="uploading" @click.stop.prevent="vis = true">
      <div class="i-carbon-image text-theme-400 mr-2 text-[1.2em]"></div>
      <span>Add Media</span>
    </ElButton>
    <ElModal v-model:vis="vis" modal-class="max-w-xl">
      <div class="media-gallery grid grid-cols-12 py-2 px-4 text-sm">
        <div class="nav col-span-12">
          <div
            class="grid grid-cols-3 items-center justify-center gap-3 text-xs"
          >
            <div
              v-for="(item, i) in navItems"
              :key="i"
              class="rounded-md py-2 px-3 text-center"
              :class="
                item == navItemActive
                  ? `text-white bg-theme-600 font-semibold`
                  : `text-slate-500 cursor-pointer bg-theme-200 hover:text-slate-700`
              "
              @click="navItemActive = item"
            >
              {{ toLabel(item) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="uploading" class="p-12">
        <ElSpinner class="m-auto h-12 w-12 text-slate-200" />
      </div>
      <InputMediaUpload
        v-else-if="navItemActive == 'upload'"
        class="p-4"
        :service="service"
        :model-value="modelValue"
        @update:model-value="updateValue($event)"
      ></InputMediaUpload>
      <div v-else class="">-----library</div>
    </ElModal>
  </div>
</template>
<script lang="ts" setup>
// @unocss-include
import { vue, toLabel, FactorMedia, MediaDisplayObject } from "@factor/api"
import ElModal from "./ElModal.vue"
import ElButton from "./ElButton.vue"
import ElSpinner from "./ElSpinner.vue"
import InputMediaUpload from "./InputMediaUpload.vue"
import InputMediaEditItems from "./InputMediaEditItems.vue"
defineProps({
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
const vis = vue.ref()
const navItems = ["upload", "stockPhotos", "library"]
const navItemActive = vue.ref(navItems[0])
const uploading = vue.ref(false)

const updateValue = async (value: MediaDisplayObject[]): Promise<void> => {
  emit("update:modelValue", value)
  vis.value = false
}
</script>
