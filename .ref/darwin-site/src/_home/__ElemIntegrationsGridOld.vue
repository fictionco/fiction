<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 gap-8 justify-between items-center"
  >
    <template v-for="(item, i) in integrations" :key="i">
      <div
        class="
          h-36
          w-36
          flex
          items-center
          justify-center
          shadow
          p-4
          rounded-md
          transform
          transition-all
          hover:-translate-y-1 hover:shadow-2xl
        "
      >
        <Logos
          :logo="item.logo"
          :style="`color`"
          class="max-w-full"
          :class="item.class ? item.class : 'h-16'"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import Logos from "../_global/ElemLogo.vue"

export default {
  components: {
    Logos,
  },
  setup() {
    const integrations = ref([
      {
        logo: "hubspot",
      },
      {
        logo: "wordpress",
      },
      {
        logo: "instapage",
      },
      {
        logo: "squarespace",
      },
      {
        logo: "weebly",
      },
      {
        logo: "joomla",
        class: "h-12",
      },
      {
        logo: "shopify",
      },
      {
        logo: "wix",
        class: "h-6",
      },
      {
        logo: "webflow",
      },
    ])

    return { integrations }
  },
}
</script>
