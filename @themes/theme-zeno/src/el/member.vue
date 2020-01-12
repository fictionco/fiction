<template>
  <div class="mt-4 border border-transparent">
    <h2 class="block text-left custom-uppercase mb-0 text-purple-500">{{ title }}</h2>
    <a
      href="#"
      class="flex justify-between items-center no-underline text-purple-900 hover:text-purple-500"
      @click.prevent="active = !active"
    >
      <h1 class="block text-left font-normal tracking-tight text-2xl">{{ name }}</h1>
      <factor-icon v-if="active" icon="angle-up" />
      <factor-icon v-else icon="angle-down" />
    </a>
    <div v-show="active" class="text-gray-600">
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
    title: { type: String, default: "" },
    name: { type: String, default: "" }
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