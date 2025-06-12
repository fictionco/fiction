<script lang="ts" setup>
import type { FictionSites, TableDomainConfig } from '@fiction/site'
import type { ManageDomainRequestParams } from '@fiction/site/endpointDomains'
import { useService, validHost, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'

const { fictionSites, fictionUser } = useService<{ fictionSites: FictionSites }>()
const newHostname = vue.ref('')
const addNew = vue.ref(false)
const busy = vue.ref('')
const error = vue.ref('')
const isInitialLoading = vue.ref(true)

const orgId = vue.computed(() => fictionUser.activeOrganization.value?.orgId)
const domains = vue.ref<TableDomainConfig[]>([])

// Load domains on mount
vue.onMounted(async () => {
  isInitialLoading.value = true
  await loadDomains()
  isInitialLoading.value = false
})

async function loadDomains() {
  if (!orgId.value)
    return

  busy.value = 'list'
  error.value = ''

  try {
    await domainAction({ _action: 'list' })
  }
  catch {
    error.value = 'Failed to load domains'
  }
  finally {
    busy.value = ''
  }
}

async function domainAction(params: ManageDomainRequestParams) {
  const { _action } = params
  if (!orgId.value)
    return null

  busy.value = _action
  error.value = ''

  try {
    const res = await fictionSites.requests.ManageDomain.request({
      orgId: orgId.value,
      caller: `CustomDomain-${_action}`,
      ...params,
    })

    if (res.status === 'success') {
      domains.value = res.data || []
      return res.data
    }
  }
  catch {
    error.value = `Failed to ${_action} domain`
  }
  finally {
    busy.value = ''
  }

  return null
}

async function addDomain() {
  const hostname = newHostname.value.replace(/^https?:\/\//, '').split('/')[0].trim()

  if (!hostname || !validHost(hostname)) {
    error.value = 'Please enter a valid domain'
    return
  }

  if (await domainAction({ _action: 'create', fields: { hostname, isPrimary: domains.value.length === 0 } })) {
    newHostname.value = ''
    addNew.value = false
  }
}

function updateDomain(domain: TableDomainConfig, fields: Partial<TableDomainConfig>) {
  return domain.domainId && domainAction({
    _action: 'update',
    where: { domainId: domain.domainId },
    fields,
  })
}

function deleteDomain(domain: TableDomainConfig) {
  return domain.domainId && domainAction({
    _action: 'delete',
    where: { domainId: domain.domainId },
  })
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="error" class="text-rose-500 text-sm">
      {{ error }}
    </div>

    <!-- Initial loading state with skeleton -->
    <div v-if="isInitialLoading" class="space-y-2">
      <div class="flex justify-center py-2">
        <div class="i-tabler-loader animate-spin size-5" />
      </div>
      <div v-for="i in 2" :key="i" class="flex gap-2 animate-pulse">
        <div class="grow h-9 bg-theme-100 dark:bg-theme-800 rounded-md" />
        <div class="w-20 h-9 bg-theme-100 dark:bg-theme-800 rounded-md" />
        <div class="w-9 h-9 bg-theme-100 dark:bg-theme-800 rounded-md" />
      </div>
    </div>

    <!-- Domain list -->
    <div v-else-if="domains.length" class="space-y-2">
      <div v-for="domain in domains" :key="domain.domainId || domain.hostname" class="flex gap-2">
        <InputText class="grow select-all" rounding="md" readonly :value="domain.hostname" />

        <div class="flex gap-2">
          <span v-if="domain.isVerified" class="text-emerald-500 flex items-center">
            <span class="i-tabler-check-circle size-4" />
          </span>

          <XButton
            size="sm"
            :icon="domain.isPrimary ? 'i-tabler-check' : 'i-tabler-switch-horizontal'"
            :theme="domain.isPrimary ? 'primary' : 'default'"
            design="ghost"
            :loading="busy === 'update'"
            rounding="md"
            @click="updateDomain(domain, { isPrimary: true })"
          >
            {{ domain.isPrimary ? 'Primary' : 'Set' }}
          </XButton>

          <XButton
            size="sm"
            icon="i-tabler-trash"
            theme="default"
            design="ghost"
            rounding="md"
            :loading="busy === 'delete'"
            :disabled="!!busy"
            @click="deleteDomain(domain)"
          />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!isInitialLoading && !busy">
      <div class="text-theme-500 dark:text-theme-400 text-sm py-2 text-center">
        No custom domains added yet
      </div>
    </div>

    <!-- Loading state for operations -->
    <div v-else-if="busy === 'list'" class="flex justify-center py-2">
      <div class="i-tabler-loader animate-spin size-5" />
    </div>

    <!-- Add domain button -->
    <div v-if="(!addNew && !isInitialLoading) || (domains.length === 0 && !isInitialLoading && !busy)">
      <XButton size="sm" icon="i-tabler-plus" :disabled="!!busy" @click="addNew = true">
        Add Domain
      </XButton>
    </div>

    <!-- Add domain form -->
    <div v-if="addNew && !isInitialLoading" class="flex gap-2">
      <InputText
        v-model="newHostname"
        class="grow"
        placeholder="www.example.com"
        @keydown.enter.prevent="addDomain"
      />

      <div class="flex gap-2">
        <XButton
          theme="primary"
          icon="i-tabler-plus"
          :loading="busy === 'create'"
          :disabled="!!busy"
          rounding="md"
          @click="addDomain"
        >
          Add
        </XButton>

        <XButton
          icon="i-tabler-x"
          design="ghost"
          :disabled="!!busy"
          rounding="md"
          @click="addNew = false"
        />
      </div>
    </div>
  </div>
</template>
