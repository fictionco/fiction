<template>
  <div class="list-controls">
    <div class="list-controls-pad">
      <div class="select-all control-col">
        <input type="checkbox" class="checkbox" />
      </div>
      <div class="actions control-col">
        <div class="select-action">
          <factor-input-select placeholder="Actions" :list="selectItems(controlActions)"></factor-input-select>
        </div>
      </div>
      <div class="selectors control-col">
        <div class="select-status">
          <factor-input-select placeholder="Status" :list="selectItems(controlStatus)"></factor-input-select>
        </div>
        <div class="sort-by">
          <factor-input-select placeholder="Sort" :list="selectItems(controlSort())"></factor-input-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorInputSelect } from "@factor/ui"
import { ControlAction } from "@factor/dashboard/types"
import { ListItem } from "@factor/api"
export default Vue.extend({
  components: { factorInputSelect },
  props: {
    controlActions: { type: Array, default: () => [] },
    controlStatus: { type: Array, default: () => [] }
  },
  computed: {
    selectActions(this: any) {
      return this.controlActions.filter(
        (item: ControlAction) => !item.condition || item.condition(this.$route.query)
      )
    }
  },
  methods: {
    selectItems(this: any, actions?: ControlAction[]): ListItem[] {
      if (!actions) return []
      return actions.filter(
        (item: ControlAction) => !item.condition || item.condition(this.$route.query)
      )
    },
    controlSort(this: any) {
      return [
        { value: "-date", label: `Publication` },
        { value: "-updatedAt", label: `Updated At` },
        { value: "-createdAt", label: `Created At` }
      ]
    }
  }
})
</script>

<style lang="less">
.list-controls-pad {
  display: grid;
  grid-template-columns: 2rem 1fr 1fr;

  .control-col {
    display: flex;
    align-items: center;
    &.selectors {
      justify-content: flex-end;
    }
    .sort-by {
      margin-left: 1rem;
    }
  }
  .select-all {
  }
}
</style>
