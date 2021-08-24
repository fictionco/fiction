<template>
  <InputSelect :list="list" v-bind="attrs" :default-value="currentTimezone" />
</template>
<script lang="ts">
import { computed } from "vue"

import InputSelect from "./InputSelectCustom.vue"
import timezones from "./lib/timezones.json"
interface TimezoneItem {
  offset: string
  name: string
}
export default {
  components: { InputSelect },
  setup(props, { attrs }) {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const list = computed(() => {
      return timezones.map(({ offset, name }: TimezoneItem) => {
        return {
          name: `${name} (${offset})`,
          value: name,
        }
      })
    })

    return { list, attrs, currentTimezone }
  },
}
</script>
