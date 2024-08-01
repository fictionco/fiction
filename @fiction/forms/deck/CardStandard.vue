<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import type { Card } from '../../card'
import type { Form } from '../../form'
import CardWrap from './CardWrap.vue'
import InputWrap from './InputWrap.vue'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card>,
    required: true,
  },
  form: {
    type: Object as vue.PropType<Form>,
    required: true,
  },
})

const childCard = vue.computed(() => props.form.activeChildCard.value)
</script>

<template>
  <CardWrap
    v-slot="{ alignment, layout, media }"
    :card="card"
    :form="form"
    default-alignment="left"
  >
    <template v-if="!childCard">
      <div class="py-36 text-center">
        <ElSpinner
          v-if="!form.isDev"
          class="text-theme-300 inline-block h-10 w-10"
        />
        <div v-else class="">
          Add Elements To This Card
        </div>
      </div>
    </template>
    <template v-else>
      <InputWrap
        :key="childCard.cardId"
        :form="form"
        :card="childCard"
        :alignment="alignment"
        :layout="layout"
        :media="media"
      />
    </template>
  </CardWrap>
</template>
