<template>
  <div
    class="
      max-w-3xl
      mx-auto
      py-12
      px-4
      sm:px-6
      lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between
    "
  >
    <h2 class="tracking-tight text-xl sm:text-2xl">
      <span class="block text-primary-500 font-semibold mb-2">{{ title }}</span>
      <span class="block text-color-500">{{ subtitle }}</span>
    </h2>
    <div class="mt-4 flex lg:mt-0 lg:flex-shrink-0">
      <slot>
        <ElemButton
          btn="primary"
          to="/install"
          class="font-bold shadow md:py-2.5 md:px-7 md:text-lg md:ml-3"
        >
          Start Now &rarr;
        </ElemButton>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { emitEvent } from "@factor/api"
import ElemButton from "@factor/ui/ElemButton.vue"

export default {
  components: {
    ElemButton,
  },
  props: {
    title: {
      type: String,
      default: "Ready to try it?",
    },
    subtitle: {
      type: String,
      default: "Create a live website in 10 Minutes",
    },
  },
  setup() {
    return {
      emitEvent,
    }
  },
}
</script>
