<script lang="ts" setup>
import { vue } from '@fiction/core'

import timezones from '@fiction/core/utils/lib/timezones.json'
import InputSelect from './InputSelectCustom.vue'

interface TimezoneItem {
  offset: string
  name: string
}

const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const list = vue.computed(() => {
  return timezones.map(({ offset, name }: TimezoneItem) => {
    return {
      name: `${name} (${offset})`,
      value: name,
    }
  })
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <InputSelect v-bind="{ ...$attrs, list }" :default-value="currentTimezone" />
</template>
