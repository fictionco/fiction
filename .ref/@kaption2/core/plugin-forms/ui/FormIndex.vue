<script lang="ts" setup>
import { dayjs, emitEvent, vue } from '@factor/api'

import ElTable from '@factor/ui/ElTable.vue'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import ElPanel from '../../ui/ElPanel.vue'
import FormWrap from './FormWrap.vue'

const { factorRouter, kaptionForms } = useKaption()

const indexState = kaptionForms.activeFormIndexState

const loading = vue.computed(() => indexState.value.status === 'loading')

const editActions = ['delete']

const formattedData = vue.computed(() => {
  if (!indexState.value?.data)
    return []

  const rows = indexState.value.data.map((form) => {
    const config = form.userConfig.value
    return [
      form.formId,
      config.formName || '[No Name]',
      form.templateId.value,
      config.cards?.length || 0,
      form.views || 0,
      form.submissions || 0,
      dayjs(form.updatedAt).format('MMM DD, YYYY'),
    ]
  })
  return [
    ['', 'Name', 'TemplateId', 'Questions', 'Views', 'Submissions', 'Edited'],
    ...rows,
  ]
})

async function handleRowClick(formId: string) {
  const link = factorRouter.link('formBuilder', {
    formId,
    topic: 'create',
  }).value

  await factorRouter.router.push(link)
}

async function handleBulkEdit(params: {
  _action: string
  selectedIds: string[]
}) {
  const _action = params._action as 'delete'

  if (_action === 'delete') {
    const confirmed = confirm('Are you sure you want to delete these forms?')
    if (!confirmed)
      return
  }

  await kaptionForms.bulkEdit({ _action, selectedIds: params.selectedIds })
}
</script>

<template>
  <FormWrap :loading="loading">
    <template #actions>
      <ElButton
        btn="slate"
        class="hidden lg:inline-flex"
        @click.prevent.stop="emitEvent('newForm')"
      >
        New Form
      </ElButton>
    </template>

    <ElPanel title="Your Forms">
      <ElTable
        :table="formattedData"
        :index-meta="indexState.indexMeta"
        :edit-actions="editActions"
        :empty="{
          title: 'No forms found',
          description: 'Create one to get started',
        }"
        :actions="[
          {
            name: 'New Form',
            onClick: () => emitEvent('newForm'),
          },
        ]"
        :on-row-click="handleRowClick"
        @bulk-edit="handleBulkEdit($event)"
      />
    </ElPanel>
  </FormWrap>
</template>
