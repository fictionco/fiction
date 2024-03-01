<script lang="ts" setup>
import { onResetUi, resetUi } from '@factor/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  activeDashboards,
  activeSelectedDashboard,
} from '@kaption/engine/dataEngine'
import { RouteUtil } from '@kaption/engine'
import ElButton from '@kaption/ui/ElButton.vue'

defineProps({
  title: { type: String, default: '' },
})

const router = useRouter()
const active = ref(false)

function show(): void {
  resetUi()

  active.value = true
}

onResetUi(() => (active.value = false))

async function selectDashboard(dashboardId: string): Promise<void> {
  await router.push(
    RouteUtil.to(
      'dashboardSingle',
      { dashboardId },
      router.currentRoute.value.query,
    ),
  )
  resetUi()
}
</script>

<template>
  <div class="relative inline-block w-full lg:w-auto" @click.stop>
    <ElButton btn="default" @click.prevent="show()">
      <div class="">
        {{ activeSelectedDashboard.dashboardName }}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ml-1 h-4 w-4 opacity-50"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </ElButton>
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="active"
        class="absolute top-full left-0 z-50 mt-2 w-72 origin-top-right rounded-md bg-white shadow-2xl xl:origin-top-right"
      >
        <div
          class="select-none overflow-auto rounded-md shadow focus:outline-none"
        >
          <div class="sel">
            <nav
              class="flex flex-col justify-start overflow-x-hidden overflow-y-scroll py-2 md:justify-center"
            >
              <a
                v-for="(dashboard, i) in activeDashboards"
                :key="i"
                class="group flex cursor-pointer flex-col items-baseline justify-between rounded-md px-4 py-2 text-base font-normal hover:bg-gray-50 hover:text-gray-700 lg:flex-row lg:text-sm"
                @click="selectDashboard(dashboard.dashboardId)"
              >
                <div class="flex items-baseline whitespace-nowrap font-medium">
                  <span>{{ dashboard.dashboardName }}</span>
                  <span
                    v-if="dashboard.isCustomized"
                    class="ml-3 inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-400"
                  >
                    Custom
                  </span>
                </div>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
