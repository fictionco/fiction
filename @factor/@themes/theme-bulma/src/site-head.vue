<template>
  <div class="site-head">
    <nav class="navbar container" role="navigation" aria-label="main navigation">
      <slot />
    </nav>
  </div>
</template>
<style src="#/css/mystyles.scss" lang="sass"></style>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss">
.site-head {
  padding: 0 1.5em;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 15px rgba(0, 0, 0, 0.03);
  background: #fff;
  position: relative;
  z-index: 10;

  .navbar {
    .navbar-item {
      font-family: var(--family-secondary);
      font-weight: var(--weight-bold);
    }
  }
}
</style>