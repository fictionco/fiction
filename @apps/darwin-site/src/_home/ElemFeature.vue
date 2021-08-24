<template>
  <section
    class="mx-auto max-w-sm md:max-w-xl lg:max-w-7xl px-4 py-12 lg:px-10"
  >
    <div class="items-center lg:grid lg:grid-cols-12 xl:gap-24">
      <div class="md:max-w-2xl md:mx-auto lg:col-span-6 lg:pr-20">
        <div class="text-lg text-primary-500">
          {{ pretitle }}
        </div>
        <h2 class="max-w-sm my-8 text-4xl tracking-tight font-extrabold">
          {{ title }}
        </h2>
        <p
          class="text-xl text-bluegray-500 leading-relaxed md:mt-5 md:max-w-3xl"
        >
          {{ content }}
        </p>
        <div class="mt-10 flex justify-start">
          <slot />
        </div>
        <div class="mt-10" v-if="quote">
          <p class="text-lg text-bluegray-500 mb-4">
            &ldquo;{{ quote }}&rdquo;
          </p>
          <div class="flex items-center text-lg text-xlight-600">
            <img :src="avatar" class="w-12 h-12 rounded-full mr-6" />
            <span>{{ name }}</span>
          </div>
        </div>
      </div>
      <div class="lg:col-span-6 lg:flex lg:items-center">
        <img
          v-if="image"
          :src="image"
          :alt="title"
          class="rounded-lg w-full"
          :class="imageClass"
        />
        <component :is="figure" v-else-if="figure" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  props: {
    pretitle: { type: String, default: "" },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    quote: { type: String, default: "" },
    avatar: { type: String, default: "" },
    name: { type: String, default: "" },
    imageClass: { type: String, default: "" },
    image: { type: String, default: "" },
    figure: { type: Object, default: () => {} },
  },
  setup() {},
}
</script>
