<template>
  <div id="sel" class="date-input">
    <date-picker
      ref="picker"
      :value="val"
      class="date-picker"
      calendar-class="date-picker-cal"
      format="yyyy-M-d"
      v-on="listeners"
    />
  </div>
</template>

<script lang="ts">
import { toDate } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    "date-picker": () => import("vuejs-datepicker")
  },
  props: {
    value: { type: String, default: null }
  },
  data() {
    return { date: null }
  },
  computed: {
    val() {
      return this.value ? toDate(this.value) : ""
    },
    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit("input", event.toISOString())
        }
      }
    }
  },

  methods: {
    clk() {
      this.$refs.picker.showCalendar()
    }
  }
})
</script>

<style lang="less">
#sel.date-input {
  display: flex;
  .el-btn {
    margin-right: 5px;
  }
  .date-picker {
    input[type="text"] {
      cursor: pointer;
      width: 100%;
    }
    .date-picker-cal {
      right: 0;
      border: none;
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 6px 14px 0 rgba(24, 32, 41, 0.06),
        0 12px 34px 0 rgba(24, 32, 41, 0.04);

      .cell:not(.blank):not(.disabled) {
        &.day,
        &.month,
        &.year {
          &:hover {
            border: 1px solid var(--color-primary);
          }
        }
      }

      .cell {
        border-radius: 4px;
        &.selected {
          color: hsla(0, 0%, 100%, 0.9);
          background: var(--color-primary);
        }
      }
    }
  }
}
</style>
