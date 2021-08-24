<template>
  <div>
    <HighlightCode class="shadow-none">
      <div class="entry max-w-prose m-auto lg:px-6">
        <h1 class="border-b border-bluegray-200 mb-12 pb-6">
          {{ config.attributes?.title }}
        </h1>
        <component :is="config.component" />
      </div>
    </HighlightCode>
  </div>
</template>
<script lang="ts">
import HighlightCode from "@factor/plugin-highlight-code/HighlightCode.vue"

import { docSetting } from "../helpers"
import { DocPageConfig } from "../types"
import { PropType } from "vue"
export default {
  components: {
    HighlightCode,
  },
  props: {
    config: { type: Object as PropType<DocPageConfig>, default: () => {} },
  },
  setup() {
    return { docSetting }
  },
}
</script>
<style lang="less">
@import "@factor/ui/entry.less";
</style>
