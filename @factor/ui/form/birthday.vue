<template>
  <div class="birthday">
    <div ref="wrap" class="date-inputs">
      <input
        v-model="monthUser"
        data-test="dob-month"
        type="text"
        placeholder="MM"
        maxlength="2"
        title="Enter a number between 1 and 12"
        autocomplete="birthday-day"
        v-on="listeners"
      />

      <div class="sep">-</div>

      <input
        v-model="day"
        data-test="dob-day"
        type="text"
        placeholder="DD"
        maxlength="2"
        title="Enter a number between 1 and 31"
        autocomplete="birthday-month"
        v-on="listeners"
      />

      <div class="sep">-</div>

      <input
        v-model="year"
        data-test="dob-year"
        type="text"
        placeholder="YYYY"
        title="Enter a 4-digit year"
        maxlength="4"
        autocomplete="birthday-year"
        v-on="listeners"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { timeUtil } from "@factor/api"
import Vue from "vue"
import { fluidInput } from "../utils"
export default Vue.extend({
  props: {
    customValidity: { type: String, default: "" },
    value: { type: [String, Date, Number], default: "" }
  },
  data() {
    return {
      day: "",
      monthUser: "",
      year: ""
    }
  },
  computed: {
    listeners(this: any): any {
      return {
        ...this.$listeners,
        input: e => {
          fluidInput(e, this.$refs.wrap)
        },
        keydown: e => {
          fluidInput(e, this.$refs.wrap)
        }
      }
    },
    required(this: any) {
      if (typeof this.$attrs.required != "undefined" || this.theText != "") {
        return true
      } else {
        return false
      }
    },
    theText(this: any) {
      return this.monthUser + this.day + this.year
    },
    month(this: any): number | boolean {
      return parseInt(this.monthUser) >= 1 ? parseInt(this.monthUser) : false
    },
    validity(this: any) {
      let valid = true
      const day = parseInt(this.day)
      const monthUser = parseInt(this.monthUser)
      const year = parseInt(this.year)
      if (isNaN(day) || isNaN(monthUser) || isNaN(year)) {
        valid = false
      } else if (day > 31 || day < 1) {
        valid = false
      } else if (monthUser > 12 || monthUser < 1) {
        valid = false
      } else if (year > 3000 || year < 1000) {
        valid = false
      }

      return valid
    },
    birthday(this: any) {
      let bd = ""

      if (this.validity) {
        bd = timeUtil([this.year, this.month, this.day]).toDate()
      }
      this.setValidity()
      return bd
    }
  },

  mounted() {
    this.$watch(
      `value`,
      function(this: any, v) {
        if (v && v != this.birthday) {
          const M = timeUtil(v)

          this.day = M.date()
          this.monthUser = M.month() + 1
          this.year = M.year()
        }
      },
      { immediate: true }
    )
    this.$watch("birthday", function(this: any) {
      this.$emit("dob", {
        month: this.monthUser,
        day: this.day,
        year: this.year
      })
      this.$emit("day", this.day)
      this.$emit("month", this.monthUser)
      this.$emit("year", this.year)
      this.$emit("input", this.birthday)
    })
  },

  methods: {
    fluidInput,
    setValidity(this: any) {
      let customValidity = ""
      if (!this.validity && this.required) {
        customValidity = `Please format the date correctly`
      }

      this.$emit("update:customValidity", customValidity)
    }
  }
})
</script>

<style lang="less">
.birthday .date-inputs {
  display: flex;
  align-items: center;
  .sep {
    opacity: 0.25;
    padding: 0 0.5em;
  }
  input[type="text"] {
    text-align: center;
    width: 5em;
  }
}
</style>
