<template>
  <div class="dbt">
    <div class="dbt-body dbt-grid">
      <div class="dbt-head dbt-row" :style="{'grid-template-columns': columns}">
        <div
          v-for="(col, iCol) in structure"
          :key="iCol"
          class="dbt-col"
          :class="[col.type, col.size, col.column]"
        >{{ $utils.toLabel(col.column) }}</div>
      </div>
      <div
        v-for="(row, iRow) in rows"
        :key="iRow"
        class="dbt-body-row dbt-row"
        :class="path ? 'clickable' : ''"
        :style="{'grid-template-columns': columns}"
        @click="navigate(row)"
      >
        <div
          v-for="(col, iCol) in structure"
          :key="iCol"
          class="dbt-col"
          :class="[col.type, col.size, col.column]"
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
<script>
export default {
  props: {
    rowItems: { type: Array, default: () => [] },
    structure: { type: Array, default: () => [] },
    zeroState: { type: Number, default: 0 },
    rowNumber: { type: Number, default: 0 },
    path: { type: String, default: "" }
  },
  computed: {
    rows() {
      if (this.rowItems.length > 0) {
        return this.rowItems
      } else {
        let f = this.rowNumber > 0 ? this.rowNumber : this.zeroState

        return new Array(f).fill({})
      }
    },
    columns() {
      let _ = []

      this.structure.forEach(col => {
        const size = col.size ? col.size : "1fr"
        _.push(size)
      })

      return _.join(" ")
    }
  },
  methods: {
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

        var reg = new RegExp(match, "g")

        str = str.replace(reg, row[varName])
      })

      return str
    }
  }
}
</script>
<style lang="less">
.dbt {
  font-weight: 500;
  .dbt-grid {
    display: grid;

    .dbt-row {
      padding: 1em 0;
      font-weight: 600;
      display: grid;
      // align-items: center;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: 2em;

      color: inherit;
      border-radius: 4px;
      transition: all 0.1s;
      &.clickable:hover {
        cursor: pointer;

        box-shadow: inset 0 0 0 1px rgba(43, 45, 80, 0.1);
      }
    }
    .dbt-col {
      flex: 1 1 100%;
      min-width: 0;
      &:last-child {
        //text-align: right;
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
    opacity: 0.3;

    .dbt-col {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
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