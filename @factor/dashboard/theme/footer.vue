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
import Vue from "vue"
export default Vue.extend({})
</script>
<style lang="less">
.app-footer {
  padding: 1.5em 0;
  opacity: 0.4;
  padding-bottom: 2em;
  text-align: left;

  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
