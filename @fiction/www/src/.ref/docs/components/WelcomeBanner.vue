<script lang="ts" setup>
defineProps({
  title: { type: String, default: '' },
  note: { type: String, default: '' },
})
</script>

<template>
  <div>
    <div
      class="overflow-hidden rounded-lg border border-slate-300 bg-white lg:grid lg:grid-cols-12 lg:gap-4"
    >
      <div
        class="col-span-8 flex flex-col justify-center px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:p-20"
      >
        <div class="lg:self-center">
          <div class="text-theme-400 mb-2 text-xs font-semibold uppercase">
            Documentation
          </div>
          <h2 class="text-xl font-bold xl:text-3xl">
            <span class="block">Welcome to The Docs</span>
          </h2>
          <p class="text-theme-500 mt-4 leading-6">
            Here you can learn all about how to use and leverage Fiction to
            create the results you're looking for.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
