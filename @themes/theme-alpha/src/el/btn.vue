<template>
  <factor-btn class="app-btn" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-btn>
</template>
<script>
import { factorBtn } from "@factor/ui"
export default {
  components: { factorBtn }
}
</script>

<style lang="less">
button.app-btn {
  padding: 0.6em 1.2em;
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1;
  border-radius: 4px;
  color: var(--color-text, #303030);

  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
    transition: 0s all;
  }

  &.tiny {
    font-size: 11px;
    padding: 4px 6px;
    font-weight: 500;
  }
  &.small {
    font-size: 0.75em;
    padding: 0.35em 0.5em;
  }
  &.large {
    font-size: 1.2em;
  }

  &.subtle {
    box-shadow: none;
    opacity: 0.6;
  }

  &.default {
    color: var(--color-primary, #1a49bd);
    background: var(--color-white);
    box-shadow: inset 0 0 0 0.5px rgba(71, 86, 144, 0.3),
      0 2px 10px rgba(71, 86, 144, 0.2);
    &:hover {
      background: var(--color-tertiary, #9afecb);
    }
  }

  &.primary {
    color: var(--color-white);
    background: var(--color-primary, #1a49bd);
    box-shadow: 0 4px 10px rgba(var(--color-primary-rgb), 0.3);
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0 4px 4px rgba(var(--color-primary-rgb), 0.2);
    }
  }

  &.secondary {
    color: var(--color-white);
    background: var(--color-secondary);
  }

  &.tertiary {
    color: var(--color-primary, #1a49bd);
    background: var(--color-tertiary);
  }
}
</style>
