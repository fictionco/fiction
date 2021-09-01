<template>
  <div class="">
    <div
      class="mx-auto text-center px-4 py-12 md:max-w-xl lg:max-w-4xl lg:py-28"
    >
      <h2 class="text-4xl font-bold sm:text-5xl">Ready to Start Earning?</h2>
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
        Through the Darwin affiliate program you’re not only earning extra
        money, you’re also helping other marketers just like you do the same.
      </p>
      <div class="mt-4 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <ElemButton btn="primary" size="lg" href="#"
          >Join The Darwin Affiliate Program
        </ElemButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ElemButton from "../el/ElemButton.vue"

export default {
  components: {
    ElemButton,
  },
}
</script>
