<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import { Form } from '../form'
import FormProgressBar from './FormProgressBar.vue'
import FormLoading from './FormLoading.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const loading = vue.ref(true)
const form = vue.shallowRef<Form>()
vue.onMounted(async () => {
  await waitFor(500)

  const site = props.card.site

  if (!site) {
    loading.value = false
    return
  }
  // TEMPLATE /forms/org/:orgId/:templateId
  // FORM_ID /forms/id/:formId

  form.value = await Form.load({ site, formId: '' })

  loading.value = false
})

const activeCard = vue.computed(() => {
  return form.value?.activeCard.value
})
</script>

<template>
  <div
    v-if="form"
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
            :is="activeCard.tpl.value?.settings?.el"
            :key="activeCard?.cardId"
            :form
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
