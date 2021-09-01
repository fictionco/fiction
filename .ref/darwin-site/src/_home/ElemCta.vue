<template>
  <div class="">
    <div class="mx-auto text-center px-5 py-16 lg:px-8 lg:my-32">
      <h2 class="text-4xl font-bold sm:text-5xl">
        Turn success into a science.
      </h2>
      <p
        class="
          mt-3
          max-w-md
          mx-auto
          text-lg text-bluegray-500 text-opacity-75
          sm:text-lg
          md:mt-5 md:text-xl md:max-w-3xl
        "
      >
        <span class="inline xl:block"
          >Unlock your hidden potential with the power of high-resolution
          analytics.</span
        >
      </p>
      <div class="mt-4 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <ElemButton
          btn="primary"
          size="lg"
          href="https://app.darwin.so/register"
          >I'm Ready To Try Darwin
        </ElemButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { emitEvent } from "@factor/api"
import ElemButton from "../el/ElemButton.vue"

export default {
  components: {
    ElemButton,
  },
  props: {
    title: {
      type: String,
      default: "Get started with Darwin today",
    },
    subtitle: {
      type: String,
      default: "Metrics and conversion tools to grow with confidence.",
    },
    footer: {
      type: String,
      default: "Get started in minutes.",
    },
  },
  setup() {
    return {
      emitEvent,
    }
  },
}
</script>
