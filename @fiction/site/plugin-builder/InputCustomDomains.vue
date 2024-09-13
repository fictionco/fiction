<script lang="ts" setup>
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
})
const emit = defineEmits(['update:modelValue'])

const domains = vue.computed<CustomDomain[]>({
  get: () => {
    const base = props.modelValue ?? []

    if (base.length === 0)
      return [{ isPrimary: true }]
    else if (!base.find(item => item.isPrimary))
      base[0].isPrimary = true

    return base
  },
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function addCustomDomain(): void {
  domains.value = [...domains.value, {}]
}

function deleteDomain(index: number): void {
  domains.value = (domains.value ?? []).filter((_, i) => i !== index)
}

function setPrimary(index: number) {
  const d = domains.value ?? []

  d.forEach((item, i) => (item.isPrimary = (i === index)))

  domains.value = [...d]
}

function updateHostname(value: string, index: number): void {
  domains.value = domains.value ?? []

  if (value && index >= 0 && index < domains.value.length) {
    const updatedDomains = [...domains.value]
    const hostname = value.replace(/^https?:\/\//, '').split('/')[0].trim()

    updatedDomains[index] = { ...updatedDomains[index], hostname }
    domains.value = updatedDomains
  }
}

const defaultCopyText = 'click to copy'
const copyText = vue.ref(defaultCopyText)
const copyEffect = vue.ref(false)
async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.destination)
    copyText.value = '...copied!'
    copyEffect.value = true
    setTimeout(() => {
      copyText.value = defaultCopyText
      copyEffect.value = false
    }, 2500)
  }
  catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const showInstructions = vue.ref(false)
</script>

<template>
  <div class="custom-domains font-sans border-t border-theme-200 dark:border-theme-600 pt-4">
    <div

      class=" grid grid-cols-1 gap-x-12 gap-y-6"
    >
      <div class="sm:col-span-6">
        <label for="domain" class="block text-theme-500 text-xs">
          Domains
        </label>
        <div class="space-y-4">
          <div
            v-for="(item, i) in domains"
            :key="i"
            class="flex mt-2 items-center"
          >
            <div class="grow">
              <InputText
                :model-value="item.hostname"
                type="text"
                placeholder="www.example.com"
                :ui-size="uiSize"
                @update:model-value="updateHostname($event, i)"
              />
              <div class="flex space-x-1 mt-3 justify-between text-[9px]  font-medium text-theme-500 select-none">
                <XButton size="xs" :icon="item.isPrimary ? 'i-tabler-check' : 'i-tabler-switch-horizontal'" theme="primary" rounding="full" @click.prevent="setPrimary(i)">
                  {{ item.isPrimary ? 'Primary Domain' : 'Set as Primary' }}
                </XButton>

                <XButton size="xs" icon="i-tabler-x" theme="default" rounding="full" @click.prevent="deleteDomain(i)">
                  Remove
                </XButton>
              </div>
            </div>
          </div>
        </div>
        <div class="add-new mt-4">
          <XButton
            theme="default"
            size="xs"
            icon="i-tabler-plus"
            rounding="full"
            @click.prevent="addCustomDomain()"
          >
            Add Domain
          </XButton>
        </div>
      </div>
      <div class="sm:col-span-6 bg-theme-50 dark:bg-theme-800 rounded-lg p-6 mb-8">
        <label for="instructions" class="block font-bold space-x-4" @click="showInstructions = !showInstructions">
          <span class="text-base">Instructions &mdash; Setting up your Custom Domain Name</span>
        </label>

        <div class="mt-2 text-xs sm:col-span-6 text-theme-500 dark:text-theme-100">
          <ol class="list-decimal list-outside ml-4 space-y-3">
            <li>Log into your domain registrar and add CNAME record with values below</li>
            <li>
              <strong>CNAME Host</strong> set to desired sub domain <span>(e.g. 'www') </span>
              <div class="mt-1">
                <strong>CNAME Value</strong> set to value below &darr;
              </div>
              <code :class="copyEffect ? 'scale-effect' : ''" class="py-4 px-6  bg-primary-50 dark:bg-primary-950 dark:hover:bg-primary-800 mt-2 mb-3 rounded-full font-bold text-primary-700 dark:text-primary-50 cursor-pointer flex items-center justify-between" @click="handleCopy()">
                <span>{{ destination }}</span>
                <span class="opacity-50 text-[10px]" v-html="copyText" />
              </code>
            </li>
          </ol>
          <p class="italic mt-4 opacity-60">
            DNS updates may take up to 48 hours to take effect. If you need help, contact our support team.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@keyframes scaleup {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
    opacity: 0;
  }
}

/* Class to apply the animation */
.scale-effect {
  animation: scaleup .4s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
