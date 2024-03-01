<script lang="ts" setup>
import { vue, vueRouter } from '@factor/api'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import PanelFilters from './ControlsFilterSlide.vue'

defineProps({
  value: { type: String, default: '' },
  name: { type: String, default: '' },
})

const { kaptionDashboard } = useKaption()

const filter = kaptionDashboard.kaptionFilter

const showFiltersPanel = vue.ref(false)
const route = vueRouter.useRoute()
const router = vueRouter.useRouter()
async function removeFilter(filter: {
  name: string
  operator: '!=' | '='
  value: string
}): Promise<void> {
  const query = { ...route.query }
  const opKey = filter.operator === '!=' ? '!' : ''
  const queryKey = `f.${filter.name}${opKey}`

  delete query[queryKey]
  await router.push({ query })
}
</script>

<template>
  <div class="flex items-center justify-between space-x-4 lg:justify-end">
    <div
      class="filters items-center space-y-2 lg:flex lg:space-x-1 lg:space-y-0"
    >
      <span
        v-if="filter.activeFilters.value.length === 0"
        class="inline-flex items-center rounded-full bg-theme-50 py-1 pl-2.5 pr-1 text-xs font-medium text-theme-600"
      >
        <span class="mr-1 capitalize opacity-50">No Filters</span>
      </span>
      <template v-else>
        <span
          v-for="(item, i) in filter.activeFilters.value"
          :key="i"
          class="bg-primary-600 inline-flex items-center whitespace-nowrap rounded-full py-1 pl-3 pr-1 text-xs text-white"
        >
          <span class="font-bold capitalize">{{ item.name }}</span>
          <span class="text-primary-200 mx-1 italic">{{
            item.operator === "!=" ? "is not" : "is"
          }}</span>
          <span class="max-w-screen-sm truncate font-bold">{{
            item.value
          }}</span>
          <button
            type="button"
            class="text-primary-200 hover:bg-primary-500 focus:bg-primary-500 ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:text-white focus:text-white focus:outline-none"
            @click="removeFilter(item)"
          >
            <span class="sr-only">Remove</span>
            <svg
              class="h-3 w-3"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 8 8"
            >
              <path
                stroke-linecap="round"
                stroke-width="1.5"
                d="M1 1l6 6m0-6L1 7"
              />
            </svg>
          </button>
        </span>
      </template>
    </div>
    <div class="ml-4">
      <ElButton
        size="md"
        title="Filters"
        @click.stop.prevent="showFiltersPanel = true"
      >
        <svg
          focusable="false"
          version="1.1"
          viewBox="0 0 20 20"
          class="h-5 w-5 text-theme-500"
        >
          <path
            pid="0"
            d="M9 14h2a1 1 0 010 2H9a1 1 0 010-2zM3 4h14a1 1 0 010 2H3a1 1 0 110-2zm3 5h8a1 1 0 010 2H6a1 1 0 010-2z"
            fill-rule="evenodd"
            fill="currentColor"
          />
        </svg>
      </ElButton>
    </div>
  </div>
  <PanelFilters v-model:vis="showFiltersPanel" />
</template>
