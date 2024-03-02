<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import InputText from '@fiction/ui/InputText.vue'

export interface CustomDomain {
  hostname?: string
  isPrimary?: boolean
}

const props = defineProps({
  modelValue: { type: Array as vue.PropType<CustomDomain[]>, default: () => ([]) },
  destination: { type: String, required: true },
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

const defaultCopyText = 'copy'
const copyText = vue.ref(defaultCopyText)
async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.destination)
    copyText.value = '...copied!'
    setTimeout(() => (copyText.value = defaultCopyText), 1500)
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

      class=" grid grid-cols-1 gap-x-12 gap-y-6   text-xs"
    >
      <div class="sm:col-span-6">
        <label for="domain" class="block text-theme-500">
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
                @update:model-value="updateHostname($event, i)"
              />
              <div class="flex space-x-1 mt-2 justify-between text-[9px]  font-medium text-theme-500 select-none">
                <div
                  class="rounded-md px-2 py-0.5 flex space-x-0.5 items-center cursor-pointer hover:bg-theme-200"
                  :class="item.isPrimary ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-theme-0' : 'bg-theme-100 dark:bg-theme-950'"
                  @click.prevent="setPrimary(i)"
                >
                  <div class="text-[11px]">
                    <div :class="item.isPrimary ? 'i-tabler-check' : 'i-tabler-switch-horizontal'" />
                  </div>
                  <div>
                    {{ item.isPrimary ? 'Primary Domain' : 'Set as Primary' }}
                  </div>
                </div>
                <div class="bg-theme-100 dark:bg-theme-700 rounded-md px-2 py-0.5 flex space-x-0.5 items-center cursor-pointer hover:bg-theme-200" @click.prevent="deleteDomain(i)">
                  <div class="text-[11px]">
                    <div class="i-tabler-x" />
                  </div>
                  <div>
                    Remove
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-new mt-4">
          <ElButton
            btn="default"
            size="xs"
            @click.prevent="addCustomDomain()"
          >
            Add Domain
          </ElButton>
        </div>
      </div>
      <div class="sm:col-span-6 bg-theme-50 dark:bg-theme-800 rounded-lg p-6 mb-8">
        <label for="instructions" class="block font-bold space-x-4 select-none">
          <span class="text-base">Instructions &mdash; Setting up your Custom Domain Name</span>
          <ElButton btn="default" size="xs" tag="div" @click="showInstructions = !showInstructions">{{ showInstructions ? 'Hide' : 'Show' }} Instructions</ElButton>
        </label>

        <transition
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          enter-active-class="transition ease-out duration-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div v-if="showInstructions" class="mt-2 text-xs sm:col-span-6 text-theme-500 dark:text-theme-100">
            <ol class="list-decimal list-outside ml-4 space-y-3">
              <li>Log into your domain registrar.</li>
              <li>In DNS settings add a CNAME record.</li>
              <li>
                <strong>Host</strong> &rarr; sub domain <span>(e.g. 'www') </span>
                <div class="mt-1">
                  <strong>Value</strong> to &darr;
                </div>
                <code class="py-4 px-6  bg-primary-50 dark:bg-primary-950 dark:hover:bg-primary-800 mt-2 mb-3 rounded-full font-bold text-primary-700 dark:text-primary-50 cursor-pointer flex items-center justify-between" @click="handleCopy()">
                  <span>{{ destination }}</span>
                  <span class="opacity-50 text-[10px]">
                    ({{ copyText }})
                  </span>
                </code>
              </li>

              <li>Save the changes.</li>
            </ol>
            <p class="italic mt-4 opacity-60">
              DNS updates may take up to 48 hours to take effect. If you need help, contact our support team.
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
