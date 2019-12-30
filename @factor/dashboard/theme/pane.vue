<template>
  <div class="dashboard-pane">
    <div v-if="title || $slots.nav" class="head">
      <div v-if="$slots.title">
        <slot name="title" />
      </div>
      <div v-else v-formatted-text="title" class="title" />
      <div class="actions">
        <slot name="nav" />
      </div>
    </div>
    <div v-if="$slots.default" class="cont">
      <slot />
    </div>
    <div v-if="note || $slots.actions" class="foot">
      <div v-if="note" v-formatted-text="note" class="note" />
      <div class="actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    title: { type: String, default: "" },
    note: { type: String, default: "" }
  }
})
</script>

<style lang="less">
.dashboard-pane {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--panel-border-color);

  margin-bottom: 2em;
  .head,
  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    padding: 1rem;
  }
  .head {
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid var(--border-color-subtle);
    .title {
      font-weight: 700;
      opacity: 0.4;
    }
  }

  .foot {
    border-radius: 0 0 4px 4px;
    border-top: 1px solid var(--border-color-subtle);
    padding: 1rem;
    justify-content: flex-end;
    margin-top: 1.5em;
    .note {
      font-weight: 500;
    }
  }

  .cont {
    padding: 2rem;

    @media (max-width: 1400px) {
      padding: 1rem;
    }
    @media (max-width: 900px) {
      padding: 1rem;
    }

    > :last-child {
      margin-bottom: 0;
    }
  }
}
</style>
