<template>
  <factor-btn-base class="app-btn" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-btn-base>
</template>
<script lang="ts">
import { factorBtnBase } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: { factorBtnBase },
})
</script>

<style lang="less">
button.app-btn {
  padding: 0.7em 1.4em;
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1;
  border-radius: 4px;
  color: var(--color-text);
  transition: all 0.2s ease-in-out;
  border: none;
  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
    transition: 0s all;
  }

  &.tiny {
    font-size: 11px;
    padding: 2px 4px;
    font-weight: 500;
  }
  &.small {
    font-size: 0.75em;
    padding: 0.35em 0.5em;
  }
  &.large {
    font-size: 1.2em;
    padding: 0.8em 1.4em 0.9em;
  }

  &.subtle {
    box-shadow: none;
    opacity: 0.6;
  }

  &.default {
    background: var(--color-bg, #fff);
    border-color: var(
      --color-border,
      rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186)
    );
    &:hover {
      background: var(--color-bg-contrast, #f7f7f7);
    }
  }

  &.primary {
    color: var(--color-primary-text, #fff);
    background: var(--color-primary, #0471ff);
    border-color: var(--color-primary, #0471ff);

    .ring-path {
      stroke: var(--color-primary-text, #fff);
    }
  }

  &.secondary {
    color: var(--color-secondary-text, #fff);
    background: var(--color-secondary, #3a4854);
    border-color: var(--color-secondary, #3a4854);

    .ring-path {
      stroke: var(--color-secondary-text, #fff);
    }
  }
}
</style>
