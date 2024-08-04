<script lang="ts" setup>
import { SizeSchema, stringify, vue } from '@fiction/core'
import XText from '../../common/XText.vue'
import ElForm from '../ElForm.vue'
import type { InputOption } from '..'

const props = defineProps({
  inputName: { type: String, default: '' },
  inputEl: { type: Object as vue.PropType<{ el: vue.Component }>, default: () => ({}) },
  modelValue: { type: [Array, Object, String, Number, Boolean], default: undefined },
  options: { type: Array as vue.PropType<InputOption[]>, default: () => [] },
  uiSize: { type: String, default: 'base' },
})

const sizes = SizeSchema.options
const val = vue.ref(props.modelValue)
const attrs = vue.useAttrs()
const inputForm = vue.ref<typeof ElForm>()
const isValid = vue.ref(false)
const szs = ['md', 'lg', 'xl']
</script>

<template>
  <ElForm
    ref="inputForm"
    v-model:valid="isValid"
    class="test-input py-4"
    :data="val"
    :name="inputName"
  >
    <div :id="inputName" class="">
      <div class="flex border-b border-theme-200 dark:border-theme-700 py-4 items-end">
        <div class="basis-1/2 text-theme-700 dark:text-theme-0 space-7-4 col-span-3">
          <h3 class="grow text-sm font-medium x-font-title">
            {{ inputName }}
          </h3>
        </div>
        <div class="basis-1/2  text-right">
          <div class="text-[8px] font-mono">
            <div class="pb-1  mb-2">
              <span :class="isValid ? 'text-primary-500' : 'text-rose-500'" class="text-[8px] font-mono">
                {{ isValid ? '(Valid)' : '(Invalid)' }}
              </span>
            </div>
            <div class="min-w-0 break-words tracking-tight" :data-input-value="val">
              <XText
                tag="div"
                class=""
                :model-value="stringify({ value: val || '[empty]' })"
                :is-markdown="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class=" ">
        <div class="grid grid-cols-3 gap-4 pt-2">
          <div v-for="(sz, i) in szs" :key="i" class="space-y-2">
            <div class="font-sans text-xs uppercase">
              {{ sz }}
            </div>
            <component
              :is="inputEl.el"
              v-model="val"
              :ui-size="sz"
              data-input
              :options
              v-bind="attrs"
              required
            />
          </div>
        </div>
      </div>
    </div>
  </ElForm>
</template>
