<script lang="ts" setup>
import { toLabel, waitFor } from '@factor/api'
import ElemInput from '@factor/ui/ElemInput.vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Experiment } from '@kaption/types'
import ElemZeroState from '../el/ElemZeroState.vue'
import ElemButton from '../el/ElemButton.vue'
import AppPage from '../AppPage.vue'
import { getRoute } from '../tools/routes'
import { activeProject } from '../tools/site'
import PanelExperimentNew from './PanelExperimentNew.vue'

const route = useRoute()
const router = useRouter()
const selectedFilter = ref('')
const newExperiment = ref<Partial<Experiment>>({})
const sending = ref(false)
const panelNewExperiment = ref(false)
const isValid = ref<boolean>(false)

const experiments = computed<Experiment[]>(() => {
  const all = activeProject.value?.experiments || {}
  const exp = Object.values(all).filter(
    (_: Experiment | null) => _?.experimentId,
  )
  return exp as Experiment[]
})
async function save(form: Record<string, any>): Promise<any> {
  sending.value = true
  waitFor(2000)
  sending.value = false
  return form
}

const experimentList = computed(() => {
  const list = experiments.value.map((experiment: Experiment) => {
    return {
      name: experiment.experimentName,
      value: experiment.experimentId,
    }
  })

  return list
})

watch(
  () => selectedFilter.value,
  async (v) => {
    await router.push({ query: { ...route.query, filter: v } })
  },
)

function getGoals(exp: Experiment): string {
  return exp.goals ? exp.goals.join(', ') : 'None Set'
}
</script>

<template>
  <AppPage title="Experiments">
    <template #actions>
      <ElemButton
        btn="primary"
        class="hidden lg:inline-flex"
        @click.stop="panelNewExperiment = true"
      >
        New Experiment &rarr;
      </ElemButton>
    </template>
    <div class="">
      <ElemZeroState
        v-if="experiments.length === 0"
        title="Experiments"
        note="Create experiments to test and optimize your site copy and headlines."
      >
        <template #icon>
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        </template>
        <template #action>
          <ElemButton btn="primary" @click.stop="panelNewExperiment = true">
            Create An Experiment &rarr;
          </ElemButton>
        </template>
      </ElemZeroState>

      <div v-else class="max-w-4xl mx-auto pt-10 mb-16">
        <div
          class="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100"
        >
          <svg
            class="h-6 w-6 text-primary-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <div class="py-4">
          <h2 class="text-xl font-semibold">
            Variant experiments
          </h2>
          <p class="text-slate-500">
            Run tests on segments of your traffic, compare results and deploy
            winning experiences.
          </p>
        </div>
        <div>
          <ElemInput
            v-model="selectedFilter"
            class="my-0 pb-2 w-80 max-w-sm"
            input="selectCustom"
            default-text="Everything"
            :list="[
              {
                value: '',
                name: 'All Experiments',
              },
              {
                value: 'draft',
                name: 'Drafts',
              },
              {
                value: 'active',
                name: 'Active',
              },
            ]"
            required
          />
        </div>

        <ul
          class="mt-3 rounded-lg border border-slate-200 divide-y divide-slate-200 overflow-hidden"
        >
          <li v-for="(e, i) in experiments" :key="i">
            <router-link
              class="block group hover:bg-gray-50 px-4 py-4 sm:px-6 sm:py-5"
              :to="getRoute('experimentSingle', e)"
            >
              <div class="flex items-center">
                <div class="flex-1">
                  <div class="flex items-start sm:items-center justify-between">
                    <div class="sm:flex items-center space-y-2 sm:space-y-0">
                      <p
                        class="text-xl font-semibold truncate mr-4 group-hover:text-primary-500"
                      >
                        {{ e.experimentName }}
                      </p>
                      <p
                        class="flex items-center text-sm capitalize text-slate-500 sm:mr-6"
                      >
                        <span class="text-slate-400 mr-2">Goals:</span>
                        <span class="text-slate-600">{{ getGoals(e) }}</span>
                      </p>
                    </div>
                    <div class="ml-2 flex-shrink-0 flex items-center">
                      <p class="text-sm text-slate-500 mr-4 hidden lg:inline">
                        {{ Object.keys(e.variants ?? {}).length }} Variants
                      </p>
                      <div
                        class="flex items-center justify-center flex-shrink-0 w-16 p-2 rounded-lg"
                        :class="
                          e?.experimentStatus === 'active'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-slate-50 text-slate-600'
                        "
                      >
                        <span
                          class="uppercase text-xs font-semibold tracking-wider"
                        >{{ toLabel(e?.experimentStatus) || "Draft" }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="sm:flex sm:justify-between">
                    <div class="text-slate-500 text-sm">
                      {{ e.experimentDescription }}
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <PanelExperimentNew v-model:vis="panelNewExperiment" />
  </AppPage>
</template>
