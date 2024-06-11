<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { type ListItem, log, useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FictionSubscribe } from '..'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const logger = log.contextLogger('ImportFile')

const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const loading = vue.ref(false)
const draggingOver = vue.ref()
const fileList = vue.shallowRef<FileList>()
const importMethod = vue.ref<'csv' | 'text'>('text')
const step = vue.ref<'import' | 'submit'>('import')

async function uploadFiles() {
  const files = fileList.value

  loading.value = true

  const file = files?.[0]

  if (!file)
    return

  try {
    loading.value = true
    const result = await service.fictionSubscribe.uploadFile({ file })

    if (!result)
      return

    logger.info(`upload result`, { data: result })
  }
  catch (error) {
    logger.error(`upload error`, { error })
  }
  finally {
    loading.value = false
  }
}

async function handleUploadFile(ev: Event) {
  const target = ev.target as HTMLInputElement
  fileList.value = target.files || undefined
}
async function handleDropFile(ev: Event) {
  const event = ev as DragEvent
  fileList.value = event.dataTransfer?.files || undefined
}

const rawEmailList = vue.ref<string>()
const emailList = vue.computed(() => {
  const emails = rawEmailList.value?.split(/[\s,]+/).filter(Boolean) || []
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)
  return emails
    .map(email => email.trim().toLowerCase())
    .filter(isValidEmail)
})

function prepareSubmit() {
  step.value = 'submit'
}

const info = vue.computed<ListItem[]>(() => {
  return [
    { name: 'Emails to Import', value: '405' },
    { name: 'Email Addresses', value: emailList.value.slice(0, 10).join(', ') || 'None' },
  ]
})
</script>

<template>
  <div class="min-h-[40dvh] p-16 ">
    <div v-if="step === 'submit'" class="space-y-6">
      <ElInput label="Review Information" sub-label="Here is what we'll be importing...">
        <div class="p-8 rounded-md border border-theme-200 space-y-4">
          <div v-for="(item, i) in info" :key="i" class="flex flex-col ">
            <div class="text-theme-500 font-normal text-sm">
              {{ item.name }}
            </div>
            <div class="font-semibold text-xl">
              {{ item.value }}
            </div>
          </div>
        </div>
      </ElInput>

      <div class="flex gap-4 justify-between">
        <ElButton data-test-id="submit" btn="primary" type="submit" icon-after="i-tabler-upload" :loading="loading">
          Import Subscribers
        </ElButton>
        <ElButton btn="default" type="submit" icon="i-tabler-x" :loading="loading" @click="step = 'import'">
          Cancel
        </ElButton>
      </div>
    </div>
    <div v-else class="space-y-6" @dragover.prevent @drop.prevent>
      <ElInput
        v-model="importMethod"
        label="Import Method"
        input="InputSelectCustom"
        :list="[
          { name: 'Upload a CSV file', value: 'csv' },
          { name: 'Copy and Paste Email Addresses', value: 'text' },
        ]"
        default-text="Select Import Method"
      />

      <ElInput
        v-if="importMethod === 'text'"
        v-model="rawEmailList"
        input="InputTextarea"
        label="Enter Email Addresses"
        sub-label="Separate each email address with a comma or new line"
        rows="10"
        placeholder="email1@example.com,email2@example.com"
      />

      <ElInput
        v-else
        label="Upload Subscribers via CSV File"
        ui-size="lg"
        @drop="handleDropFile"
        @dragover="draggingOver = true"
        @dragleave="draggingOver = false"
      >
        <div v-if="fileList?.length" class="p-12 space-y-4 text-center rounded-lg border border-dashed border-theme-300 dark:border-theme-600">
          <div class="font-semibold text-lg bg-theme-50 inline-flex items-center gap-2 px-2 rounded-md">
            <div class="i-tabler-file" /><div>{{ fileList?.[0].name }}</div>
          </div>
          <ElActions
            class="justify-center flex gap-4"
            ui-size="md"
            :actions="[{
                         icon: 'i-tabler-arrow-left',
                         name: 'Cancel',
                         onClick: () => { fileList = undefined },
                         btn: 'default',
                       },
                       {
                         name: 'Upload File',
                         icon: 'i-tabler-upload',
                         onClick: () => uploadFiles(),
                         btn: 'primary',
                         loading,
                       }]"
          />
        </div>
        <label v-else for="file-upload" class="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-theme-300 dark:border-theme-600 hover:border-theme-400 hover:bg-theme-50 px-6 py-10">
          <div class="text-center">
            <div class="text-5xl i-tabler-file-type-csv text-theme-300" />
            <div class="mt-4 flex text-sm leading-6 text-theme-600">
              <div class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                <span>Upload a file</span>
              </div>
              <p class="pl-1">
                Click to upload or drag and drop
              </p>
            </div>
            <p class="text-xs text-theme-500">
              CSV Files only - 20k Rows Max
            </p>
          </div>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            class="sr-only"
            accept=".csv,text/csv"
            @change="handleUploadFile"
          >
        </label>
      </ElInput>

      <div>
        <ElButton
          data-test-id="save"
          btn="primary"
          type="submit"
          icon-after="i-tabler-arrow-right"
          :loading="loading"
          @click.prevent="prepareSubmit()"
        >
          Next
        </ElButton>
      </div>
    </div>
  </div>
</template>
