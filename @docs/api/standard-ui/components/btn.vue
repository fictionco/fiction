<template>
  <div class="example docs-component-example">
    <div class="row">
      <factor-btn btn="primary" @click="clk()">Click Me</factor-btn>
      <factor-btn btn="secondary" @click="clk()">Click Me</factor-btn>
      <factor-btn btn="default" @click="clk()">Click Me</factor-btn>
      <factor-btn btn="text" @click="clk()">Click Me</factor-btn>
    </div>
    <div class="row sizes">
      <factor-btn size="large" @click="clk()">Click Me</factor-btn>
      <factor-btn size="small" @click="clk()">Click Me</factor-btn>
      <factor-btn size="tiny" @click="clk()">Click Me</factor-btn>
    </div>

    <div class="row loading">
      <factor-btn size="large" :loading="true" @click="clk()">Click Me</factor-btn>
      <factor-btn size="small" :loading="true" @click="clk()">Click Me</factor-btn>
      <factor-btn size="tiny" :loading="true" @click="clk()">Click Me</factor-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { emitEvent } from "@factor/api"
import { factorBtn } from "@factor/ui"
export default {
  components: { factorBtn },
  methods: {
    clk() {
      emitEvent("notify", "clicked")
    },
  },
}
</script>
<style lang="less" scoped>
.example {
  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .factor-btn {
      margin: 1rem;
    }
  }
}
</style>
