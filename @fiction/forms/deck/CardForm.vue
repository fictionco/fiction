<script lang="ts" setup>
import { useService, vue, waitFor } from '@fiction/core'
import El404 from '@fiction/ui/page/El404.vue'
import type { Card } from '@fiction/site'
import { loadForm } from '../utils/load.js'
import FormLoading from './FormLoading.vue'
import FormProgressBar from './FormProgressBar.vue'
import type { FictionForms } from '..'
import type { Form } from '../form'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  formTemplateId: { type: String, default: '' },
  formId: { type: String, default: '' },
})

const { fictionForms } = useService<{ fictionForms: FictionForms }>()

const loading = vue.ref(true)
const form = vue.shallowRef<Form>()
vue.onMounted(async () => {
  await waitFor(500)

  try {
    const site = props.card.site

    if (!site) {
      throw new Error('site not found')
    }

    const { formTemplateId, formId } = props

    if (!formTemplateId && !formId) {
      throw new Error('formTemplateId or formId not found')
    }

    form.value = await loadForm({ site, formTemplateId, fictionForms })
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
})

const activeCard = vue.computed(() => {
  return form.value?.activeCard.value
})

const showNavigation = vue.computed(() => !form.value?.submittedData.value)
</script>

<template>
  <div
    v-if="form"
    class="card-deck-theme theme-wrap theme-font overflow-hidden bg-cover relative"
    :data-value="JSON.stringify(form.formValues.value || {})"
    :data-submitted="JSON.stringify(form.submittedData.value || {})"
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
      <El404
        v-else-if="!activeCard"
        key="2"
        class="text-theme-300 absolute inset-0 flex h-full w-full items-center justify-center "
        super-heading="404"
        heading="Nothing found"
        sub-heading="This form does not exist or has moved."
      />
      <div
        v-else
        key="another"
        class="relative z-20 h-full w-full overflow-scroll"
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

    <div v-if="form && showNavigation" class="gap-2 navigation absolute right-4 bottom-4 flex  justify-center items-center z-30">
      <button
        :disabled="!form.isPrevAvailable"
        class=" disabled:opacity-50 text-theme-300 dark:text-theme-600 flex"
        @click="form?.prevCard()"
      >
        <span class="sr-only">Previous</span>
        <span class="i-tabler-arrow-up text-xl" />
      </button>

      <button
        :disabled="!form.isNextAvailable"
        class="disabled:opacity-50 text-theme-300 dark:text-theme-400 flex"
        @click="form?.nextCard()"
      >
        <span class="sr-only">Next</span>
        <span class="i-tabler-arrow-down text-xl" />
      </button>
    </div>
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
  transition: 0.3s cubic-bezier(0.25, 1, 0.33, 1);
  transition-property: opacity, transform;
}

.next-leave-to,
.prev-enter-from {
  opacity: 0;
  transform: translateY(-50vh);

}
</style>
