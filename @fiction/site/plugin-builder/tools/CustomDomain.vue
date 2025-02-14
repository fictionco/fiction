<script lang="ts" setup>
import type { Site } from '@fiction/site'
import type { UiElementSize } from '@fiction/ui/utils'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'

export interface CustomDomain {
  hostname?: string
  isPrimary?: boolean
}

const props = defineProps({
  modelValue: { type: Array as vue.PropType<CustomDomain[]>, default: () => ([]) },
  destination: { type: String, required: true },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  site: { type: Object as vue.PropType<Site>, required: true },
})
const emit = defineEmits(['update:modelValue'])
const loading = vue.ref(false)

const domains = vue.computed<CustomDomain[]>({
  get: () => {
    const base = props.modelValue ?? []

    if (base[0] && !base.find(item => item.isPrimary))
      base[0].isPrimary = true

    return base
  },
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function deleteDomain(index: number): void {
  domains.value = (domains.value ?? []).filter((_, i) => i !== index)
}

function setPrimary(index: number) {
  const d = domains.value ?? []

  d.forEach((item, i) => (item.isPrimary = (i === index)))

  domains.value = [...d]
}

const newHostname = vue.ref('')
const addNew = vue.ref(false)

function addAnother() {
  const v = newHostname.value
  if (v) {
    const hostname = v.replace(/^https?:\/\//, '').split('/')[0].trim()
    domains.value = [...domains.value, { hostname }]
    newHostname.value = ''
    addNew.value = false
  }
}
</script>

<template>
  <div class="custom-domains space-y-6 pt-4">
    <div v-if="domains.length > 0" class="space-y-4">
      <div
        v-for="(item, i) in domains"
        :key="i"
        class="flex gap-2"
      >
        <InputText
          class="grow select-auto text-center"
          rounding="md"
          readonly
          :value="item.hostname"
        />
        <XButton
          class="shrink-0 w-32"
          size="sm"
          :icon="item.isPrimary ? 'i-tabler-check' : 'i-tabler-switch-horizontal'"
          :theme="item.isPrimary ? 'primary' : 'default'"
          rounding="md"
          design="ghost"
          :title="item.isPrimary ? 'This is your main domain' : 'Make this your main domain'"
          @click.prevent="setPrimary(i)"
        >
          {{ item.isPrimary ? 'Primary' : 'Set Primary' }}
        </XButton>

        <XButton
          class="shrink-0"
          size="sm"
          icon="i-tabler-trash"
          theme="default"
          design="ghost"
          rounding="md"
          title="Remove this domain"
          @click.prevent="deleteDomain(i)"
        />
      </div>
    </div>
    <div v-if="!addNew && domains.length > 0" class="">
      <XButton
        theme="default"
        size="sm"
        icon="i-tabler-plus"
        rounding="md"
        @click.prevent="addNew = true"
      >
        Add Another Domain
      </XButton>
    </div>
    <div v-else class="flex gap-4">
      <InputText
        v-model="newHostname"
        input="InputText"
        placeholder="www.yoursite.com"
        ui-size="md"
        @keydown.enter.prevent="addAnother"
      />
      <XButton
        theme="primary"
        design="outline"
        class="shrink-0"
        size="md"
        icon="i-tabler-plus"
        rounding="md"
        @click.prevent="addAnother()"
      >
        Add Custom Domain
      </XButton>
    </div>
  </div>
</template>
