<template>
  <div class="list-controls">
    <div class="list-controls-pad">
      <div class="select-all control-col">
        <input v-model="selectAllSelected" type="checkbox" class="checkbox" @click="selectAll()" />
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
            :value="$route.query[statusField]"
            @input="setQuery(statusField, $event)"
          />
        </div>
        <div class="sort-by">
          <factor-input-select
            placeholder="Sort"
            :list="selectItems(controlSort())"
            :value="$route.query.sort"
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
import { ListItem, toLabel, onEvent } from "@factor/api"
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
  watch: {
    selected: function(this: any, v: any[]) {
      if (v.length > 0) {
        this.selectAllSelected = true
      } else {
        this.selectAllSelected = false
      }
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
    getDefaultValue(
      this: any,
      controlId: string,
      controls: ControlAction[]
    ): string | undefined {
      if (this.$route.query[controlId]) {
        return this.$route.query[controlId]
      } else {
        const defaultControl = controls.find(_ => _.default)
        return defaultControl ? defaultControl.value : undefined
      }
    },
    controlSort(this: any): ControlAction[] {
      return [
        { value: "createdAt", label: `Date Created`, default: true },
        { value: "date", label: `Date` },
        { value: "updatedAt", label: `Date Updated` }
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
        const confirmText = actionItem.confirm ? actionItem.confirm(this.selected) : ""
        if ((confirmText && confirm(confirmText)) || !confirmText) {
          this.$emit("action", value)
          this.$emit("select-all", false)
        }
      }
      setTimeout(() => {
        this.actionValue = ""
        this.selectAllSelected = false
      }, 300)
    },
    setQuery(this: any, key: string, value: string): void {
      let query = Object.assign({}, this.$route.query)
      if (!value) {
        delete query[key]
      } else {
        query = { ...query, [key]: value }
      }
      this.$router.push({ query })
    },
    selectAll(this: any) {
      if (this.selectAllSelected) {
        this.selectAllSelected = false
      } else {
        this.selectAllSelected = true
      }

      this.$emit("select-all", this.selectAllSelected)

      onEvent("refresh-table", () => {
        this.selectAllSelected = false
        this.$emit("select-all", false)
      })
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
    font-size: 0.85em;
    grid-gap: 1rem;
    grid-template-columns: 1rem 1fr;
    grid-template-areas:
      "selectors selectors"
      "select actions";
    .selectors {
      justify-content: flex-start;
    }
    .actions {
      align-self: flex-end;
    }
  }
}
</style>
