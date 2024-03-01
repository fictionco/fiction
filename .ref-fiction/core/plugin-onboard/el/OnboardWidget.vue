<script lang="ts" setup>
import { vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElProgressLine from '@factor/ui/ElProgressLine.vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import type { OnboardItem } from '../schema'
import { useFictionApp } from '../../util'

const { fictionOnboard, factorUser } = useFictionApp()

const loading = vue.ref(true)
const sending = vue.ref('')

const items = vue.computed<OnboardItem[]>(() => {
  const items = fictionOnboard.onboardItems.value

  return items
})

const numberIncomplete = vue.computed(() => {
  return fictionOnboard.onboardItems.value.filter(item => !item.completed)
    .length
})

const percent = vue.computed(() => {
  const total = items.value.length
  const complete = total - numberIncomplete.value
  return Math.round((complete / total) * 100)
})

vue.onMounted(async () => {
  vue.watch(
    () => factorUser.activeOrganization.value?.organizationId,
    async (v) => {
      if (v)
        await fictionOnboard.updateCounts()

      loading.value = false
    },
    { immediate: true },
  )
})

async function complete() {
  sending.value = 'complete'
  await fictionOnboard.completeOnboarding()
  sending.value = ''
}
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="text-theme-300 flex items-center justify-center p-12"
    >
      <ElSpinner class="w-6" />
    </div>

    <div v-else class="p-6">
      <div class="grow">
        <ul
          id="options"
          class="border-theme-300 divide-theme-300 divide-y overflow-hidden rounded-lg border"
          role="listbox"
        >
          <!-- Active: "bg-theme-100" -->
          <li
            v-for="(item, i) in fictionOnboard.onboardItems.value.filter(
              (_) => _.status !== 'requested' && !_.hideReadyItem,
            )"
            id="option-1"
            :key="i"
            class="border-theme-200 group flex select-none p-3 cursor-pointer hover:bg-theme-50"

            role="option"
            tabindex="-1"
            @click.stop="item.onClick ? item.onClick() : ''"
          >
            <div
              class="flex h-7 w-7 flex-none items-center justify-center rounded-full border"
              :class="
                item.completed
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600  text-primary-50 border-primary-600'
                  : 'bg-gradient-to-b from-theme-50 to-theme-100 text-theme-500 border-theme-300'
              "
            >
              <div
                class="pointer-events-none text-xl"
                :class="
                  item.completed ? 'i-heroicons-check' : 'i-heroicons-dot'
                "
              />
            </div>

            <div class="ml-4 flex-auto">
              <div class="flex items-center justify-between">
                <div>
                  <p
                    class="text-lg font-extrabold leading-tight tracking-tight"
                    :class="
                      item.completed
                        ? 'text-theme-300 line-through'
                        : 'text-theme-700'
                    "
                  >
                    {{ item.name }}
                  </p>
                  <div
                    class="text-sm font-medium"
                    :class="
                      item.status === 'processing'
                        ? 'text-theme-500'
                        : 'text-theme-300'
                    "
                  >
                    {{ item.status === "processing" ? item.desc : "completed" }}
                  </div>
                </div>
                <div
                  v-if="item.status === 'processing'"
                  class="flex items-center space-x-5"
                >
                  <div
                    v-if="item.allowSkip"
                    class="text-theme-300 hover:text-theme-500 text-xs font-bold tracking-tight"
                    @click.stop.prevent="fictionOnboard.skipItem(item.stepId)"
                  >
                    Skip
                  </div>
                  <ElButton size="sm" btn="primary">
                    Go &rarr;
                  </ElButton>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <ElProgressLine class="mt-4" :percent="percent" />

      <div v-if="percent >= 100" class="pt-6">
        <ElButton
          :loading="sending === 'complete'"
          btn="primary"
          @click="complete()"
        >
          Done! Complete Onboarding &rarr;
        </ElButton>
      </div>
    </div>
  </div>
</template>
