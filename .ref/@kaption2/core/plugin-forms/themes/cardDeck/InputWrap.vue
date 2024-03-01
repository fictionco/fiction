<script lang="ts" setup>
import ElRichImage from '@factor/ui/ElRichImage.vue'
import type { MediaDisplayObject } from '@factor/ui/utils'
import { vue } from '@factor/api'
import ElForm from '@factor/ui/ElForm.vue'
import type { Card } from '../../card'
import type { Form } from '../../form'
import FormButton from './FormButton.vue'
import EditableText from './EditableText.vue'
import type { CardAlignmentMode, CardLayoutMode } from './theme'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card>,
    required: true,
  },
  form: {
    type: Object as vue.PropType<Form>,
    required: true,
  },
  alignment: {
    type: String as vue.PropType<CardAlignmentMode>,
    default: undefined,
  },
  layout: {
    type: String as vue.PropType<CardLayoutMode>,
    default: undefined,
  },
  media: {
    type: Object as vue.PropType<MediaDisplayObject>,
    default: undefined,
  },
})
const inputEl = vue.ref<HTMLElement>()
const submitEl = vue.ref<HTMLElement>()
const el = vue.computed(() => props.card.el.value)

const textAlignment = vue.computed(() => {
  if (props.alignment === 'left')
    return 'text-left'
  else if (props.alignment === 'center')
    return 'text-center'
  else
    return 'text-right'
})

function clickSubmit() {
  const el = document.querySelector('.submit-button') as HTMLElement | undefined

  el?.click()
}

vue.onMounted(() => {
  window.addEventListener(
    'keyup',
    (e) => {
      if (e.key === 'Enter')
        clickSubmit()
    },
    false,
  )
})
</script>

<template>
  <div
    class="header-font relative"
    :data-card-id="card.cardId"
    :class="textAlignment"
  >
    <ElForm :data="card.cardValue.value" @submit="card.next()">
      <div class="relative">
        <div class="text-input-size grow">
          <EditableText
            class="text-theme-900 text-[1.2em]"
            tag="h2"
            :card="card"
            field="heading"
            placeholder="Your question here..."
          />
          <EditableText
            class="text-theme-500 mt-2 text-[.85em]"
            tag="p"
            :card="card"
            field="description"
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

      <div v-if="layout === 'hero' && media" class="hero my-10">
        <ElRichImage
          image-class="max-h-[40vh]"
          :media="media"
          fit="inline"
        />
      </div>

      <div
        v-if="el?.component"
        ref="inputEl"
        class="relative mt-8 mb-4"
        :class="
          card.el.value?.styling === 'textInput'
            ? `focus-within:after:bg-theme-500 after:bg-theme-300 after:absolute after:top-full after:h-[1px] after:w-full after:rounded-sm after:transition-all after:content-[''] focus-within:after:h-[2px]`
            : ''
        "
      >
        <component
          :is="el.component"
          v-bind="el.props"
          :model-value="card.cardValue.value"
          :required="card.userConfig.value.isRequired"
          @update:model-value="card.setCardValue($event)"
          @continue="clickSubmit()"
        />
      </div>
      <div class="mt-8">
        <FormButton
          class="submit-button"
          btn="action"
          type="submit"
        >
          {{
            card.buttonText()
          }}
        </FormButton>
      </div>
    </ElForm>
  </div>
</template>
