<script lang="ts" setup>
import type { vue } from '@factor/api'
import type { Card } from '../../card'
import type { Form } from '../../form'
import EditableText from './EditableText.vue'
import CardWrap from './CardWrap.vue'
import FormButton from './FormButton.vue'
import type { CardAlignmentMode } from './theme'

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
        <EditableText
          class="text-theme-900 text-[1.25em]"
          tag="h1"
          :card="card"
          field="heading"
          placeholder="Add Heading"
        />
        <EditableText
          class="text-theme-500 mt-2 text-[.85em]"
          tag="h3"
          :card="card"
          field="description"
          placeholder="Add Subheading"
        />
      </div>
      <FormButton btn="action" @click="card.next()">
        {{
          card.userConfig.value.buttonText || "Start"
        }}
      </FormButton>
    </div>
  </CardWrap>
</template>
