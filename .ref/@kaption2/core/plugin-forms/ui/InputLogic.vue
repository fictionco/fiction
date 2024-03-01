<script lang="ts" setup>
import type { ListItem } from '@factor/api'
import { objectId, vue } from '@factor/api'
import InputSelect from '@factor/ui/InputSelect.vue'
import InputNumber from '@factor/ui/InputNumber.vue'
import ElButton from '../../ui/ElButton.vue'
import type { CardValueFormat } from '../cardTypes'
import type { Card } from '../card'
import type { LogicStep } from '../logic'
import { getAvailableOperatorList } from '../logic'

const props = defineProps({
  modelValue: { type: Array as vue.PropType<LogicStep[]>, default: () => [] },
  valueFormat: {
    type: String as vue.PropType<CardValueFormat>,
    default: 'none',
  },
  list: {
    type: Array as vue.PropType<(ListItem | 'divider' | string)[]>,
    default: () => [],
  },
  card: {
    type: Object as vue.PropType<Card>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: LogicStep[]): void
}>()

const skipToList = vue.computed<ListItem[]>(() => {
  const li = props.card.form.nextList.value.map((c, i) => {
    return {
      name: c.cardName.value,
      value: c.cardKey.value || c.cardId,
      cardId: c.cardId,
    }
  })

  return li
})

function cardName(cardId?: string) {
  return skipToList.value.find(l => l.cardId === cardId)?.name
}

const operators = vue.computed(() => {
  return getAvailableOperatorList(props.valueFormat)
})

function opName(opVal?: string) {
  return operators.value.find(l => l.value === opVal)?.name
}

function stepDefault() {
  return {
    stepId: objectId(),
    operator: undefined,
    valueKey: undefined,
    value: undefined,
    skipTo: undefined,
  }
}
const createStep = vue.ref<LogicStep>(stepDefault())

function addStep() {
  emit('update:modelValue', [...props.modelValue, createStep.value])
  createStep.value = stepDefault()
}

function removeStep(stepId?: string) {
  const newSteps = props.modelValue.filter(s => s.stepId !== stepId)
  emit('update:modelValue', newSteps)
}
</script>

<template>
  <div class="space-y-2 rounded-md bg-theme-100 p-2">
    <div
      v-for="step in modelValue"
      :key="step.stepId"
      class="flex rounded-md border border-indigo-300 bg-indigo-50 py-1 px-2 text-indigo-500"
      :data-step-id="step.stepId"
    >
      <div class="grow text-[11px]">
        <div class="space-x-1">
          <span>If <span class="text-indigo-800">value</span></span>
          <span class="italic text-indigo-500">{{
            opName(step.operator)
          }}</span>
          <span class="text-indigo-800">"{{ step.value }}"</span>
        </div>
        <div class="space-x-1">
          <span>skip to &rarr;</span>
          <span class="text-indigo-800">{{ cardName(step.skipTo) }}</span>
        </div>
      </div>
      <div class="hover:text-indigo-700" @click.stop="removeStep(step.stepId)">
        <div class="i-carbon-close" />
      </div>
    </div>
    <div>
      <div class="mb-1 text-[10px] uppercase text-theme-400">
        If the value{{ valueFormat === "ranking" ? " of" : "" }}...
      </div>
      <template v-if="valueFormat === 'ranking'">
        <InputSelect v-model="createStep.valueKey" :list="list" />
      </template>

      <InputSelect
        v-model="createStep.operator"
        class="mb-1"
        :list="operators"
      />
      <template v-if="createStep.operator && createStep.operator !== '#'">
        <InputSelect
          v-if="valueFormat === 'select'"
          v-model="createStep.value"
          :list="list"
        />
        <InputNumber
          v-if="valueFormat === 'number' || valueFormat === 'ranking'"
          v-model="createStep.value"
        />
      </template>
    </div>
    <div
      v-if="
        createStep.operator === '#' || typeof createStep.value !== 'undefined'
      "
    >
      <div class="mb-1 text-[10px] uppercase text-theme-400">
        Skip To...
      </div>
      <InputSelect v-model="createStep.skipTo" :list="skipToList" />
    </div>
    <div v-if="createStep.skipTo" class="text-right">
      <ElButton size="xs" @click="addStep()">
        Add Logic Step
      </ElButton>
    </div>
  </div>
</template>
