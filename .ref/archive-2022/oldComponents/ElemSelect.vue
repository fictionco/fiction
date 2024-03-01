<script lang="ts" setup>
import type { ListItem } from '@factor/types'
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { onResetUi, resetUi } from '@factor/api'

const props = defineProps({
  queryKey: { type: String, default: '', required: true },
  selectText: { type: String, default: 'Select' },
  list: {
    type: Array as PropType<ListItem[]>,
    default: () => [],
    required: true,
  },
})
const router = useRouter()
const active = ref(false)

function show() {
  resetUi()

  active.value = true
}

onResetUi(() => (active.value = false))

async function selectItem(value: string) {
  const route = router.currentRoute.value
  if (value) {
    await router.push({
      query: {
        ...route.query,
        [props.queryKey]: value,
      },
    })
    resetUi()
  }
}

const selectList = computed<ListItem[]>(() => {
  return activeExperiments.value.map((ex) => {
    return { name: ex.experimentName, value: ex.experimentId }
  })
})

const selectedItem = computed<ListItem>(() => {
  const route = router.currentRoute.value
  const routeValue = route.query[props.queryKey]

  const item = selectList.value.find(_ => _.value === routeValue)
  if (!item)
    return { name: props.selectText, value: '' }
  else return item
})
</script>

<template>
  <div class="relative inline-block w-full lg:w-auto" @click.stop>
    <div
      class="bg-white w-full lg:w-auto f-input text-sm inline-flex justify-between items-center group relative rounded-md pl-3 pr-2 py-2 cursor-pointer select-none shadow-sm border text-slate-700 border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      @click.prevent="show()"
    >
      <div class="font-semibold">
        {{ selectedItem.name }}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 ml-1 opacity-50"
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
        class="z-50 absolute transform top-full mt-2 rounded-md bg-white shadow-2xl origin-top-right xl:origin-top-right w-72 left-0"
      >
        <div
          class="overflow-auto rounded-md shadow focus:outline-none select-none"
        >
          <div class="sel">
            <nav
              class="flex flex-col overflow-x-hidden overflow-y-scroll py-2 justify-start md:justify-center"
            >
              <a
                v-for="(item, i) in selectList"
                :key="i"
                class="group flex flex-col justify-between items-baseline hover:text-gray-700 hover:bg-gray-50 px-4 py-2 text-base font-normal rounded-md cursor-pointer lg:text-sm lg:flex-row"
                @click="selectItem(item.value)"
              >
                <div class="font-medium whitespace-nowrap flex items-baseline">
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.desc"
                    class="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-400"
                  >
                    {{ item.desc }}
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
