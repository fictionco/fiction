<template>
  <btn-base class="btn-dashboard" v-bind="$attrs" v-on="$listeners">
    <slot />
  </btn-base>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: {
    "btn-base": () => import("./btn-base.vue")
  }
})
</script>
<style lang="less">
.factor-dashboard {
  .factor-btn + .factor-btn,
  .btn-link + .factor-btn {
    margin-left: 0.5rem;
  }
}

.btn-dashboard.factor-btn {
  color: var(--color-text);
  transition: 0.15s all;
  opacity: 0.95;
  font-weight: var(--font-weight-bold);
  padding: 0.55em 1em;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  font-size: 1em;
  &:active {
    opacity: 0.8;
    transition: 0s all;
  }

  &:hover {
    opacity: 0.8;
  }

  &.tiny {
    font-size: 11px;
    padding: 2px 4px;
    font-weight: 500;
  }
  &.small {
    font-size: 12px;
    padding: 0.35em 0.75em;
  }
  &.large {
    font-size: 1.2em;
  }

  &.subtle {
    box-shadow: none;
    opacity: 0.6;
  }

  &.default {
    box-shadow: inset 0 0 0 1px var(--panel-border-color);
  }

  &.primary {
    color: hsla(0, 0%, 100%, 0.9);
    background: var(--color-primary);

    &:hover {
      color: #fff;
    }
  }
  &.secondary {
    color: hsla(0, 0%, 100%, 0.9);
    background: var(--color-secondary);

    &:hover {
      color: #fff;
    }
  }
}
</style>
