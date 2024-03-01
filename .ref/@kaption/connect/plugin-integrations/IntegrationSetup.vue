<script lang="ts" setup>
import InputDropDown from '@factor/ui/InputDropDown.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { vue, waitFor } from '@factor/api'
import { useKaption } from '@kaption/core/utils/inject'
import ElSlideOver from '@kaption/core/ui/ElSlideOver.vue'
import ElOption from '@kaption/core/ui/ElOption.vue'
import type { KaptionConnection, ProviderKeys } from '../providers'
import { getProvider } from '../providers'
import type { ConnectionState } from '../connection'

const props = defineProps({
  integrations: {
    type: Array as vue.PropType<ProviderKeys[]>,
    default: () => [],
  },
  context: {
    type: String,
    default: '',
  },
  state: {
    type: Object as vue.PropType<ConnectionState>,
    default: undefined,
  },
})

const { kaptionIntegrations, factorDb, factorEnv, factorAdmin, kaptionForms }
  = useKaption()

const currentIntegration = vue.shallowRef<KaptionConnection>()
const currentOpts = vue.computed(
  () => currentIntegration.value?.opts.value || [],
)
const currentState = vue.computed(
  () => currentIntegration.value?.connectionState.value || {},
)

const sending = vue.ref(false)
const vis = vue.computed({
  get: () => !!currentIntegration.value,
  set: (val) => {
    if (!val)
      currentIntegration.value = undefined
  },
})

vue.watch(
  () => props.context,
  async (v) => {
    if (v)
      await kaptionIntegrations.loadIntegrations(v)
  },
  { immediate: true },
)

const fullIntegrations = vue.computed(() => {
  const activeIntegrations = kaptionIntegrations.activeIntegrations.value || []
  const projectId = factorAdmin.activeProjectId.value
  const organizationId = factorAdmin.activeOrganizationId.value
  const context = props.context

  if (!projectId || !organizationId || !context)
    return []

  return props.integrations.map((provider) => {
    const loadedState = activeIntegrations.find(
      item => item.provider === provider,
    )
    const connectionState = { ...props.state, ...loadedState }

    return getProvider({
      factorDb,
      factorEnv,
      kaptionIntegrations,
      provider,
      projectId,
      organizationId,
      context,
      connectionState,
    })
  })
})

function dropDownList(integration: KaptionConnection) {
  const status = integration.connectionState.value?.status

  const out = []

  if (status === 'active')
    out.push({ name: 'disable integration', value: 'disabled' })
  else if (status === 'disabled')
    out.push({ name: 'enable integration', value: 'active' })

  out.push({ name: 'remove integration', value: 'delete' })

  return out
}

type ToggleValue = 'active' | 'disabled' | 'delete'

async function updateConnection(integration: KaptionConnection, action: ToggleValue) {
  if (action === 'disabled' || action === 'active') {
    await integration.requestChangeStatus(action)
  }
  else if (action === 'delete') {
    const confirmed = confirm('Are you sure?')
    if (confirmed)
      await integration.requestDelete()
  }
}

function setup(integration: KaptionConnection) {
  currentIntegration.value = integration
}

async function save() {
  sending.value = true
  const r = await currentIntegration.value?.requestActivate()
  sending.value = false

  if (r?.status === 'success') {
    await waitFor(500)

    vis.value = false
  }
}
</script>

<template>
  <main class="mx-auto w-full max-w-screen-lg space-y-4 py-6">
    <div
      v-for="(int, i) in fullIntegrations"
      :key="i"
      class="integration flex justify-between rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div class="icon p-6">
        <template v-if="int.icon">
          <div class="text-5xl" :class="int.icon" />
        </template>
        <template v-else-if="int.logo">
          <img :src="int.logo" class="h-12 w-12">
        </template>
      </div>
      <div class="head grow p-6">
        <div class="text-lg font-semibold">
          {{ int.name }}
        </div>
        <div class="text-theme-500">
          {{ int.description }}
        </div>
      </div>

      <div class="flex cursor-pointer flex-col justify-center py-6 px-8">
        <div class="flex items-center">
          <ElButton
            v-if="!int.connectionState.value?.status"
            btn="slate"
            @click.stop="setup(int)"
          >
            Setup
          </ElButton>
          <InputDropDown
            v-else
            :list="dropDownList(int)"
            :default-text="int.connectionState.value?.status"
            :color-classes="
              int.connectionState.value?.status === 'active'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : int.connectionState.value?.status === 'disabled'
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : undefined
            "
            justify="right"
            class="capitalize"
            @update:model-value="updateConnection(int, $event as ToggleValue)"
          />
        </div>
      </div>
    </div>
    <ElSlideOver v-model:vis="vis">
      <div class="head flex">
        <div class="mr-6">
          <template v-if="currentIntegration?.icon">
            <div class="text-4xl" :class="currentIntegration?.icon" />
          </template>
          <template v-else-if="currentIntegration?.logo">
            <img :src="currentIntegration?.logo" class="h-10 w-10">
          </template>
        </div>
        <div class="grow">
          <div class="text-theme-300 text-xs uppercase tracking-wide">
            Integration
          </div>
          <div class="text-2xl font-semibold">
            {{ currentIntegration?.name }}
          </div>
        </div>
      </div>

      <div v-if="currentIntegration" class="settings my-12 max-w-sm space-y-6">
        <div
          v-for="(opt, i) in currentOpts"
          :key="i"
          class=""
        >
          <ElOption
            v-bind="opt.props.value"
            v-model="currentState[opt.optionKey]"
            :option="opt"
          />
        </div>
        <div v-if="currentIntegration.hasRequiredDetails.value" class="mt-4">
          <ElButton
            btn="slate"
            :loading="sending"
            @click="save()"
          >
            Save &amp; Setup
          </ElButton>
        </div>
      </div>
    </ElSlideOver>
  </main>
</template>
