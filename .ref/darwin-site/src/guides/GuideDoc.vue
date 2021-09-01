<template>
  <div
    class="guide-doc min-w-0 w-full max-w-3xl flex-auto px-4 sm:px-6 pt-10 pb-16 lg:static lg:max-h-full lg:overflow-visible xl:px-8"
  >
    <HighlightCode class="shadow-none">
      <div class="prose prose-purple lg:text-lg" v-html="content" />
    </HighlightCode>
  </div>
</template>
<script lang="ts">
import HighlightCode from "@factor/plugin-highlight-code/HighlightCode.vue"

export default {
  components: {
    HighlightCode,
  },
  props: {
    content: { type: String, default: "" },
  },
}
</script>
