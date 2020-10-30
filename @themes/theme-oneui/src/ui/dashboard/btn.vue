<template lang="pug">
  btn-base(v-bind="$attrs" v-on="$listeners")
    slot
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { setting } from "@factor/api"

@Component({
  components: {
    "btn-base": setting("core.components.btnBase"),
  },
})
export default class ThemeDashboardBtn extends Vue {}
</script>

<style></style>
