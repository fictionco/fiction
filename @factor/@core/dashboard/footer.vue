<template>
  <div class="app-footer">
    <div class="footer-pad">
      <div class="legal">
        <div class="copyright">
          Built with the
          <a href="https://factor.dev" target="_blank">Factor Platform</a> by
          <a href="https://www.fiction.com" target="_blank">Fiction</a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.app-footer {
  padding: 1em;
  font-size: 0.85em;
  font-weight: 400;
  opacity: 0.6;
  padding-bottom: 2em;
  a {
    color: inherit;
    text-decoration: underline;
  }
  @media (max-width: 767px) {
    padding-bottom: 6em;
    text-align: center;
  }
}
</style>