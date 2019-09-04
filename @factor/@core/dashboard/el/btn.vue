<template>
  <factor-btn class="btn-dashboard" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-btn>
</template>

<style lang="less">
.btn-dashboard {
  + .btn-dashboard,
  + .btn-link {
    margin-left: 0.5rem;
  }
  --btn-shadow-standard: 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
    0 2px 5px 0 rgba(43, 45, 80, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08),
    0 0 0 0 transparent;

  --btn-shadow-standard-hover: 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
    0 2.5px 5px 0 rgba(43, 45, 80, 0.1), 0 1.5px 2px 0 rgba(0, 0, 0, 0.08),
    0 0 0 0 transparent;

  color: var(--color-text);
  transition: 0.15s all;
  opacity: 0.95;
  font-weight: var(--font-weight-bold);
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  letter-spacing: -0.02em;
  box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1), var(--btn-shadow-standard);

  &:active {
    opacity: 0.8;
    transition: 0s all;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-0.5px);
    box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
      var(--btn-shadow-standard-hover);
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

  &.primary {
    color: hsla(0, 0%, 100%, 0.9);
    background: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary), var(--btn-shadow-standard);
    &:hover {
      color: #fff;
      box-shadow: 0 0 0 1px var(--color-primary),
        var(--btn-shadow-standard-hover);
    }
  }
  &.secondary {
    color: hsla(0, 0%, 100%, 0.9);
    background: var(--color-secondary);
    box-shadow: 0 0 0 1px var(--color-secondary), var(--btn-shadow-standard);
    &:hover {
      color: #fff;
      box-shadow: 0 0 0 1px var(--color-secondary),
        var(--btn-shadow-standard-hover);
    }
  }
  // &.selected {
  //   color: hsla(0, 0%, 100%, 0.9);
  //   background: #506677;
  //   box-shadow: 0 0 0 1px #506677, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
  //     0 2px 5px 0 rgba(43, 45, 80, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08),
  //     0 0 0 0 transparent;
  //   &:hover {
  //     color: #fff;
  //     box-shadow: 0 0 0 1px #506677, 0 1.5px 1px 0 rgba(59, 65, 94, 0.1),
  //       0 2.5px 5px 0 rgba(43, 45, 80, 0.1), 0 1.5px 2px 0 rgba(0, 0, 0, 0.08),
  //       0 0 0 0 transparent;
  //   }
  // }
}
</style>