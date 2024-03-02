<template>
  <input
    ref="customValidityEl"
    :name="$attrs['data-test'] ? `custom-validity-${$attrs['data-test']}` : ''"
    :title="customValidity"
    type="text"
    class="validity-input"
    tabindex="-1"
  />
</template>

<script lang="ts" setup>
import { vue } from "@factor/api"
const props = defineProps({
  customValidity: {
    type: String,
    default: "",
  },
})
const customValidityEl = vue.ref<HTMLInputElement>()
vue.watch(
  () => props.customValidity,
  function (this: any, v?: string | boolean) {
    if (typeof v === "string" && customValidityEl.value) {
      customValidityEl.value.setCustomValidity(v)
    }
  },
  { immediate: true },
)
</script>
<style lang="less">
.validity-input {
  position: absolute;
  height: 1px !important;
  width: 1px !important;
  left: 50%;
  bottom: 0;
  padding: 0;
  background-color: transparent !important;
  pointer-events: none !important;
  border: none !important;
  box-shadow: none !important;
  color: transparent;
}
</style>
