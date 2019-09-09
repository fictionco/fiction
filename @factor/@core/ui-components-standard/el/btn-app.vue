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
  --shadow-btn: 0 2px 10px rgba(71, 86, 144, 0.2);
  --shadow-btn-hover: 0 4px 10px rgba(71, 86, 144, 0.2);
  padding: 0.6em 1.2em;
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1;
  border-radius: 4px;
  letter-spacing: -0.02em;
  color: rgba(var(--color-text-rgb), 0.8);
  transition: all 0.2s ease-in-out;
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
    box-shadow: inset 0 0 0 0.5px rgba(71, 86, 144, 0.3), var(--shadow-btn);
  }

  &.primary,
  &.secondary {
    box-shadow: var(--shadow-btn);

    &:hover {
      box-shadow: var(--shadow-btn-hover);
    }
  }

  &.primary {
    color: var(--color-primary-text, #fff);
    background: var(--color-primary);

    .ring-path {
      stroke: var(--color-primary-text, #fff);
    }
  }

  &.secondary {
    color: var(--color-secondary-text, #fff);
    background: var(--color-secondary);

    .ring-path {
      stroke: var(--color-secondary-text, #fff);
    }
  }
}
</style>x