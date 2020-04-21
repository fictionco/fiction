<template>
  <div class="example wrap">
    <factor-input-birthday v-model="birthday" />
  </div>
</template>

<script lang="ts">
import { factorInputBirthday } from "@factor/ui"

export default {
  components: { factorInputBirthday },
  data() {
    return {
      birthday: new Date(),
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
