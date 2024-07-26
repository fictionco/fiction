<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'

import type { Testimonial, UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const testimonials = vue.computed(() => uc.value.items?.length ? uc.value.items : [])

const activeItem = vue.ref(0)
</script>

<template>
  <div class=" ">
    123
    <NavDots v-model:active-item="activeItem" :container-id="card.cardId" :items="testimonials" class=" " />
  </div>
</template>
