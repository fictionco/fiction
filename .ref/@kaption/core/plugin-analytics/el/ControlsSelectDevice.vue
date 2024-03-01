<script lang="ts" setup>
import { onResetUi, resetUi, vue, vueRouter } from '@factor/api'

defineProps({
  title: { type: String, default: '' },
})
const router = vueRouter.useRouter()
const active = vue.ref(false)
const activeDevices = vue.ref([
  { name: 'All', value: '' },
  { name: 'Phone', value: 'phone' },
  { name: 'Tablet', value: 'tablet' },
  { name: 'Laptop', value: 'laptop' },
  { name: 'Desktop', value: 'desktop' },
])

function show(): void {
  resetUi({ scope: 'all', cause: 'showSelectDevice' })

  active.value = true
}

onResetUi(() => (active.value = false))

async function selectDevice(value: string): Promise<void> {
  const route = router.currentRoute.value
  const q = { ...route.query }
  if (value) {
    await router.push({
      query: {
        ...q,
        'f.deviceType': value,
      },
    })
  }
  else {
    delete q['f.deviceType']
    await router.push({
      query: q,
    })
  }

  resetUi({ scope: 'all', cause: 'selectDevice' })
}

const selectedDevice = vue.computed<{ name: string, value: string }>(() => {
  const route = router.currentRoute.value
  const routeDevice = route.query['f.deviceType']

  const device = activeDevices.value.find(_ => _.value === routeDevice)
  if (!device)
    return { name: 'Select Device', value: '' }
  else return device
})
</script>

<template>
  <div class="relative inline-block w-full lg:w-auto" @click.stop>
    <div
      class="f-input group focus:border-primary-500 focus:ring-primary-500 relative inline-flex w-full cursor-pointer select-none items-center justify-between rounded-md border border-slate-300 bg-white py-2 pl-3 pr-2 text-sm text-theme-700 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-1 lg:w-auto"
      @click.prevent="show()"
    >
      <div class="font-semibold">
        {{ selectedDevice.name }}
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
    </div>
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
                v-for="(device, i) in activeDevices"
                :key="i"
                class="group flex cursor-pointer flex-col items-baseline justify-between rounded-md px-4 py-2 text-base font-normal hover:bg-gray-50 hover:text-gray-700 lg:flex-row lg:text-sm"
                @click="selectDevice(device.value)"
              >
                <div class="flex items-baseline whitespace-nowrap font-medium">
                  <span>{{ device.name }}</span>
                </div>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
