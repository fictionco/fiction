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
    &:hover {
      opacity: 0.7;
    }
  }

  &.primary {
    color: var(--color-light);
    background: var(--color-primary);
    box-shadow: 0 4px 10px rgba(var(--color-primary-rgb), 0.3);
    transition: all 0.2s ease-in-out;

    &:hover {
      background: #0072c3; //#66bfff;
      box-shadow: 0 4px 4px rgba(var(--color-primary-rgb), 0.2);
    }
  }

  &.secondary {
    color: var(--color-light);
    background: var(--color-secondary);
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);

    &:hover {
      background: #da0066; //#ff66ad;
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
        0 3px 6px rgba(0, 0, 0, 0.08);
    }
  }

  &.tertiary {
    color: var(--color-primary);
    background: var(--color-tertiary);
  }
  &.quaternary {
    color: var(--color-light);
    border: 1px solid var(--color-light);
    &:hover {
      color: var(--color-secondary);
      background: var(--color-light);
      box-shadow: 0 4px 4px rgba(var(--color-primary-rgb), 0.2);
    }
  }

  & + .app-btn {
    margin-left: 1em;
  }
}
</style>
