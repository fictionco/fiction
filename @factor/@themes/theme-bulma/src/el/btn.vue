<template>
  <factor-btn class="app-btn" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-btn>
</template>
<script>
export default {
  mounted() {}
}
</script>

<style lang="less">
button.app-btn {
  padding: 0.6em 1.2em;
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1;
  border-radius: 4px;

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
    font-size: 75em;
    padding: 0.35em 0.75em;
  }
  &.large {
    font-size: 1.2em;
  }

  &.subtle {
    box-shadow: none;
    opacity: 0.6;
  }

  &.primary {
    color: var(--color-light);
    background: var(--color-primary);
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: none;
    }
  }

  &.secondary {
    color: var(--color-light);
    background: var(--color-secondary);
  }

  &.tertiary {
    color: var(--color-primary);
    background: var(--color-tertiary);
  }
}
</style>