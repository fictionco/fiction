<script lang="ts" setup>
import { emitEvent, toLabel } from '@factor/api'
import { computed, ref, toRaw, watch } from 'vue'

// import { Experiment } from "@kaption/types"
import type { ChangeRecord, FrameMessage, Variant } from '@kaption/types'
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import type { EndpointManageAction } from '@factor/types'
import { useRouter } from 'vue-router'
import ElemBox from '../el/ElemBox.vue'
import ElemZeroState from '../el/ElemZeroState.vue'
import { sendFrameMessage } from '../el/elemIframeUtil'
import { getRoute } from '../tools/routes'
import AppPage from '../AppPage.vue'
import ElemButton from '../el/ElemButton.vue'
import ElemBrowser from '../el/ElemBrowser.vue'
import VariantChanges from './VariantChanges.vue'
import {
  activeExperiment,
  activeExperimentId,
  activeVariant,
  activeVariantId,
} from './utils'
import { requestManageVariant } from './request'

const router = useRouter()
const form = ref<Partial<Variant>>({})

const showSidebar = ref(true)

const sending = ref<string | boolean>(false)

const changesMade = ref<ChangeRecord>(activeVariant?.value?.changes ?? {})
const experimentStatus = computed(
  () => activeExperiment.value?.experimentStatus ?? 'draft',
)

const variantWeight = computed(() => {
  const variantId = activeVariantId.value
  const weights = activeExperiment.value?.variantWeights
  return variantId && weights?.[variantId] ? weights[variantId] : 0
})

function frameSetChanges(): void {
  sendFrameMessage({
    messageType: 'addChanges',
    data: toRaw(changesMade.value),
  })
}

function frameSetupEditing(): void {
  sendFrameMessage({ messageType: 'initializeEditor' })
  frameSetChanges()
}

watch(
  () => activeVariant?.value,
  (v) => {
    if (v) {
      form.value = v
      const { changes } = v
      changesMade.value = changes ?? {}
      frameSetChanges()
    }
  },
  { immediate: true },
)

function handleMessage(message: FrameMessage) {
  if (message.messageType === 'elementChange' && message.data) {
    const { hash } = message.data
    changesMade.value[hash] = {
      ...message.data,

      status: 'success',
    }
  }
}

const changesMadeList = computed(() => {
  return Object.values(changesMade.value)
    .filter(_ => _)
    .sort((a, b) => (b?.timestamp ?? 0) - (a?.timestamp ?? 0))
})

async function manageVariant({
  _action,
  scope,
}: {
  _action: EndpointManageAction
  scope?: string
}) {
  const variantId = activeVariantId.value
  const experimentId = activeExperimentId.value

  if (!variantId || !experimentId)
    return

  const saveVariant: Variant & { _action: EndpointManageAction } = {
    variantId,
    experimentId,
    _action,
  }
  const { variantName, variantDescription } = form.value

  saveVariant.changes = changesMade.value
  saveVariant.variantName = variantName
  saveVariant.variantDescription = variantDescription

  const confirmed = _action === 'delete' ? confirm('Are you sure?') : true

  if (confirmed) {
    sending.value = [_action, scope].filter(_ => _).join('-')
    const r = await requestManageVariant(saveVariant)

    if (r.status === 'success' && _action === 'delete')
      await router.push(getRoute('experimentSingle', { experimentId }))
  }

  sending.value = false
}

function update(args: { hash?: string, edit?: 'remove' } = {}): void {
  const { hash, edit } = args

  if (edit === 'remove' && hash)
    changesMade.value[hash] = null

  sendFrameMessage({
    messageType: 'addChanges',
    data: toRaw(changesMade.value),
  })
}

// const getGoals = (exp: Experiment): string => {
//   const events = activeAvailableEvents

//   return exp.goals
//     ? exp.goals
//         .map((_) => events.value?.find((__) => __.eventId === _)?.eventName)
//         .join(", ")
//     : "None Set"
// }
</script>

<template>
  <AppPage
    :title="`Edit Variant: ${activeVariant?.variantName}`"
    :back="{
      path: getRoute('experimentSingle', activeExperiment),
      text: `Back to Experiment: ${activeExperiment?.experimentName}`,
    }"
  >
    <template #actions>
      <ElemButton
        btn="primary"
        :loading="sending === 'update-top'"
        @click="manageVariant({ _action: `update`, scope: 'top' })"
      >
        Save Variant
      </ElemButton>
    </template>

    <div class="">
      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12" :class="showSidebar ? `lg:col-span-9 ` : ``">
          <div class="border border-slate-300 py-3 rounded-md">
            <ElemBrowser
              @message="handleMessage($event)"
              @load="frameSetupEditing()"
            >
              <template #browserBar>
                <div v-show="!showSidebar" class="flex-shrink-0 ml-4">
                  <ElemButton btn="default" @click="showSidebar = true">
                    Show Changes / Sidebar
                  </ElemButton>
                </div>
              </template>
              <template #zeroState>
                <ElemZeroState
                  title="Welcome To The Editor"
                  note="Just a render a page and start editing text."
                >
                  <template #icon>
                    <div
                      class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-50 text-primary-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    </div>
                  </template>
                  <template #action>
                    <ElemButton
                      btn="primary"
                      size="md"
                      @click="emitEvent(`setFramePath`, { newPath: '/' })"
                    >
                      Render Homepage &rarr;
                    </ElemButton>
                  </template>
                </ElemZeroState>
              </template>
            </ElemBrowser>
          </div>
        </div>

        <!-- changes panel -->
        <div v-show="showSidebar" class="col-span-12 lg:col-span-3">
          <ElemBox
            class="mb-6"
            :title="`Experiment: ${activeExperiment?.experimentName}`"
          >
            <div class="px-4 lg:px-6">
              <dl class="my-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <div class="flex items-center">
                    <dt class="text-sm font-medium">
                      Experiment Status
                    </dt>
                    <div class="description relative ml-2 group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div
                        class="absolute top-full right-0 w-40 text-xs p-3 bg-white shadow-lg z-10 pointer-events-none opacity-0 rounded-md group-hover:opacity-100 3xl:top-0 3xl:left-full"
                      >
                        Once your experiment is published, saved edits will
                        become visible on your website according their weight.
                      </div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <div class="3xl:flex 3xl:space-x-4">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-md text-base font-medium"
                        :class="
                          experimentStatus === 'draft'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-green-100 text-green-600'
                        "
                      >
                        {{ toLabel(experimentStatus) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="sm:col-span-2 3xl:col-span-1">
                  <dt class="text-sm font-medium">
                    Experiment Goal
                  </dt>
                  <dd v-if="activeExperiment" class="mt-1 text-sm">
                    {{ activeExperiment.goals?.join(", ") }}
                  </dd>
                </div>
                <div class="sm:col-span-2 3xl:col-span-1">
                  <dt class="text-sm font-medium">
                    Variant Weight
                  </dt>
                  <dd class="mt-1 text-sm">
                    {{ variantWeight }}%
                  </dd>
                </div>

                <div
                  v-if="activeExperiment?.experimentDescription"
                  class="sm:col-span-2"
                >
                  <dt class="text-sm font-medium">
                    Description
                  </dt>
                  <dd class="mt-1 text-sm">
                    {{ activeExperiment?.experimentDescription }}
                  </dd>
                </div>
              </dl>
            </div>
          </ElemBox>
          <ElemBox class="mb-6" :title="`Edits (${changesMadeList.length})`">
            <div class="">
              <div class="max-h-screen overflow-scroll no-scrollbar">
                <VariantChanges
                  :list="changesMadeList"
                  @update="update($event)"
                />
              </div>
            </div>
          </ElemBox>
          <ElemBox class="mb-6" title="Variant Settings">
            <ElemForm class="px-4 lg:px-6">
              <ElemInput
                v-model="form.variantName"
                input="text"
                label="Variant Name"
                description="Used to track and display analytics results."
                required
              />

              <ElemInput
                v-model="form.variantDescription"
                input="text"
                label="Variant Description"
                description="The purpose or idea behind this variant."
              />
              <div class="flex justify-between my-8">
                <ElemButton
                  :loading="sending === 'update-settings'"
                  btn="primary"
                  size="sm"
                  class="min-w-min"
                  @click="
                    manageVariant({ _action: `update`, scope: 'settings' })
                  "
                >
                  Save Variant
                </ElemButton>

                <ElemButton
                  :loading="sending === 'delete'"
                  btn="default"
                  size="sm"
                  class="min-w-min"
                  @click="manageVariant({ _action: `delete` })"
                >
                  Delete Variant
                </ElemButton>
              </div>
            </ElemForm>
          </ElemBox>
        </div>
      </div>
    </div>
  </AppPage>
</template>
