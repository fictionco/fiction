<script lang="ts" setup>
import { vue } from '@factor/api'
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

const c = vue.computed(() => props.card.userConfig.value)

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
      <div>
        <EditableText
          class="text-theme-900 text-[1.5em]"
          tag="h1"
          :card="card"
          field="heading"
        />
        <EditableText
          class="text-theme-500 text-[1.4em]"
          tag="h3"
          :card="card"
          field="description"
        />
      </div>

      <div v-if="c.buttonLink" class="mt-12">
        <FormButton
          btn="action"
          :href="c.buttonLink || 'https://www.kaption.co'"
        >
          {{ c.buttonText || "Finish" }}
        </FormButton>
      </div>
    </div>
  </CardWrap>
</template>
