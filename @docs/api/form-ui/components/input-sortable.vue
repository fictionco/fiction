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
import { sortableSettings } from "@factor/templates"
export default {
  components: { factorInputSortable },
  data() {
    return {
      sorted: [],

      settings: [
        {
          input: "text",
          label: "Heading",
          _id: "heading",
          _default: "Box",
        },
        {
          input: "textarea",
          label: "Description",
          _id: "description",
          _default: "Box Description",
        },
      ],
    }
  },
  mounted(this: any) {
    this.sorted = sortableSettings({
      _default: [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }],
      settings: this.settings,
    })
  },
}
</script>
<style lang="less" scoped>
.wrap {
  .drawer {
    margin-top: 1.5rem;
    .value {
      opacity: 0.6;
      font-weight: 600;
      font-family: "Courier New", Courier, monospace;
      font-size: 0.8em;
    }
  }
}
</style>
