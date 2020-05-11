<template>
  <div class="mt-2">
    <a
      href="#"
      class="flex justify-between no-underline text-xl text-purple-900 px-6 py-4 hover:text-purple-500 hover:bg-gray-200 active:text-purple-500"
      @click.prevent="active = !active"
    >
      <span class="font-normal leading-tight tracking-tight">{{ title }}</span>
      <span v-if="active" class="ml-4 text-base">
        <factor-icon icon="fas fa-minus" />
      </span>
      <span v-else class="ml-4 text-base">
        <factor-icon icon="fas fa-plus" />
      </span>
    </a>
    <div v-show="active" class="px-6 pb-6 text-gray-600">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import { factorIcon } from "@factor/ui"

export default {
  components: {
    factorIcon,
  },
  props: {
    title: { type: String, default: "" },
  },
  data() {
    return {
      loading: true,
      active: false,
    }
  },
  methods: { setting },
}
</script>
