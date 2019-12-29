<template>
  <div class="list-controls">
    <div class="list-controls-pad">
      <div class="select-all control-col">
        <input :value="selectAllSelected" type="checkbox" class="checkbox" @click="selectAll()" />
      </div>
      <div class="actions control-col">
        <div class="select-action">
          <factor-input-select
            placeholder="Select Action"
            :list="selectItems(controlActions)"
            :value="actionValue"
            @input="setAction($event)"
          />
        </div>
      </div>
      <div class="selectors control-col">
        <div class="select-status">
          <factor-input-select
            :placeholder="toLabel(statusField)"
            :list="selectItems(controlStatus)"
            @input="setQuery(statusField, $event)"
          />
        </div>
        <div class="sort-by">
          <factor-input-select
            placeholder="Sort"
            :list="selectItems(controlSort())"
            @input="setQuery('sort', $event)"
          />
        </div>
      </div>
    </div>
    <list-empty :loading="loading" :list="list" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import { factorInputSelect } from "@factor/ui"
import { ControlAction } from "@factor/dashboard/types"
import { ListItem, toLabel } from "@factor/api"
export default Vue.extend({
  components: { factorInputSelect, listEmpty: () => import("./list-empty.vue") },
  props: {
    controlActions: { type: Array, default: () => [] },
    controlStatus: { type: Array, default: () => [] },
    statusField: { type: String, default: "status" },
    selected: { type: Array, default: () => [] },
    list: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      selectAllSelected: false,
      actionValue: ""
    }
  },
  computed: {
    selectActions(this: any) {
      return this.controlActions.filter(
        (item: ControlAction) => !item.condition || item.condition(this.$route.query)
      )
    }
  },
  methods: {
    toLabel,
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
    },
    setAction(this: any, value: string): void {
      // Action value needs to change and then be changed back
      // Without this the selector will stay with the action value (no computed thrown)
      this.actionValue = value
      const actionItem = this.controlActions.find(
        (action: ControlAction) => action.value == value
      )

      if (actionItem) {
        if (this.selected.length > 0) {
          const confirmText = actionItem.confirm ? actionItem.confirm(this.selected) : ""
          if ((confirmText && confirm(confirmText)) || !confirmText) {
            this.$emit("action", value)
          }
        } else {
          alert("No items selected.")
        }
      }
      setTimeout(() => {
        this.actionValue = ""
      }, 300)
    },
    setQuery(this: any, key: string, value: string): void {
      this.$router.push({ query: { ...this.$route.query, [key]: value } })
    },
    selectAll(this: any) {
      if (this.selectAllSelected) {
        this.selectAllSelected = false
      } else {
        this.selectAllSelected = true
      }

      this.$emit("select-all", this.selectAllSelected)
    }
  }
})
</script>

<style lang="less">
.list-controls {
  margin-bottom: 1rem;
}
.list-controls-pad {
  display: grid;
  grid-template-columns: 2rem 1fr 1fr;
  grid-template-areas: "select actions selectors";
  .select-all {
    grid-area: select;
  }
  .actions {
    grid-area: actions;
  }
  .selectors {
    grid-area: selectors;
    justify-content: flex-end;
  }
  .control-col {
    display: flex;
    align-items: center;
  }

  .sort-by {
    margin-left: 1rem;
  }
  @media (max-width: 700px) {
    grid-gap: 1rem;
    grid-template-columns: 2rem 1fr;
    grid-template-areas:
      ". selectors"
      "select actions";
    .selectors {
      justify-content: flex-start;
    }
  }
}
</style>
