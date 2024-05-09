<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import { debounce, useService, vue } from '@fiction/core'
import { onMounted } from 'vue'

const props = defineProps({
  fetchData: {
    type: Function as vue.PropType<(search: string) => Promise<NavItem[]>>,
    required: true,
  },
  placeholder: String,
})

const emit = defineEmits(['update:modelValue'])

const searchText = vue.ref('')
const options = vue.ref<NavItem[]>([])
const isLoading = vue.ref(false)

async function loadData(search: string) {
  isLoading.value = true
  try {
    options.value = await props.fetchData(search)
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    isLoading.value = false
  }
}

const debouncedLoadData = debounce(loadData, 300)

onMounted(() => loadData(''))

function handleSelect(option: NavItem) {
  emit('update:modelValue', option)
  searchText.value = option.name ?? ''
}
</script>

<template>
  <div>
    <div class="relative mt-1">
      <input
        id="combobox"
        v-model="searchText"
        type="text"
        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
        :placeholder="placeholder"
        :class="{ loading: isLoading }"
        @input="debouncedLoadData(searchText)"
      >
      <ul v-if="options.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
        <li
          v-for="option in options"
          :key="option.key"
          class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
          @click="handleSelect(option)"
        >
          <span class="ml-3 truncate">{{ option.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
