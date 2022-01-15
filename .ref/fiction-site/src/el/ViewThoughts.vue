<template>
  <div class="overflow-hidden relative bg-gray-900">
    <div class="relative z-10">
      <div class="mx-auto max-w-3xl py-16 px-4 lg:py-24 text-center">
        <h1 class="mt-4 text-4xl font-bold text-gray-300 md:text-6xl">
          Ideas about how businesses should be run.
        </h1>
        <p
          class="
            mt-3
            max-w-md
            text-xl text-color-500
            sm:tracking-tight
            md:mt-5 md:max-w-4xl
          "
        >
          A collection of thoughts and opinions we have on business and tech.
        </p>
      </div>
    </div>

    <ElemCta class="relative z-10" />

    <svg
      class="absolute z-0 max-w-lg h-auto top-0 right-0 text-gray-700"
      viewBox="0 0 768 1948"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M768 25.445C328.922 125.873 1.431 517.77 1.431 985.905c0 468.135 327.492 860.035 766.569 960.455v1.03C328.368 1846.94.431 1454.6.431 985.905.431 517.213 328.367 124.866 768 24.419v1.026z"
        fill="currentColor"
      />
      <path
        d="M768 1805.9c-363.092-97.63-630.342-428.95-630.342-822.664 0-393.71 267.25-725.037 630.342-822.663v1.036c-362.533 97.6-629.342 428.473-629.342 821.627 0 393.154 266.809 724.024 629.342 821.624v1.04z"
        fill="currentColor"
      />
      <path
        d="M768 1667.17c-291.152-92.99-501.824-363.97-501.824-683.768 0-319.796 210.672-590.771 501.824-683.759v1.05c-290.594 92.952-500.824 363.476-500.824 682.709 0 319.238 210.23 589.758 500.824 682.718v1.05z"
        fill="currentColor"
      />
      <path
        d="M768 1514.73c-207.948-86.47-354.069-290.75-354.069-528.993 0-238.234 146.121-442.516 354.069-528.985v1.083c-207.384 86.411-353.069 290.234-353.069 527.902 0 237.673 145.685 441.493 353.069 527.903v1.09z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import ElemCta from "./ElemCta.vue"

export default {
  components: {
    ElemCta,
  },
  setup() {
    return {}
  },
  metaInfo(this: any) {
    return {
      title: "",
      description:
        "A collection of thoughts and opinions we have on business and tech.",
    }
  },
}
</script>
