<template>
  <figure>
    <figcaption
      v-if="title"
      class="text-sm text-center font-mono py-1 bg-purple-700 text-purple-300 rounded-t md:rounded-tl"
    >{{ title }}</figcaption>
    <div class="bg-purple-900 text-gray-500 p-4 text-sm md:py-8 md:px-24">
      <pre><code class="prism">{{ code() }}</code></pre>
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  components: {},
  props: {
    title: { type: String, default: "" },
  },
  methods: {
    code() {
      return `
<template>

  <section class="hero">
    <div class="mx-auto">

      <div
        v-if="subheadline" v-formatted-text="subheadline"
        :class="alignment"
      />

      <h1
        v-if="headline"
        :class="alignment"
      >
        {{ headline }}
      </h1>

      <div :class="alignment">
        <slot name="hero-content" />
      </div>

    </div>
  </section>

</template>

`
    },
  },
}
</script>
