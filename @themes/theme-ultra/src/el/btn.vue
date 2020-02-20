<template>
  <factor-btn-base class="app-btn" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-btn-base>
</template>
<script lang="ts">
import { factorBtnBase } from "@factor/ui"
export default {
  components: { factorBtnBase }
}
</script>

<style lang="less">
button.app-btn {
  padding: 0.6em 1.2em;
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1;
  border-radius: 4px;
  letter-spacing: -0.02em;
  color: rgba(var(--color-text-rgb), 0.8);

  &:hover {
    transform: translateY(-2px);
  }

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
    background: #fff;
    box-shadow: inset 0 0 0 0.5px rgba(71, 86, 144, 0.3),
      0 2px 10px rgba(71, 86, 144, 0.2);
  }

  &.primary {
    color: #fff;
    background: var(--color-primary);
    border-color: var(--color-primary);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: var(--color-primary-dark);
    }
  }

  &.primary-ol {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    &:hover {
      color: var(--color-text-light);
    }
  }

  &.secondary {
    color: var(--color-primary);
    background: var(--color-text-light);
    border: 1px solid var(--color-text-light);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    &:hover {
      color: var(--color-primary-darker);
    }
  }
}
</style>
