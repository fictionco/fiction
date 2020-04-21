<template>
  <div class="example wrap">
    <factor-input-checkbox v-model="checked" label="Checked" />
    <factor-input-checkbox v-model="notChecked" label="Not Checked" />
  </div>
</template>

<script lang="ts">
import { factorInputCheckbox } from "@factor/ui"

export default {
  components: { factorInputCheckbox },
  data() {
    return {
      checked: true,
      notChecked: false,
    }
  },
}
</script>

<style lang="less" scoped>
.wrap {
  justify-content: center;
  display: flex;
  .factor-input {
    margin: 1rem;
  }
}
</style>
