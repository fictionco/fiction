<template>
  <factor-link
    class="dashboard-input"
    v-bind="$attrs"
    btn-element="dashboard-btn"
    v-on="$listeners"
  >
    <slot />
  </factor-link>
</template>