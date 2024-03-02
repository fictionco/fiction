<script lang="ts" setup>
import { onResetUi, standardTime, useService, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElBarButton from '../plugin-instance/ElBarButton.vue'
import type { TableJobConfig } from '../tables'
import type { FictionInstance } from '../plugin-instance'
import ProgressBar from './ProgressBar.vue'
import type { FictionJobs } from '.'

const { fictionJobs, fictionInstance } = useService<{
  fictionJobs: FictionJobs
  fictionInstance: FictionInstance
}>()
const vis = vue.ref(false)
const selectedIndex = vue.ref(-1)

const formName = 'Work Queue'

onResetUi(() => {
  vis.value = false
})

const jobs = vue.computed<(TableJobConfig & { selected: boolean })[]>(() => {
  const jobs = fictionJobs.activeJobs.value

  const active = fictionInstance.activeJob.value

  return jobs.map((item, ind) => {
    let job = { ...item, selected: ind === selectedIndex.value }

    if (active?.jobId === job.jobId)
      job = { ...job, ...active }

    return job
  })
})

const notifications = vue.computed(() => {
  return jobs.value.filter(job => job.status === 'processing').length
})

function clickJob(ind: number) {
  if (selectedIndex.value === ind)
    selectedIndex.value = -1
  else
    selectedIndex.value = ind
}

function objectify(input: unknown): { name: string, value: string }[] {
  if (Array.isArray(input)) {
    return input.flatMap((val: unknown) => objectify(val))
  }
  else if (typeof input === 'object' && input) {
    return Object.entries(input).map(([name, value]) => ({
      name,
      value: String(value),
    }))
  }
  else {
    return [{ name: '', value: String(input) }]
  }
}

async function deleteJob(jobConfig: TableJobConfig) {
  await fictionJobs.requests.ManageJobs.request({
    _action: 'delete',
    jobConfig,
  })
  await fictionJobs.requestJobsList()
}
</script>

<template>
  <div class="relative">
    <ElBarButton
      icon="i-carbon-query-queue"
      class="relative"
      @click.stop="vis = !vis"
    >
      <span
        v-if="notifications > 0"
        class="bg-primary-600 text-primary-50 shadow-real-low absolute -right-2 -top-2 z-20 inline-flex items-center justify-center rounded-full px-1.5 py-1 text-[10px] font-extrabold leading-none"
      >{{ notifications }}</span>
    </ElBarButton>

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="vis"
        class="divide-theme-100 border-theme-300 absolute left-0 top-[110%] z-10 w-96 max-w-lg divide-y overflow-hidden rounded-md border border-black/20 bg-white shadow-xl transition-all"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div
          class="text-theme-600 bg-theme-50 border-theme-300 flex items-center justify-between border-b px-4 py-2 text-sm"
        >
          <div
            class="text-theme-500 text-xs font-extrabold uppercase tracking-wider"
          >
            {{ formName }}
          </div>
          <div>
            <div
              class="i-carbon-close hover:text-primary-500 cursor-pointer text-xl"
              @click="vis = false"
            />
          </div>
        </div>
        <div
          v-if="!jobs || jobs.length === 0"
          class="text-theme-500 px-4 py-12 text-center text-sm"
        >
          No Jobs Requested
        </div>

        <ul
          v-else
          id="options"
          class="divide-theme-200 max-h-96 scroll-py-3 divide-y overflow-y-auto"
          role="listbox"
        >
          <!-- Active: "bg-theme-100" -->
          <li
            v-for="(job, i) in jobs"
            id="option-1"
            :key="i"
            class="group flex select-none"
            role="option"
            tabindex="-1"
          >
            <div class="min-w-0 flex-auto">
              <div class="hover:bg-theme-50 p-3" @click="clickJob(i)">
                <div class="flex cursor-pointer space-x-2">
                  <div class=" ">
                    <div
                      class="text-theme-500 flex h-6 w-6 flex-none items-center justify-center rounded-full"
                    >
                      <div
                        class="pointer-events-none text-lg"
                        :class="[
                          job.status === 'ready'
                            ? 'i-carbon-checkmark'
                            : 'i-carbon-circle-dash',
                          job.status === 'processing' ? 'animate-spin' : '',
                        ]"
                      />
                    </div>
                  </div>
                  <div
                    class="grow leading-tight"
                    :class="job.status === 'ready' ? ' ' : ''"
                  >
                    <div class="font-bold capitalize">
                      {{ job.title || "No Title" }}
                    </div>
                    <div class="text-theme-500 text-xs">
                      {{ job.message || "Waiting for message" }} at
                      {{ standardTime(job.requestedAt) }}
                    </div>
                  </div>
                  <div>
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize leading-4"
                      :class="
                        job.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-700'
                          : job.status === 'requested'
                            ? 'bg-amber-100 text-amber-700'
                            : job.status === 'processing'
                              ? 'bg-primary-100 text-primary-500'
                              : 'bg-theme-200 text-theme-500'
                      "
                    >
                      {{ job.status || "Pending" }}
                    </span>
                  </div>
                  <div
                    v-if="job.status === 'requested'"
                    class="text-theme-400 hover:text-primary-600"
                    @click="deleteJob(job)"
                  >
                    <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <ProgressBar
                  v-if="job.status === 'processing' && job.percent"
                  :percent="job.percent"
                  :message="job.message"
                />
              </div>

              <div
                v-if="job.selected && job.inputs"
                class="bg-theme-100 text-xs"
              >
                <div
                  v-if="job.inputs && Object.keys(job.inputs).length > 0"
                  class="py-3 pl-8 pr-3"
                >
                  <div
                    v-for="(val, inputKey) in {
                      ...job.inputs,
                      ...job.statusDetails,
                      jobType: job.jobType,
                      jobId: job.jobId,
                    }"
                    :key="inputKey"
                    class="mb-1 text-xs"
                  >
                    <div class="flex space-x-2">
                      <div class="text-theme-500 pt-0.5">
                        <div class="i-carbon-arrow-right" />
                      </div>
                      <div class="min-w-0 overflow-hidden">
                        <div class="font-bold">
                          {{ inputKey }}
                        </div>
                        <div
                          v-for="(sub, ii) in objectify(val)"
                          :key="ii"
                          class="text-[11px]"
                        >
                          <span
                            v-if="sub.name"
                            class="text-theme-500 mr-2 whitespace-nowrap font-bold"
                          >- {{ sub.name }}</span><span class="text-theme-400 break-words">{{
                            sub.value
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="job.completedUrl" class="mt-3">
                  <ElButton
                    :href="job.completedUrl"
                    btn="default"
                    size="sm"
                  >
                    <span>Go</span> &rarr;
                  </ElButton>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
