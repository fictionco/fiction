<script lang="ts" setup>
import type { vue } from '@fiction/core'
import CardText from '@fiction/cards/CardText.vue'
import type { Card } from '@fiction/site'
import type { Form } from '../form'
import type { CardAlignmentMode } from '../schema.js'
import CardWrap from './CardWrap.vue'
import FormButton from './FormButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  form: { type: Object as vue.PropType<Form>, required: true },
})

function textAlignment(alignment: CardAlignmentMode = 'center') {
  if (alignment === 'left')
    return 'text-left'
  else if (alignment === 'center')
    return 'text-center'
  else
    return 'text-right'
}
</script>

<template>
  <CardWrap
    v-slot="{ alignment }"
    :card="card"
    :form="form"
    default-alignment="center"
  >
    <div :class="textAlignment(alignment)">
      <div class="text-input-size mb-12">
        <CardText
          class="text-theme-900 text-[1.25em]"
          tag="h1"
          :card="card"
          path="title"
          placeholder="Add Title"
        />
        <CardText
          class="text-theme-500 mt-2 text-[.85em]"
          tag="h3"
          :card="card"
          path="subTitle"
          placeholder="Add Sub Title"
        />
      </div>
      <FormButton btn="action" @click="form.navigate({ _action: 'next' })">
        {{
          card.userConfig.value.buttonText || "Start"
        }}
      </FormButton>
    </div>
  </CardWrap>
</template>
