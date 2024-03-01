<script lang="ts" setup>
import { displayDateTime, vue } from '@factor/api'
import ElBox from '../../ui/ElBox.vue'
import { useKaption } from '../../utils'
import type { ReplaySessionEvent } from '../types'

const { factorRouter, kaptionReplay } = useKaption()
const loading = vue.ref(true)
const route = factorRouter.router.currentRoute
const session = vue.ref<Partial<ReplaySessionEvent>>()

async function loadDbSession(): Promise<void> {
  const replayId = route.value.params.replayId as string
  const sessionId = replayId.split('_')[1]

  const { data: dbSessionData }
    = await kaptionReplay.requests.GetSessionById.projectRequest({
      sessionId,
    })

  session.value = dbSessionData
}

async function init(): Promise<void> {
  const sessionId = route.value.params.replayId as string

  if (!sessionId)
    return

  loading.value = true

  await loadDbSession()
  loading.value = false
}

vue.onMounted(() => init())

vue.watch(
  () => route.value.params.replayId,
  () => init(),
)
</script>

<template>
  <ElBox class="mb-6" title="Details">
    <div class="px-4 lg:px-6">
      <dl class="my-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div class="3xl:col-span-2 sm:col-span-2">
          <dt class="text-sm font-medium">
            Time Recorded
          </dt>
          <dd class="mt-1 text-sm">
            {{ displayDateTime(session?.startedAt) }}
          </dd>
        </div>

        <div class="3xl:col-span-2 sm:col-span-2">
          <dt class="text-sm font-medium">
            Exit Page
          </dt>
          <dd class="mt-1 text-sm">
            {{ session?.exitPage }}
            <a
              v-if="session?.exitPage"
              target="_blank"
              class="hover:text-primary-500 inline-block overflow-hidden text-ellipsis align-middle"
              :href="session?.exitPage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </dd>
        </div>

        <div class="3xl:col-span-2 sm:col-span-2">
          <dt class="text-sm font-medium">
            Referrer URL
          </dt>
          <dd class="mt-1 break-words text-sm">
            {{ session?.referrer }}
          </dd>
        </div>

        <div class="3xl:col-span-1 sm:col-span-2">
          <dt class="text-sm font-medium">
            Browser
          </dt>
          <dd class="mt-1 text-sm">
            {{ session?.browser }}
          </dd>
        </div>

        <div class="3xl:col-span-1 sm:col-span-2">
          <dt class="text-sm font-medium">
            OS
          </dt>
          <dd class="mt-1 text-sm">
            {{ session?.os }}
          </dd>
        </div>

        <div class="3xl:col-span-1 sm:col-span-2">
          <dt class="text-sm font-medium">
            Country
          </dt>
          <dd class="mt-2 flex text-sm">
            <div
              class="fi fis bg-primary-200 mr-2 h-6 w-6 shrink-0 rounded-full"
              :class="`fi-${session?.countryCode?.toLowerCase()}`"
            />
            {{ session?.countryCode }}
          </dd>
        </div>
        <div class="3xl:col-span-1 sm:col-span-2">
          <dt class="text-sm font-medium">
            Device
          </dt>
          <dd class="mt-1 text-sm capitalize">
            {{ session?.deviceType }}
          </dd>
        </div>
      </dl>
    </div>
  </ElBox>
</template>
