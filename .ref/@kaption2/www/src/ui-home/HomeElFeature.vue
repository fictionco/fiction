<script lang="ts" setup>
defineProps({
  pretitle: { type: String, default: '' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  quote: { type: String, default: '' },
  avatar: { type: String, default: '' },
  name: { type: String, default: '' },
  imageClass: { type: String, default: '' },
  image: { type: String, default: '' },
  figure: { type: Object, default: () => {} },
})
</script>

<template>
  <section
    class="mx-auto max-w-sm px-4 py-12 md:max-w-xl lg:max-w-7xl lg:px-10"
  >
    <div class="items-center lg:grid lg:grid-cols-12 xl:gap-24">
      <div class="md:mx-auto md:max-w-2xl lg:col-span-6 lg:pr-20">
        <div class="text-lg text-primary-500">
          {{ pretitle }}
        </div>
        <h2 class="my-8 max-w-sm text-4xl font-extrabold tracking-tight">
          {{ title }}
        </h2>
        <p class="text-theme-500 text-xl leading-relaxed md:mt-5 md:max-w-3xl">
          {{ content }}
        </p>
        <div class="mt-10 flex justify-start">
          <slot />
        </div>
        <div v-if="quote" class="mt-10">
          <p class="text-theme-500 mb-4 text-lg">
            &ldquo;{{ quote }}&rdquo;
          </p>
          <div class="text-xlight-600 flex items-center text-lg">
            <img :src="avatar" class="mr-6 h-12 w-12 rounded-full">
            <span>{{ name }}</span>
          </div>
        </div>
      </div>
      <div class="lg:col-span-6 lg:flex lg:items-center">
        <img
          v-if="image"
          :src="image"
          :alt="title"
          class="w-full rounded-lg"
          :class="imageClass"
        >
        <component :is="figure" v-else-if="figure" />
      </div>
    </div>
  </section>
</template>
