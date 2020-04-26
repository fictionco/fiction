<template>
  <div class="example docs-component-example">
    <div class="row">
      <factor-avatar :user="{email: `andrew@fiction.com`}" />
      <factor-avatar email="ray@fiction.com" />
      <factor-avatar url="/icon.svg" />
      <factor-avatar email="no-exist@fiction.com" />
      <factor-avatar :loading="true" />
    </div>
  </div>
</template>
<script lang="ts">
import { emitEvent } from "@factor/api"
import { factorAvatar } from "@factor/ui"
export default {
  components: { factorAvatar },
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
    flex-wrap: wrap;
    align-items: center;
    .factor-avatar {
      width: 4rem;
      margin: 1rem;
    }
  }
}
</style>
