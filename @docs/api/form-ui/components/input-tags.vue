<template>
  <div class="example wrap">
    <div class="inputs">
      <factor-input-tags v-model="form.tags" />
      <factor-input-tags v-model="form.categories" :list="['foo', 'bar', 'baz']" />
    </div>

    <div class="drawer">
      <h3>Value</h3>
      <div class="value">{{ form }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorInputTags } from "@factor/ui"

export default {
  components: { factorInputTags },
  data() {
    return {
      form: { tags: [], categories: [] },
    }
  },
}
</script>

<style lang="less" scoped>
.wrap {
  .inputs {
    display: flex;
    flex-wrap: wrap;
    .factor-input {
      margin: 1rem;
    }
  }
  .drawer {
    margin-top: 1.5rem;
    .value {
      opacity: 0.6;
      font-weight: 600;
      font-family: "Courier New", Courier, monospace;
      font-size: 0.8em;
    }
  }
}
</style>
