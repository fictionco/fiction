<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column is-2 has-text-centered-mobile has-text-left-desktop">
          <factor-link path="/">
            <img class="footer-logo" :src="require(`./img/factor.svg`)" alt="Factor Framework">
          </factor-link>
        </div>
        <div class="column has-text-centered-mobile has-text-right-tablet is-size-7">
          <div class="copyright">&copy; Factor by Fiction.com Inc.</div>
          <div class="terms">
            <factor-link path="https://www.fiction.com/terms-of-service">Terms of Service</factor-link>
            <factor-link path="https://www.fiction.com/privacy-policy">Privacy Policy</factor-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data: () => {
    return {}
  },
  computed: {}
}
</script>

<style lang="less">
.footer {
  .footer-logo {
    width: 100px;
  }
  .copyright {
    padding-bottom: 0.5em;
  }
  .terms {
    a {
      display: inline-block;
      padding-left: 10px;
    }
  }
}
</style>
