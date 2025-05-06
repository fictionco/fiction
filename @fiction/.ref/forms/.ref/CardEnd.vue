<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardText from '@fiction/cards/CardText.vue'
import type { Form } from '../form'
import type { CardAlignmentMode } from '../schema.js'
import CardWrap from './CardWrap.vue'
import FormButton from './FormButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  form: { type: Object as vue.PropType<Form>, required: true },
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
  <CardWrap v-slot="{ alignment }" :card :form default-alignment="center">
    <div :class="textAlignment(alignment)">
      <div>
        <CardText
          class="text-theme-900 text-[1.5em]"
          tag="h1"
          :card
          path="title"
        />
        <CardText
          class="text-theme-500 text-[1.4em]"
          tag="h3"
          :card
          path="subTitle"
        />
      </div>

      <div v-if="c.buttonLink" class="mt-12">
        <FormButton
          btn="action"
          :href="c.buttonLink || 'https://www.fiction.com'"
        >
          {{ c.buttonText || "Finish" }}
        </FormButton>
      </div>
    </div>
  </CardWrap>
</template>
