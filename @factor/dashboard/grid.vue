<template>
  <div class="dashboard-grid-wrap">
    <component :is="'style'" class="dynamic-var">
      .dashboard-grid-wrap{ --column-structure: {{ columns }}
      }
    </component>
    <div class="dashboard-grid">
      <div class="dashboard-grid-head dashboard-grid-row">
        <div v-for="col in structure" :key="col._id" class="cell">
          <template v-if="col._id == 'select'">
            <input
              :value="selected"
              type="checkbox"
              class="checkbox"
              @click="selectAll()"
            />
          </template>
          <span v-else class="head-text">{{ col.name || toLabel(col._id) }}</span>
        </div>
      </div>
      <div
        v-for="(row, index) in rowSet"
        :key="index"
        class="dashboard-grid-body-row dashboard-grid-row"
        :class="path ? 'clickable' : ''"
        @click="navigate(row)"
      >
        <div v-for="col in structure" :key="col._id" class="cell">
          <div
            v-if="zeroState > 0 && rowNumber == 0 && rows.length == 0"
            class="zero-content"
          >
            <div v-if="col.type == 'media'" class="zero-media">
              <div class="box" />
            </div>
            <div class="zero-lines" :class="col.type">
              <div class="line" />
              <div
                v-if="col.type == 'double' || col.type == 'media'"
                class="line short"
              />
            </div>
          </div>
          <template v-else>
            <slot :name="col._id" :value="row[col._id]" :row="row" :index="index" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { toLabel } from "@factor/tools"
export default Vue.extend({
  props: {
    rows: { type: Array, default: () => [] },
    structure: { type: Array, default: () => [] },
    zeroState: { type: Number, default: 2 },
    rowNumber: { type: Number, default: 0 },
    path: { type: String, default: "" }
  },
  data() {
    return {
      selected: false
    }
  },
  computed: {
    rowSet() {
      if (this.rows.length > 0) {
        return this.rows
      } else {
        const f = this.rowNumber > 0 ? this.rowNumber : this.zeroState

        return new Array(f).fill({})
      }
    },
    columns() {
      return this.structure.map((col) => col.width).join(" ")
    }
  },
  methods: {
    toLabel,
    selectAll() {
      if (this.selected) {
        this.selected = false
      } else {
        this.selected = true
      }

      this.$emit("select-all", this.selected)
    },
    navigate(row) {
      if (this.path) {
        const path = this.interpolate(this.path, row)
        this.$router.push({ path })
      } else {
        return
      }
    },
    interpolate(str, row) {
      str.match(/{.+?}/g).forEach((match) => {
        const varName = match.replace(/{(.*?)}/, "$1")

        const reg = new RegExp(match, "g")

        str = str.replace(reg, row[varName])
      })

      return str
    }
  }
})
</script>
<style lang="less">
.dashboard-grid-wrap {
  padding-right: 0.5em;
  width: 100%;
  overflow-x: scroll;
  .dashboard-grid {
    .dashboard-grid-row {
      padding: 1em 0;
      color: inherit;
      border-radius: 4px;
      transition: all 0.1s;

      display: grid;
      grid-template-columns: var(--column-structure);
      grid-column-gap: 1.5em;

      &.clickable:hover {
        cursor: pointer;
        box-shadow: inset 0 0 0 1px rgba(43, 45, 80, 0.1);
      }

      @media (max-width: 767px) {
        grid-row-gap: 1em;
      }
    }

    .cell {
      &:last-child {
        text-align: right;
        .zero-lines .line {
          float: right;
          width: 50%;
        }
      }
    }
  }

  .dashboard-grid-head {
    .head-text {
      opacity: 0.3;
    }
    font-weight: 600;
  }

  .zero-content {
    display: flex;

    .box,
    .line {
      background: #f1f5f9;
    }
    .zero-media {
      max-width: 40px;
      flex: 0 1 40%;
      margin-right: 8px;
      .box {
        padding: 50%;
        border-radius: 50%;
      }
    }
    .zero-lines {
      flex: 1 1 100%;
      .line {
        display: block;
        border-radius: 3px;
        height: 1em;
        margin: 0 0 0.4em 0;
        max-width: 80%;
        &.short {
          max-width: 40px;
        }
      }
    }
  }
}
</style>
