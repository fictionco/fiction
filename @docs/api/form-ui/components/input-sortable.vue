<template>
  <div class="wrap">
    <factor-input-sortable v-model="sorted" :settings="settings" />
    <div class="drawer">
      <h3>Sortable Value</h3>
      <div class="value">{{ sorted }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorInputSortable } from "@factor/ui"

export default {
  components: { factorInputSortable },
  data() {
    return {
      sorted: [],
      default: [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }],
      settings: [
        {
          input: "text",
          label: "Heading",
          _id: "heading",
          default: "Box",
        },
        {
          input: "textarea",
          label: "Description",
          _id: "description",
          default: "Box Description",
        },
        {
          input: "image-upload",
          label: "Icon",
          _id: "icon",
        },
      ],
    }
  },
}
</script>
<style lang="less" scoped>
.wrap {
  .drawer {
    margin-top: 1.5rem;
  }
}
</style>
