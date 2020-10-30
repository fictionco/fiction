<template lang="pug">
  factorInputWrap(v-bind="$attrs" v-on="$listeners")
    slot
</template>
<script lang="ts">
import { factorInputWrap } from "@factor/ui"

export default {
  components: { factorInputWrap },
}
</script>
