<template>
  <div id="sel" class="date-input">
    <datepicker
      ref="picker"
      :value="val"
      class="date-picker"
      calendar-class="date-picker-cal"
      format="yyyy-M-d"
      v-on="listeners"
    />
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker"
export default {
  components: {
    Datepicker
  },
  props: {
    value: { type: [Number], default: null }
  },
  data() {
    return { date: null }
  },
  computed: {
    val() {
      return this.value ? this.$time.util(this.value).toDate() : null
    },
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit("input", this.$time.stamp(event))
      }
    }
  },

  mounted() {},
  methods: {
    clk() {
      this.$refs.picker.showCalendar()
    }
  }
}
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
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
        0 6px 14px 0 rgba(24, 32, 41, 0.06),
        0 12px 34px 0 rgba(24, 32, 41, 0.04);

      .cell:not(.blank):not(.disabled) {
        &.day,
        &.month,
        &.year {
          &:hover {
            border: 1px solid @color-primary;
          }
        }
      }

      .cell {
        border-radius: 4px;
        &.selected {
          color: hsla(0, 0%, 100%, 0.9);
          background: @color-primary;
        }
      }
    }
  }
}
</style>
