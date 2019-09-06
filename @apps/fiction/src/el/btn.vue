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
  padding: 0.7em 1.4em;

  font-weight: 700;
  line-height: 1;
  border-radius: 4px;
  color: var(--color-text);
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
    transition: 0s all;
  }

  &.tiny {
    font-size: 10px;
    padding: 3px 7px;
    font-weight: 500;
    letter-spacing: -0.02em;
    font-weight: 700;
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
    background: #fff;
    box-shadow: inset 0 0 0 0.5px rgba(71, 86, 144, 0.4),
      0 2px 5px rgba(71, 86, 144, 0.2);
  }

  &.primary,
  &.secondary,
  &.tertiary {
    box-shadow: 0 2px 5px rgba(71, 86, 144, 0.2);
  }

  &.primary {
    color: var(--color-light);
    background: var(--color-primary);
    transition: all 0.2s ease-in-out;
  }

  &.secondary {
    color: var(--color-light);
    background: var(--color-secondary);
  }

  &.tertiary {
    color: var(--color-primary);
    background: var(--color-tertiary);
  }

  & + .app-btn {
    margin-left: 1em;
  }
}
</style>
