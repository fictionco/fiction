<script lang="ts">
import { onEvent, onResetUi, resetUi } from '@factor/api'
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { Experiment, Variant } from '@kaption/types'
import ElemButton from '../el/ElemButton.vue'
import { getRoute } from '../tools/routes'
import PanelVariant from './PanelVariant.vue'
import PanelVariantWeights from './PanelVariantWeights.vue'
import { activeExperiment } from './utils'

export default {
  components: {
    ElemButton,
    PanelVariant,
    PanelVariantWeights,
  },
  props: {
    modelValue: {
      type: Object as PropType<Experiment>,
      default: () => {},
    },
  },
  setup(props) {
    const sending = ref(false)
    const isValid = ref<boolean>(false)

    const experimentForm = ref<Partial<Experiment>>(
      activeExperiment.value || {},
    )

    /* item options dropdown */
    const toggleDropdown = (item: any): void => {
      onResetUi(() => (item.visDropdown = false))

      if (!item.visDropdown) {
        resetUi()
        item.visDropdown = true
      }
      else {
        item.visDropdown = false
      }
    }

    watch(
      () => activeExperiment.value,
      () => {
        experimentForm.value = activeExperiment.value || {}
      },
    )

    // Variants
    const showVariantPanel = ref(false)
    const showVariantsWeights = ref(false)

    onEvent('newVariantPanel', () => (showVariantPanel.value = true))

    const variants = computed<Variant[]>(() => {
      const exp = props.modelValue
      if (!exp)
        return []
      const variants = Object.values(exp.variants || {})
      const variantWeights = exp.variantWeights || {}

      return variants.map((v) => {
        v.weight = variantWeights[v.variantId] || 0
        return v
      })
    })

    return {
      experimentForm,
      getRoute,
      sending,
      isValid,
      showVariantPanel,
      variants,
      showVariantsWeights,
      toggleDropdown,
    }
  },
}
</script>

<template>
  <div>
    <div>
      <ul
        v-if="variants.length > 0"
        class="rounded-lg divide-y divide-slate-200 overflow-hidden"
      >
        <li v-for="(v, i) in variants" :key="i">
          <div class="px-2 py-6 sm:px-6">
            <div class="flex items-start">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <p
                      class="text-lg font-semibold truncate mr-2 hover:text-primary-500"
                    >
                      <router-link :to="getRoute('experimentVariant', v)">
                        {{ v.variantName }}
                      </router-link>
                    </p>
                  </div>
                  <div class="ml-2 flex-shrink-0 flex items-center">
                    <ElemButton
                      size="xs"
                      btn="secondary"
                      @click.stop="showVariantsWeights = true"
                    >
                      {{ `${v.weight || 0}%` }} Weight
                    </ElemButton>

                    <ElemButton
                      size="xs"
                      btn="secondary"
                      class="ml-2"
                      :to="getRoute('experimentVariant', v)"
                    >
                      Edit
                    </ElemButton>
                  </div>
                </div>
                <div class="mt-1 sm:flex sm:justify-between">
                  <router-link
                    :to="getRoute('experimentVariant', v)"
                    class="sm:flex"
                  >
                    <p
                      class="mt-2 flex items-center text-sm text-slate-500 max-w-md sm:mt-0 sm:mr-6"
                    >
                      <svg
                        class="flex-shrink-0 mr-1 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"
                        />
                      </svg>
                      <span>
                        {{ v.changes ? Object.keys(v.changes).length : "No" }}
                        Alterations Made</span>
                    </p>
                  </router-link>
                  <div
                    class="mt-2 flex items-start text-sm capitalize text-slate-500 sm:mt-0"
                  >
                    <p class="flex items-center">
                      <!-- <span>Updated  Goal</span> -->
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="border-t border-slate-200 p-4 lg:p-6">
        <ElemButton
          btn="primary"
          size="sm"
          @click.stop="showVariantPanel = true"
        >
          Add Variant
        </ElemButton>
      </div>
    </div>
    <!-- New variant -->
    <PanelVariant v-model:vis="showVariantPanel" />

    <!-- Variant weights -->
    <PanelVariantWeights
      v-model:vis="showVariantsWeights"
      :variants="variants"
    />
  </div>
</template>
