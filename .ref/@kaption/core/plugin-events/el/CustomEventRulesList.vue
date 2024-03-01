<script lang="ts" setup>
import { vue } from '@factor/api'
import ElButton from '../../ui/ElButton.vue'
import type { TargetingFilter } from '../types'
import PanelRule from './CustomEventRulesPanel.vue'

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<TargetingFilter[]>,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])
const rules = vue.computed<TargetingFilter[]>({
  get: () => props.modelValue,
  set: (v) => {
    emit('update:modelValue', v)
  },
})

const editing = vue.ref<TargetingFilter | undefined>()

const showTargetingRuleNew = vue.ref(false)

function editRule(rule: TargetingFilter): void {
  editing.value = rule
  showTargetingRuleNew.value = true
}

function newRule(): void {
  editing.value = undefined
  showTargetingRuleNew.value = true
}

function addNewRule(rule: TargetingFilter): void {
  const r = rules.value ?? []
  let found = false
  const newRules = r.map((_) => {
    if (_.ruleId === rule.ruleId) {
      found = true
      return rule
    }
    else {
      return _
    }
  })
  if (!found)
    rules.value = [...r, rule]
  else
    rules.value = newRules
}
</script>

<template>
  <div>
    <div>
      <ul class="divide-y divide-slate-200 overflow-hidden rounded-lg">
        <template v-if="!modelValue || modelValue.length === 0">
          <li
            class="flex items-center space-x-2 px-2 py-6 text-sm font-semibold text-theme-500 sm:px-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <span>Targeting Everyone</span>
          </li>
        </template>
        <template v-else>
          <li
            v-for="(rule, i) in rules"
            :key="i"
            class="flex items-center justify-between px-2 py-6 sm:px-6"
          >
            <div class="flex items-baseline space-x-4 text-sm text-theme-500">
              <span class="text-primary-500 shrink-0 font-medium">
                {{ rule.field }}</span>

              <div class="font-medium text-theme-500">
                <span v-if="rule.operator === '='">is</span>
                <span v-else>is not</span>
              </div>
              <div class="">
                <span class="text-primary-500 shrink-0 font-medium">
                  {{ rule.filter }}
                </span>
              </div>
            </div>

            <div class="ml-2 w-12 text-right">
              <ElButton
                size="sm"
                class="text-primary-500 hover:bg-primary-50 text-base font-medium sm:text-base md:text-sm"
                btn="default"
                @click.stop.prevent="editRule(rule)"
              >
                Edit
              </ElButton>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <div class="border-t border-slate-200 p-4 lg:p-6">
      <ElButton
        btn="slate"
        size="sm"
        @click.stop.prevent="newRule()"
      >
        Add New
      </ElButton>
    </div>
    <PanelRule
      v-model:vis="showTargetingRuleNew"
      :editing="editing"
      @add="addNewRule($event)"
    />
  </div>
</template>
