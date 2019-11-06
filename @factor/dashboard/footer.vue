<template>
  <div class="app-footer">
    <div class="footer-pad">
      <div class="legal">
        <div class="copyright">
          Powered by
          <a href="https://factor.dev" target="_blank" rel="noopener noreferrer">Factor JS</a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.app-footer {
  padding: 1.5em;
  font-size: 0.85em;
  font-weight: 600;
  opacity: 0.6;
  padding-bottom: 2em;
  text-align: center;
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
