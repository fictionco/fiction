<template>
  <factor-link class="app-input" v-bind="$attrs" btn-element="app-btn" v-on="$listeners">
    <slot />
  </factor-link>
</template>


<style lang="less">
.btn-link {
  + .app-btn,
  + .btn-link {
    margin-left: 1rem;
    @media (max-width: 767px) {
      margin-left: 0;
      margin-top: 1em;
    }
  }
}
</style>