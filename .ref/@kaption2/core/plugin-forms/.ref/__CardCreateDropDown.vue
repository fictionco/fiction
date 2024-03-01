<script lang="ts" setup>
import type { vue } from '@factor/api'
import { groupBy, resetUi, toLabel } from '@factor/api'
import type { Form } from '../form'
import type { CardInputType } from '../inputTypes'

const props = defineProps({
  form: {
    type: Object as vue.PropType<Form>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  (event: 'addCard', payload: string): void
}>()

const groupedCards = groupBy<Record<string, CardInputType<string>[]>>(
  props.form.theme.value.inputTypes,
  'category',
)

function handleEmit(typeKey: string) {
  emit('addCard', typeKey)
  resetUi()
}
</script>

<template>
  <div
    class="absolute left-2 top-2 z-10 w-[33rem] rounded-lg bg-white p-6 shadow-real-high ring-1 ring-black/5"
    @click.stop
  >
    <div class="mb-6">
      Add New Input...
    </div>
    <div class="grid grid-cols-12 gap-6">
      <div
        v-for="(groupCardTypes, group) in groupedCards"
        :key="group"
        class="col-span-4 text-left text-xs font-medium"
      >
        <div class="">
          {{ toLabel(group) }}
        </div>
        <div
          v-for="(item, ii) in groupCardTypes"
          :key="ii"
          class="text-primary-500 my-2 cursor-pointer select-none"
          :title="item.description"
        >
          <div @click="handleEmit(item.typeKey)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
