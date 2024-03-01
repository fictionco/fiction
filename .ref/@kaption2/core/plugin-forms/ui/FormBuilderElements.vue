<script lang="ts" setup>
import type { vue } from '@factor/api'
import { groupBy, resetUi, toLabel } from '@factor/api'
import type { Form } from '../form'
import type { CardType } from '../cardTypes'

const props = defineProps({
  form: {
    type: Object as vue.PropType<Form>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  (event: 'addCard', payload: string): void
}>()

const groupedCards = groupBy<Record<string, CardType<string>[]>>(
  props.form.theme.value.cardTypes,
  'category',
)

function handleEmit(typeKey: string) {
  emit('addCard', typeKey)
  resetUi()
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between py-4">
      <h3 class="text-sm font-bold">
        Add Items
      </h3>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div
        v-for="(groupCardTypes, group) in groupedCards"
        :key="group"
        class="col-span-12 text-left text-xs font-medium"
      >
        <div class="text-[11px] uppercase tracking-wide text-theme-400">
          {{ toLabel(group) }}
        </div>
        <div
          v-for="(item, ii) in groupCardTypes"
          :key="ii"
          class="my-2 flex cursor-pointer select-none items-center space-x-2 rounded-md hover:bg-theme-100"
          :title="item.description"
          @click="handleEmit(item.key)"
        >
          <div
            class="flex items-center justify-center rounded-md p-2 text-white"
            :class="[
              item.iconStyle?.bg || 'bg-theme-200',
              item.iconStyle?.text || 'text-theme-700',
            ]"
          >
            <div class="text-sm" :class="[item.iconStyle?.icon]" />
          </div>
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
