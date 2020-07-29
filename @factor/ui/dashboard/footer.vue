<template>
  <div class="app-footer">
    <div class="footer-pad">
      <div class="legal">
        <div class="copyright">
          Powered by
          <a href="https://factor.dev" target="_blank" rel="noopener noreferrer">Factor</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {}
</script>
<style lang="less">
.app-footer {
  padding: 1.5em 0 0;

  text-align: left;
  color: var(--color-text-secondary, "inherit");
  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
