<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { resetUi, vue, vueRouter } from '@factor/api'

import type { AggregationRow } from '@factor/api/plugin-dashboards'
import ElButton from '../../ui/ElButton.vue'
import ElSlideover from '../../ui/ElSlideOver.vue'
import ElMenuItem from '../../ui/ElMenuItem.vue'
import { getTargetingConfig } from '../../plugin-events/utils/filterTargeting'
import { useKaption } from '../../utils'
import type { EventParams } from '../../plugin-beacon'

const { kaptionClickHouse, kaptionDashboard } = useKaption()
const filter = kaptionDashboard.kaptionFilter

const router = vueRouter.useRouter()

const form = vue.ref<{
  category: string
  field: keyof EventParams | ''
  operator: '=' | '!='
  filter: string
}>({
  field: '',
  category: '',
  operator: '=',
  filter: '',
})

const referenceList = vue.ref<AggregationRow[]>([])
const sending = vue.ref(false)
const searching = vue.ref(false)

const filterCategory = getTargetingConfig([
  'behavior',
  'utm',
  'geography',
  'technology',
  'eventData',
])

const selectedCategory = vue.computed(() => {
  const sel = filterCategory.find(_ => _.value === form.value.category)

  return sel
})

const categoryList = vue.computed(() => {
  return selectedCategory.value ? [selectedCategory.value] : filterCategory
})

const fieldList = vue.computed(() => {
  const selectedCategory = filterCategory.find(
    _ => _.value === form.value.category,
  )

  const fieldList = selectedCategory?.list ?? []

  const selectedField = fieldList.find(_ => _.value === form.value.field)

  return selectedField ? [selectedField] : fieldList
})

async function search(): Promise<void> {
  searching.value = true

  const r = await kaptionClickHouse.requests.GetDimensionList.request({
    dimension: form.value.field as keyof EventParams,
    search: '',
  })

  if (r.status === 'success')
    referenceList.value = r.data ?? []

  searching.value = false
}

vue.watch(
  () => form.value.field,
  async (v, old) => {
    if (v && v !== old)
      await search()
  },
)

function resetForm(): void {
  referenceList.value = []
  form.value.filter = ''
}

function selectCategory(v?: string): void {
  resetForm()
  if (!v || form.value.category === v) {
    form.value.category = ''
    form.value.field = ''
  }
  else {
    form.value.category = v
  }
}

function selectField(v?: keyof EventParams): void {
  resetForm()
  if (!v || form.value.field === v)
    form.value.field = ''
  else
    form.value.field = v
}

function setFilterValue(v: string): void {
  form.value.filter = v
}

async function applyFilter(): Promise<void> {
  const { filter, field, operator = '=' } = form.value
  const link = kaptionDashboard.kaptionFilter.filterLink(
    filter,
    field,
    operator,
  )

  await router.push(link)
  resetForm()
  resetUi({ scope: 'all', cause: 'applyDataFilters' })
}
</script>

<template>
  <ElSlideover name="filters">
    <div
      class="flex h-12 w-12 items-center justify-center rounded-full bg-theme-100"
    >
      <svg
        focusable="false"
        version="1.1"
        viewBox="0 0 20 20"
        class="h-6 w-6 text-theme-500"
      >
        <path
          pid="0"
          d="M9 14h2a1 1 0 010 2H9a1 1 0 010-2zM3 4h14a1 1 0 010 2H3a1 1 0 110-2zm3 5h8a1 1 0 010 2H6a1 1 0 010-2z"
          fill-rule="evenodd"
          fill="currentColor"
        />
      </svg>
    </div>
    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Filters
      </h2>
      <p class="text-theme-500">
        Use filters to narrow down data and information to specific subsets.
      </p>
    </div>

    <ElForm @submit="applyFilter()">
      <ul class="mt-6 space-y-4">
        <li v-for="(category, i) in categoryList" :key="i">
          <ElMenuItem
            :name="category.name"
            :description="category.desc"
            :icon="category.icon"
            :selected="form.category === category.value"
            @click="selectCategory(category.value)"
          />
        </li>
      </ul>

      <ul v-if="fieldList.length > 0" class="mt-6 space-y-4">
        <li v-for="(field, i) in fieldList" :key="i">
          <ElMenuItem
            :name="field.name"
            :description="field.desc"
            :icon="field.icon || selectedCategory?.icon"
            :selected="form.field === field.value"
            @click="selectField(field.value as keyof EventParams)"
          />
        </li>
      </ul>

      <template v-if="form.field">
        <ElInput
          v-model="form.operator"
          input="InputRadioButton"
          :list="[
            {
              value: '=',
              name: 'Is',
            },
            {
              value: '!=',
              name: 'Is not',
            },
          ]"
          required
        />

        <ElInput
          v-model="form.filter"
          input="InputText"
          placeholder="Value"
          required
        />
      </template>

      <div v-if="form.filter" class="mt-6 mb-12 flex justify-between">
        <ElButton
          btn="primary"
          input="submit"
          size="md"
          :loading="sending"
        >
          Apply Filter &rarr;
        </ElButton>
      </div>

      <div v-if="searching" class="flex justify-center p-8">
        <div class="h-6 w-6 text-theme-300">
          <ElSpinner />
        </div>
      </div>
      <div v-else-if="referenceList.length > 0" class="mt-6">
        <div
          class="my-4 text-xs font-semibold uppercase tracking-wider text-theme-400"
        >
          Reference List
        </div>
        <div class="divide-y divide-slate-100">
          <div
            v-for="(li, i) in referenceList"
            :key="i"
            class="hover:text-primary-500 flex cursor-pointer justify-between p-2 text-xs font-semibold hover:bg-theme-50"
            @click="setFilterValue(li.name)"
          >
            <span>{{ li.name }}</span>
            <span class="text-theme-500">({{ li.count }})</span>
          </div>
        </div>
      </div>
    </ElForm>
  </ElSlideover>
</template>
