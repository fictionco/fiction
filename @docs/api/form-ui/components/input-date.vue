<template>
  <div class="example wrap">
    <factor-input-date v-model="publishOn" />
  </div>
</template>

<script lang="ts">
import { factorInputDate } from "@factor/ui"

export default {
  components: { factorInputDate },
  data() {
    return {
      publishOn: new Date(),
    }
  },
}
</script>

<style lang="less" scoped>
.wrap {
  justify-content: center;
  display: flex;
  .factor-input {
    margin: 1.5rem;
  }
}
</style>
