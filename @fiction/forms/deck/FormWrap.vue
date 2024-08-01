<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import FormProgressBar from './FormProgressBar.vue'
import FormLoading from './FormLoading.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
const cards = vue.computed(() => props.card.cards.value)
const activeCard = vue.computed(() => {
  const site = props.card.site
  const siteRouter = site?.siteRouter
  const slug = siteRouter?.current.value.params.viewId
  const card = cards.value.find(c => c.slug.value === slug)
  return card
})

const loading = vue.ref(true)

vue.onMounted(async () => {
  await waitFor(500)

  loading.value = false
})
</script>

<template>
  <div
    class="card-deck-theme theme-wrap theme-font overflow-hidden bg-cover"
  >
    <FormProgressBar :progress="form.percentComplete.value" />
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <FormLoading v-if="loading" key="loading" />
      <div
        v-else-if="!activeCard"
        key="2"
        class="text-theme-300 absolute inset-0 flex h-full w-full items-center justify-center text-sm uppercase"
      >
        Nothing found
      </div>
      <div
        v-else
        key="another"
        class="relative z-20"
      >
        <transition :name="form?.slideTransition.value" mode="out-in">
          <component
            :is="activeCard.component"
            :key="form.activeCard.value?.cardId"
            :form="form"
            v-bind="activeCard.props"
            :card="form.activeCard.value"
          />
        </transition>
      </div>
    </transition>
  </div>
</template>

<style lang="less">
.next-enter-from,
.prev-leave-to {
  opacity: 0;
  transform: translateY(50vh);
}
.next-enter-to,
.next-leave-from,
.prev-enter-to,
.prev-leave-from {
  transform: translateY(0);
}
.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: 0.3s ease;
  transition-property: opacity, transform;
}

.next-leave-to,
.prev-enter-from {
  opacity: 0;
  transform: translateY(-50vh);
}
</style>
