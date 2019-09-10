<template>
  <div class="grid-actions">
    <dashboard-input
      v-model="action"
      input="factor-input-select"
      placeholder="Actions"
      format="simple"
      :list="actions"
    />
    <dashboard-btn :disabled="!action" :loading="loading" @click="send($event)">Apply</dashboard-btn>
  </div>
</template>

<script>
export default {
  props: {
    actions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      action: ""
    }
  },
  methods: {
    send(action) {
      this.$emit("action", this.action)
      this.action = ""
    }
  }
}
</script>

<style lang="less">
.grid-actions {
  display: flex;

  > * {
    margin-right: 10px;
  }
  select {
    font-size: 14px;
  }
}
</style>
