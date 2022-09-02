<template>
  <div class="test-input p-4">
    <div class="text-theme-700 flex items-end justify-between">
      <h3 class="text-sm font-semibold">{{ inputName }}</h3>
      <div class="flex space-x-4 text-xs">
        <div class="opacity-50">Value</div>
        <div>{{ val || "[empty]" }}</div>
      </div>
    </div>
    <div class="pt-2">
      <component
        :is="inputEl"
        v-model="val"
        v-bind="attrs"
        :name="objectId()"
      ></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { vue, objectId } from "@factor/api"
const val = vue.ref()
defineProps({
  inputName: { type: String, default: "" },
  inputEl: { type: Object as vue.PropType<vue.Component>, default: () => ({}) },
})
const attrs = vue.useAttrs()
</script>
