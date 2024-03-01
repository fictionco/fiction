<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { emitEvent, onResetUi, resetUi, shortId, vue } from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import type { AggregationRow } from '@factor/api/plugin-dashboards'
import ElButton from '../../ui/ElButton.vue'
import ElSlideover from '../../ui/ElSlideOver.vue'
import ElMenuItem from '../../ui/ElMenuItem.vue'

import { KaptionClickHouse } from '../../plugin-clickhouse'
import { useKaption } from '../..'
import { getTargetingConfig } from '../utils/filterTargeting'
import type { TargetingFilter } from '../types'

const props = defineProps({
  editing: { type: Object as vue.PropType<TargetingFilter>, default: () => {} },
  kaptionClickHouse: KaptionClickHouse,
})

const emit = defineEmits(['add'])

const { kaptionClickHouse } = useKaption()

const referenceList = vue.ref<AggregationRow[]>([])

const searching = vue.ref(false)
const formDefault: TargetingFilter = {
  field: undefined,
  category: undefined,
  operator: '=',
  filter: undefined,
} as const

const form = vue.ref<TargetingFilter>({ ...formDefault })

const filterCategory = getTargetingConfig([
  'utm',
  'technology',
  'geography',
  'session',
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

const sending = vue.ref(false)

vue.watch(
  () => props.editing,
  (v) => {
    if (v)
      form.value = { ...v }
  },
  { immediate: true },
)

function saveRule(): void {
  form.value.ruleId = form.value.ruleId ?? shortId()

  const vals = form.value.filter

  if (Array.isArray(vals))
    form.value.filter = vals.join(', ')
  else if (typeof vals === 'boolean')
    form.value.filter = vals ? 'true' : 'false'

  emit('add', form.value)
  form.value = { ...formDefault }
  referenceList.value = []
  resetUi()
}

async function search(): Promise<void> {
  if (!form.value.field)
    return

  searching.value = true

  const r = await kaptionClickHouse.requests.GetDimensionList.request({
    dimension: form.value.field,
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

function removeRule(ruleId?: string): void {
  const confirmed = confirm('Are you sure?')

  if (confirmed && ruleId) {
    emitEvent('removeRule', ruleId)
    resetUi()
  }
}

function resetForm(): void {
  referenceList.value = []
  form.value.filter = ''
}

onResetUi((args) => {
  if (args.scope === 'all') {
    form.value = { ...formDefault }
    resetForm()
  }
})

function selectCategory(v?: TargetingFilter['category']): void {
  resetForm()
  if (form.value.category === v) {
    form.value.category = undefined
    form.value.field = undefined
  }
  else {
    form.value.category = v
  }
}

function selectField(v?: TargetingFilter['field']): void {
  resetForm()
  if (form.value.field === v)
    form.value.field = undefined
  else if (v)
    form.value.field = v
}

function setFilterValue(v: string): void {
  form.value.filter = form.value.filter ? `${form.value.filter}, ${v}` : v
}
</script>

<template>
  <ElSlideover name="newRules">
    <div
      class="bg-theme-100 flex h-12 w-12 items-center justify-center rounded-full"
    >
      <svg
        class="text-theme-500 h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0 2c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zm0 2C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"
        />
      </svg>
    </div>
    <div class="py-3">
      <h2 class="text-xl font-semibold">
        New Targeting Rule
      </h2>
      <p class="text-theme-500">
        Which visitors are eligible
      </p>
    </div>

    <ElForm @submit="saveRule()">
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

      <ul v-if="fieldList.length > 0" class="mt-6 space-y-4 pl-6">
        <li v-for="(field, i) in fieldList" :key="i">
          <ElMenuItem
            :name="field.name"
            :description="field.desc"
            :icon="field.icon || selectedCategory?.icon"
            :selected="form.field === field.value"
            @click="selectField(field.value)"
          />
        </li>
      </ul>

      <template v-if="form.field">
        <ElInput
          v-model="form.operator"
          class="my-8"
          input="InputRadioButton"
          :list="[
            {
              value: '=',
              name: 'Is Like',
            },
            {
              value: '!=',
              name: 'Is Not Like',
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

      <div class="mt-8 mb-12 flex justify-between">
        <ElButton
          btn="slate"
          input="submit"
          :loading="sending"
          :class="form.field ? '' : 'opacity-60'"
        >
          Add Rule
        </ElButton>

        <ElButton
          v-if="form.ruleId"
          btn="default"
          size="md"
          @click.prevent="removeRule(form.ruleId)"
        >
          Remove Rule
        </ElButton>
      </div>
      <div v-if="searching" class="flex justify-center p-8">
        <div class="text-theme-300 h-6 w-6">
          <ElSpinner />
        </div>
      </div>
      <div v-else-if="referenceList.length > 0" class="mt-6">
        <div
          class="text-theme-400 my-4 text-xs font-semibold uppercase tracking-wider"
        >
          Reference List
        </div>
        <div class="divide-y divide-slate-100">
          <div
            v-for="(li, i) in referenceList"
            :key="i"
            class="hover:bg-theme-50 flex cursor-pointer justify-between p-2 text-xs font-semibold hover:text-primary-500"
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
