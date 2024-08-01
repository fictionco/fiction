<script lang="ts" setup>
import ElImage from '@fiction/ui/media/ElImage.vue'
import { vue } from '@fiction/core'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site'
import CardText from '@fiction/cards/CardText.vue'
import { inputs } from '@fiction/ui/inputs'
import type { Form } from '../form'
import type { InputUserConfig } from '../templates.js'
import FormButton from './FormButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<InputUserConfig>>, required: true },
  form: { type: Object as vue.PropType<Form>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)
const inputComponent = vue.computed(() => {
  return inputs[uc.value.inputType] || inputs.InputText
})

const inputEl = vue.ref<HTMLElement>()
const submitEl = vue.ref<HTMLElement>()

function clickSubmit() {
  const el = document.querySelector('.submit-button') as HTMLElement | undefined

  el?.click()
}
</script>

<template>
  <div
    class="header-font relative"
    :data-card-id="card.cardId"
  >
    <ElForm @submit="form.navigate({ _action: 'next' })">
      <div class="relative">
        <div class="text-input-size grow">
          <CardText
            class="text-theme-900 text-[1.2em]"
            tag="h2"
            :card
            path="heading"
            placeholder="Your question here..."
          />
          <CardText
            class="text-theme-500 mt-2 text-[.85em]"
            tag="p"
            :card
            path="description"
            placeholder="Description (optional)"
          />
        </div>
        <div class="absolute right-0 top-0">
          <span
            v-if="card.userConfig.value.isRequired"
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-base font-medium text-theme-400"
          >
            <div class="i-carbon-asterisk" />
          </span>
        </div>
      </div>

      <!-- <div v-if="layout === 'hero' && media" class="hero my-10">
        <ElImage
          image-class="max-h-[40vh]"
          :media
          fit="inline"
        />
      </div> -->

      <div
        v-if="inputComponent"
        ref="inputEl"
        class="relative mt-8 mb-4"
      >
        <component
          :is="inputComponent"
          :card
          :form
          v-bind="uc"
        />
      </div>
      <div class="mt-8">
        <FormButton
          class="submit-button"
          btn="action"
          type="submit"
        >
          Next
        </FormButton>
      </div>
    </ElForm>
  </div>
</template>
