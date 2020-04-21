<template>
  <div class="example wrap">
    <factor-input-select v-model="items" :list="['foo', 'bar']" placeholder="Select Something" />
    <factor-input-select
      v-model="items"
      :list="[{name: `A more advanced list`, value: 'foo'}, {name: `With better names`, value: 'bar'}]"
      placeholder="Select An Item"
    />
  </div>
</template>

<script lang="ts">
import { factorInputSelect } from "@factor/ui"

export default {
  components: { factorInputSelect },
  data() {
    return {
      items: "",
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
