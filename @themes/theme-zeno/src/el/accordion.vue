<template>
  <div class="mt-2 border border-transparent" :class="{ 'border-gray-200 bg-white': active }">
    <a
      href="#"
      class="flex justify-between no-underline text-xl text-purple-900 px-6 py-4 hover:text-purple-500 hover:bg-white active:text-purple-500"
      @click.prevent="active = !active"
    >
      <span class="font-semibold leading-tight tracking-tight">{{ title }}</span>
      <span v-show="!active" class="ml-4">
        <factor-icon icon="plus" />
      </span>
      <span v-show="active" class="ml-4">
        <factor-icon icon="minus" />
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
import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon
  },
  props: {
    title: { type: String, default: "" }
  },
  data() {
    return {
      loading: true,
      active: false
    }
  },
  methods: { setting }
})
</script>
