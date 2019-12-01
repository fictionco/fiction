<template>
  <div class="dbt">
    <div class="dbt-body dbt-grid">
      <div class="dbt-head dbt-row cols-16" :style="{'grid-template-columns': columns}">
        <div
          v-for="(col, iCol) in structure"
          :key="iCol"
          class="dbt-col"
          :class="[col.column, col.class, col.mobile]"
        >
          <template v-if="col.column == 'select'">
            <input :value="selected" type="checkbox" class="checkbox" @click="selectAll()" />
          </template>
          <span v-else class="head-text">{{ col.name || toLabel(col.column) }}</span>
        </div>
      </div>
      <div
        v-for="(row, iRow) in rows"
        :key="iRow"
        class="dbt-body-row dbt-row cols-16"
        :class="path ? 'clickable' : ''"
        :style="{'grid-template-columns': columns}"
        @click="navigate(row)"
      >
        <div
          v-for="(col, iCol) in structure"
          :key="iCol"
          class="dbt-col"
          :class="[col.column, col.class, col.mobile]"
        >
          <div v-if="zeroState > 0 && rowNumber == 0 && rowItems.length == 0" class="zero-content">
            <div v-if="col.type == 'media'" class="zero-media">
              <div class="box" />
            </div>
            <div class="zero-lines" :class="col.type">
              <div class="line" />
              <div v-if="col.type == 'double' || col.type == 'media'" class="line short" />
            </div>
          </div>

          <slot v-else :column="col.column" :item="row[col.column]" :row="row" :index="iRow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { toLabel } from "@factor/tools"
export default {
  props: {
    rowItems: { type: Array, default: () => [] },
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
    rows() {
      if (this.rowItems.length > 0) {
        return this.rowItems
      } else {
        const f = this.rowNumber > 0 ? this.rowNumber : this.zeroState

        return new Array(f).fill({})
      }
    },
    columns() {
      const _ = []

      this.structure.forEach(col => {
        const colClass = col.class ? col.class : "col-4"
        _.push(colClass)
      })

      return _.join(" ")
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
      str.match(/{.+?}/g).forEach(match => {
        const varName = match.replace(/{(.*?)}/, "$1")

        const reg = new RegExp(match, "g")

        str = str.replace(reg, row[varName])
      })

      return str
    }
  }
}
</script>
<style lang="less">
.dbt {
  padding-right: 0.5em;
  .dbt-grid {
    display: grid;

    .dbt-row {
      padding: 1em 0;
      color: inherit;
      border-radius: 4px;
      transition: all 0.1s;

      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: 1em;

      &.cols-16 {
        grid-template-columns: repeat(16, 1fr);
      }

      &.clickable:hover {
        cursor: pointer;
        box-shadow: inset 0 0 0 1px rgba(43, 45, 80, 0.1);
      }

      @media (max-width: 767px) {
        grid-row-gap: 1em;
      }
    }
    .dbt-col {
      // flex: 1 1 100%;
      // min-width: 0;

      // 16 Column Grid
      &.col-1 {
        grid-column: span 1;
      }
      &.col-2 {
        grid-column: span 2;
      }
      &.col-3 {
        grid-column: span 3;
      }
      &.col-4 {
        grid-column: span 4;
      }
      &.col-5 {
        grid-column: span 5;
      }
      &.col-6 {
        grid-column: span 6;
      }
      &.col-7 {
        grid-column: span 7;
      }
      &.col-8 {
        grid-column: span 8;
      }
      &.col-9 {
        grid-column: span 9;
      }
      &.col-10 {
        grid-column: span 10;
      }
      &.col-11 {
        grid-column: span 11;
      }
      &.col-12 {
        grid-column: span 12;
      }
      &.col-13 {
        grid-column: span 13;
      }
      &.col-14 {
        grid-column: span 14;
      }
      &.col-15 {
        grid-column: span 15;
      }
      &.col-16 {
        grid-column: span 16;
      }

      // Fixed Size Columns
      &.col-fixed-40 {
        width: 40px;
      }
      &.col-fixed-200 {
        width: 200px;
      }
      //Mobile Columns
      @media (max-width: 767px) {
        &.mcol-1 {
          grid-column: span 1;
        }
        &.mcol-2 {
          grid-column: span 2;
        }
        &.mcol-2-15 {
          grid-column-start: 2;
          grid-column-end: span 15;
        }
        &.mcol-3 {
          grid-column: span 3;
        }
        &.mcol-4 {
          grid-column: span 4;
        }
        &.mcol-5 {
          grid-column: span 5;
        }
        &.mcol-6 {
          grid-column: span 6;
        }
        &.mcol-7 {
          grid-column: span 7;
        }
        &.mcol-8 {
          grid-column: span 8;
        }
        &.mcol-9 {
          grid-column: span 9;
        }
        &.mcol-10 {
          grid-column: span 10;
        }
        &.mcol-11 {
          grid-column: span 11;
        }
        &.mcol-12 {
          grid-column: span 12;
        }
        &.mcol-13 {
          grid-column: span 13;
        }
        &.mcol-14 {
          grid-column: span 14;
        }
        &.mcol-15 {
          grid-column: span 15;
        }
        &.mcol-16 {
          grid-column: span 16;
        }
        &.mcol-auto {
          width: auto;
        }
      }

      &:last-child {
        text-align: right;
        .zero-lines .line {
          float: right;
          width: 50%;
        }
      }

      &.small {
        flex: 0 1 100px;
      }
      &.medium {
        flex: 0 1 200px;
      }
    }
  }

  .dbt-head {
    .head-text {
      opacity: 0.3;
    }
    font-weight: var(--font-weight-bold, 800);
    @media (max-width: 960px) {
      .author,
      .meta {
        display: none;
      }
    }

    // .dbt-col {
    //   white-space: nowrap;
    //   text-overflow: ellipsis;
    //   overflow: hidden;
    // }
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
