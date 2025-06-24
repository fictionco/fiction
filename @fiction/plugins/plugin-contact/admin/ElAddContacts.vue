<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionContact } from '..'
import type { Contact, ImportDetail } from '../schema'
import type { EmailStats } from './utils'
import CardButton from '@fiction/cards/CardButton.vue'
import { dayjs, log, objectId, omit, useService, vue } from '@fiction/core'
import { gravatarUrlSync } from '@fiction/core/utils/url.js'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { t } from '../schema'
import { csvToEmailList, parseAndValidateEmails } from './utils'

const { card } = defineProps<{ card: Card }>()

const emit = defineEmits<{
  (event: 'update:contacts', payload: Contact[] | undefined): void
}>()

const logger = log.contextLogger('ImportFile')

const service = useService<{ fictionContact: FictionContact }>()

const SAMPLE_EMAIL_NO = 10

const loading = vue.ref(false)
const draggingOver = vue.ref()
const fileList = vue.shallowRef<FileList>()
const importMethod = vue.ref<'csv' | 'text' | 'input'>('input')
const step = vue.ref<'import' | 'submit'>('import')
const rawTextEmailList = vue.ref<string>()
const inputEmailList = vue.ref<string[]>()
const tagList = vue.ref<string[]>([dayjs().format('YYYY-MM')])
const csvEmailList = vue.ref<string[]>([])
const emailImportListStats = vue.ref<EmailStats>()
async function uploadFiles() {
  const files = fileList.value

  loading.value = true

  const file = files?.[0]

  if (!file)
    return

  try {
    loading.value = true
    emailImportListStats.value = await csvToEmailList(file)
    logger.info(`upload result`, { data: csvEmailList.value })

    fileList.value = undefined

    step.value = 'submit'
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
  uploadFiles()
}
async function handleDropFile(ev: Event) {
  const event = ev as DragEvent
  fileList.value = event.dataTransfer?.files || undefined
  uploadFiles()
}

const emailListStats = vue.computed<EmailStats>(() => {
  if (importMethod.value === 'input') {
    return parseAndValidateEmails((inputEmailList.value || []).join(','))
  }
  else if (importMethod.value === 'text') {
    return parseAndValidateEmails(rawTextEmailList.value)
  }
  else {
    return emailImportListStats.value || { emails: [] }
  }
})

function prepareSubmit() {
  step.value = 'submit'
}

const info = vue.computed(() => {
  const stats = emailListStats.value
  const emails = stats.emails || []
  const sample = emails.slice(0, SAMPLE_EMAIL_NO)

  const emailItems: NavListItem[] = sample.map((email) => {
    return {
      label: email,
      description: 'Valid',
      media: gravatarUrlSync(email),
    }
  })

  return {
    ...stats,
    tags: tagList.value,
    emailItems,
  }
})

function getImportDetail(): ImportDetail {
  return {
    importId: objectId(),
    importedAt: new Date().toISOString(),
    count: info.value.validCount,
    tags: tagList.value,
  }
}

async function importSubscribers() {
  loading.value = true
  try {
    const importDetail = getImportDetail()
    const fullDetail = info.value || { emails: [] }
    const contacts = fullDetail.emails.map(email => ({ email, tags: tagList.value, importDetail }))

    const orgId = service.fictionUser.activeOrgId.value

    if (!orgId) {
      logger.error(`no orgId`)
      return
    }

    if (!contacts.length) {
      logger.error(`no contacts`)
      return
    }

    const r = await service.fictionContact.requests.ManageContact.projectRequest({ _action: 'bulkCreate', contacts })

    if (r.status === 'success') {
      const changedCount = r.indexMeta?.changedCount || 0
      service.fictionEnv.events.emit('notify', {
        type: 'success',
        message: `${changedCount} Subscribers imported successfully`,
      })

      logger.info(`imported subscribers`, { data: omit(fullDetail, 'emails') })

      await card.goto('/audience')

      rawTextEmailList.value = ''
      inputEmailList.value = []
      emailImportListStats.value = undefined

      service.fictionContact.cacheKey.value++

      emit('update:contacts', r.data)
    }
    else {
      step.value = 'import'
    }
  }
  catch (error) {
    logger.error(`import error`, { error })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="">
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0 -translate-x-12"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="ease-in duration-300"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-12"
      mode="out-in"
    >
      <div v-if="step === 'submit'" class="space-y-6">
        <div class="flex gap-4 justify-between items-center">
          <div class="font-semibold">
            Review Information
          </div>
          <div class="flex gap-4 justify-between">
            <CardButton :card theme="default" type="submit" icon="i-tabler-arrow-left" @click="step = 'import'">
              Edit
            </CardButton>
            <CardButton
              :card
              data-test-id="add-confirm-button"
              theme="primary"
              type="submit"
              icon="i-tabler-upload"
              :loading="loading"
              @click="importSubscribers()"
            >
              Confirm and Add
            </CardButton>
          </div>
        </div>
        <div class="p-8 rounded-md border border-theme-200 dark:border-theme-600/70 space-y-4 flex gap-10">
          <div class="space-y-4 max-w-[250px]">
            <div>
              <div class="text-theme-500 font-normal text-sm">
                Valid Emails
              </div>
              <div class="font-semibold text-lg">
                {{ info.validCount || 0 }}
              </div>
            </div>
            <div v-if="info.invalidCount">
              <div class="text-theme-500 font-normal text-sm">
                Invalid Emails
              </div>
              <div class="font-semibold text-lg">
                {{ info.invalidCount || 0 }}
              </div>
              <div class="text-xs text-orange-500 dark:text-orange-400">
                {{ Object.entries(info.invalidReasons || {}).map(_ => `${_[0]}(${_[1]})`)?.join(', ') }}
              </div>
            </div>
            <div>
              <div class="text-theme-500 font-normal text-sm">
                Tags to Add
              </div>
              <div v-if="tagList.length" class="font-semibold text-base flex gap-3 py-2">
                <XButton v-for="tag in tagList" :key="tag" size="xs" design="outline" theme="primary">
                  {{ tag }}
                </XButton>
              </div>
              <div v-else class="py-3 text-xs text-theme-500">
                (No tags)
              </div>
            </div>
          </div>
          <div class=" flex-grow max-h-[300px] overflow-y-auto">
            <ElIndexGrid list-title="Sample" :list="info.emailItems" ui-size="xs" />

            <div v-if="info.emails.length > SAMPLE_EMAIL_NO" class="text-theme-500 text-sm p-4 text-center">
              And {{ info.emails.length - SAMPLE_EMAIL_NO }} more...
            </div>
          </div>
        </div>
      </div>
      <div v-else class="space-y-6" @dragover.prevent @drop.prevent>
        <div class="flex gap-4 justify-between items-center">
          <ElInput
            v-model="importMethod"
            input="InputRadioButton"
            :list="[
              { label: 'By Email', value: 'input', icon: { class: 'i-tabler-mail' } },
              { label: 'Import (CSV)', value: 'csv', icon: { class: 'i-tabler-file-type-csv' } },
              { label: 'Comma Separated', value: 'text', icon: { class: 'i-tabler-text-scan-2' } },
            ]"
            default-text="Select Import Method"
            ui-size="md"
          />
          <CardButton
            v-if="!info.emails.length"
            :card
            :disabled="true"
            data-test-id="no-emails"
            theme="orange"
            design="outline"
            type="submit"
            icon-after="i-tabler-arrow-right"
          >
            Add Emails to Continue
          </CardButton>
          <CardButton
            v-else
            :card
            data-test-id="review-button"
            theme="primary"
            type="submit"
            icon-after="i-tabler-arrow-right"
            :loading="loading"
            @click.prevent="prepareSubmit()"
          >
            Review and Add
          </CardButton>
        </div>

        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 -translate-x-12"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="ease-in duration-300"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-12"
          mode="out-in"
        >
          <ElInput
            v-if="importMethod === 'input'"
            v-model="inputEmailList"
            input="InputEmailMulti"
            label="Enter Email Addresses"
            sub-label="Tab or Enter to add multiple emails"
            ui-size="lg"
            :rows="5"
            placeholder="email@example.com"
            data-test-id="text-email-list"
          />
          <ElInput
            v-else-if="importMethod === 'text'"
            v-model="rawTextEmailList"
            input="InputTextarea"
            label="Enter Email Addresses"
            sub-label="Separate each email address with a comma or new line"
            :rows="5"
            :placeholder="['friend@example.com', 'colleague@example2.com'].join(',\n')"
            data-test-id="text-email-list"
          />

          <ElInput
            v-else
            label="Upload Subscribers via CSV File"
            ui-size="lg"
            @drop="handleDropFile"
            @dragover="draggingOver = true"
            @dragleave="draggingOver = false"
          >
            <label for="file-upload" class="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-theme-300 dark:border-theme-600 hover:border-theme-400 dark:hover:border-theme-500 hover:bg-theme-50 dark:hover:bg-theme-700 px-6 py-10">
              <div class="text-center">
                <div class="text-5xl i-tabler-file-type-csv text-theme-300" />
                <div class="mt-4 flex text-sm leading-6 text-theme-600">
                  <div class="relative cursor-pointer rounded-md  font-semibold text-primary-500 dark:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
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
                @change="(_) => handleUploadFile(_)"
              >
            </label>
          </ElInput>
        </transition>
        <ElInput
          v-model="tagList"
          input="InputTags"
          ui-size="lg"
          label="Tags (Optional)"
          sub-label="Used to categorize contacts"
          :rows="10"
          data-test-id="tag-list"
          placeholder="e.g. Work, Webinar..."
          :input-props="{ theme: 'orange', table: t.contact, column: 'tags' }"
        />
      </div>
    </transition>
  </div>
</template>
