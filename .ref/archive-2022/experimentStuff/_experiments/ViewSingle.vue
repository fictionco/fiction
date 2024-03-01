<script lang="ts" setup>
import type { EndpointManageAction } from '@factor/types'
import { emitEvent, onEvent, toLabel } from '@factor/api'
import ElemInput from '@factor/ui/ElemInput.vue'
import { computed, ref, watch } from 'vue'
import type { Experiment, TargetingRule } from '@kaption/types'
import { useRouter } from 'vue-router'
import ElemButton from '../el/ElemButton.vue'
import ElemFormGroup from '../el/ElemFormGroup.vue'
import AppPage from '../AppPage.vue'
import { getRoute } from '../tools/routes'
import RulesList from '../admin/ProjectEventRulesList.vue'
import { activeSelectEvents } from '../admin/projectEventUtils'
import { requestManageExperiment } from './request'
import { activeExperiment } from './utils'
import ManageVariants from './ManageVariants.vue'

const router = useRouter()
const sending = ref<EndpointManageAction | boolean>(false)

const experimentForm = ref<Partial<Experiment>>({
  goals: [],
  ...activeExperiment.value,
})

watch(
  () => activeExperiment.value,
  (v) => {
    experimentForm.value = { goals: [], ...v }
  },
)

const stepsNav = computed(() => {
  const { experimentName, variants, goals, rules, experimentStatus }
    = experimentForm.value

  const variantSet = variants && Object.keys(variants).length > 0
  const goalSet = goals && Object.keys(goals).length > 0
  const rulesSet = rules && Object.keys(rules).length > 0
  const steps = [
    {
      name: 'setup',
      status: !!experimentName,
    },
    {
      name: 'variants',
      status: variantSet,
    },
    {
      name: 'goals',
      status: goalSet,
    },
    {
      name: 'targeting',
      status: rulesSet || goalSet,
    },
    {
      name: 'publish',
      status: experimentStatus === 'active',
    },
  ]

  const currentIndex = steps.findIndex(_ => !_.status)

  return steps.map((_, i) => {
    return {
      ..._,
      status: _.status ? 'done' : i === currentIndex ? 'current' : '',
    }
  })
})

async function manageExperiment({
  _action,
}: {
  _action: EndpointManageAction
}) {
  const {
    experimentId,
    experimentName,
    experimentStatus,
    experimentDescription,
    variantWeights,
    rules,
    goals,
  } = experimentForm.value

  const liveStatus = activeExperiment.value?.experimentStatus

  let confirmed = true
  if (experimentStatus === 'active' && experimentStatus !== liveStatus) {
    confirmed = confirm(
      'Publishing this experiment will allow variant changes on your live website. Are you ready?',
    )
  }
  else if (_action === 'delete') {
    confirmed = confirm('Are you sure?')
  }

  if (confirmed) {
    sending.value = _action

    const r = await requestManageExperiment({
      experimentId,
      experimentName,
      experimentStatus,
      experimentDescription,
      variantWeights,
      rules,
      goals,
      _action,
    })

    if (r.status === 'success' && _action === 'delete')
      router.push(getRoute('experimentIndex'))

    sending.value = false
  }
}

function publish() {}

onEvent('updateWeights', (weights: Record<string, number>) => {
  experimentForm.value = {
    ...experimentForm.value,
    variantWeights: weights,
  }
})

onEvent('createRule', (rule: TargetingRule) => {
  const r = experimentForm.value.rules ?? []
  let found = false
  const newRules = r.map((_) => {
    if (_.ruleId === rule.ruleId) {
      found = true
      return rule
    }
    else {
      return _
    }
  })
  if (!found)
    experimentForm.value.rules = [...r, rule]
  else
    experimentForm.value.rules = newRules
})

onEvent('removeRule', (ruleId: string): void => {
  const r = experimentForm.value.rules ?? []
  const rules = r.filter(_ => _.ruleId !== ruleId)
  experimentForm.value.rules = rules
})
</script>

<template>
  <AppPage
    title="Edit Experiment"
    :back="{
      path: getRoute('experimentIndex'),
      text: `All Experiments`,
    }"
  >
    <template #actions>
      <ElemButton btn="default" @click.stop="emitEvent('newVariantPanel')">
        Add Variant
      </ElemButton>
      <ElemButton
        btn="primary"
        :loading="sending === 'update'"
        @click.stop="manageExperiment({ _action: 'update' })"
      >
        Save Changes
      </ElemButton>
    </template>

    <!-- class="max-w-prose m-auto border-b border-slate-200 mt-10 mb-4 lg:px-8" -->
    <nav
      class="max-w-prose mx-auto pt-10 mb-4 border-b border-slate-200"
      aria-label="Progress"
    >
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
        <h2 class="text-2xl font-bold">
          A/B Experiment
        </h2>
        <p class="text-slate-500 mt-2">
          Run tests on segments of your traffic. Learn and deploy winning
          experiences. Increase conversion, retention, and lifetime value.
        </p>
      </div>
      <ol
        class="flex flex-col space-x-0 lg:flex-row lg:justify-between lg:space-x-8"
      >
        <li
          v-for="(step, i) in stepsNav"
          :key="i"
          class="py-4"
        >
          <span class="flex items-start">
            <div
              class="flex-shrink-0 h-5 w-5 relative flex items-center justify-center"
              aria-hidden="true"
            >
              <svg
                v-if="step.status === 'done'"
                class="h-full w-full text-green-500 group-hover:text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <template v-else-if="step.status === 'current'">
                <span
                  class="absolute h-4 w-4 rounded-full bg-primary-200"
                /><span
                  class="relative block w-2 h-2 bg-primary-500 rounded-full"
                />
              </template>
              <template v-else>
                <div
                  class="h-2 w-2 bg-slate-300 rounded-full group-hover:bg-slate-500"
                />
              </template>
            </div>

            <span
              class="ml-2 text-sm font-medium"
              :class="
                step.status === 'current'
                  ? 'text-primary-500'
                  : 'text-gray-500 group-hover:text-slate-900'
              "
            >
              {{ toLabel(step.name) }}
            </span>
          </span>
        </li>
      </ol>
    </nav>

    <div class="max-w-prose mx-auto">
      <ElemFormGroup
        title="Setup"
        description="Configure the experiment details"
      >
        <div class="px-4 lg:px-6">
          <ElemInput
            label="Live Publication Status"
            :description="
              activeExperiment?.experimentStatus === 'active'
                ? `This experiment is actively changing your site and tracking variant results.`
                : 'This experiment is in draft and not currently tracking results.'
            "
          >
            <div
              class="inline-block text-2xl font-semibold px-4 py-2 mt-2 rounded-md"
              :class="
                activeExperiment?.experimentStatus === 'active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-slate-50 text-slate-600'
              "
            >
              {{ toLabel(activeExperiment?.experimentStatus) || "Draft" }}
            </div>
          </ElemInput>
          <ElemInput
            v-model="experimentForm.experimentName"
            label="Experiment Name"
            input="text"
            description="The reference name for this experiment"
          />
          <ElemInput
            v-model="experimentForm.experimentDescription"
            label="Experiment Description"
            input="text"
            description="Add a description that will be helpful to team members"
          />

          <ElemInput
            v-model="experimentForm.experimentStatus"
            label="Publication Status"
            input="selectCustom"
            :list="['active', 'draft']"
            default-value="draft"
            description="If 'active', Your experiment is running on your website."
          />
        </div>
      </ElemFormGroup>

      <ElemFormGroup
        title="Variants"
        description="Use variants to make changes to your website"
      >
        <ManageVariants v-model="experimentForm" />
      </ElemFormGroup>

      <ElemFormGroup
        title="Goals"
        description="How should we count conversions and winners"
      >
        <div class="px-4 lg:px-6">
          <ElemInput
            v-model="experimentForm.goals[0]"
            label="Primary Goal"
            description="The main conversion event for this experiment."
            input="selectCustom"
            :list="activeSelectEvents"
            required
          />

          <ElemInput
            v-model="experimentForm.goals[1]"
            label="Secondary Goal"
            description="(optional) The secondary conversion event for this experiment."
            input="selectCustom"
            :list="activeSelectEvents"
          />
        </div>
      </ElemFormGroup>

      <ElemFormGroup
        title="Audience Targeting"
        description="Who should see this experiment?"
      >
        <RulesList v-model="experimentForm.rules" />
      </ElemFormGroup>

      <ElemFormGroup title="Danger Zone" description="Proceed with caution">
        <div class="px-4 lg:px-6 py-6">
          <ElemButton
            :loading="sending === 'delete'"
            btn="danger"
            @click="manageExperiment({ _action: `delete` })"
          >
            Delete Experiment
          </ElemButton>
        </div>
      </ElemFormGroup>
    </div>
  </AppPage>
</template>
