<template>
  <footer class="footer">
    <div class="container footer-top">
      <div class="columns is-tablet">
        <div class="column">
          <h4 class="menu-label menu-label-indent">Company</h4>
          <ul class="menu-list">
            <li>
              <factor-link path="/" class="navbar-item">Home</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">About</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Pricing</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Blog</factor-link>
            </li>
          </ul>
        </div>
        <div class="column">
          <h4 class="menu-label menu-label-indent">Service</h4>
          <ul class="menu-list">
            <li>
              <factor-link path="/" class="navbar-item">Web</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Marketing</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Graphics</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Mobile</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Product</factor-link>
            </li>
          </ul>
        </div>
        <div class="column">
          <h4 class="menu-label menu-label-indent">Support</h4>
          <ul class="menu-list">
            <li>
              <factor-link path="/" class="navbar-item">Help Center</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Support Ticket</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Contact</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Feedback</factor-link>
            </li>
            <li>
              <factor-link path="/" class="navbar-item">Poll</factor-link>
            </li>
          </ul>
        </div>
        <div class="column is-5">
          <h4 class="menu-label">Follow Us</h4>
          <span class="icon">
            <factor-link path="/" class="navbar-item">
              <factor-icon icon="facebook" size="fa-2x" />
            </factor-link>
          </span>
          <span class="icon">
            <factor-link path="/" class="navbar-item">
              <factor-icon icon="twitter" />
            </factor-link>
          </span>
          <span class="icon">
            <factor-link path="/" class="navbar-item">
              <factor-icon icon="instagram" />
            </factor-link>
          </span>
          <span class="icon">
            <factor-link path="/" class="navbar-item">
              <factor-icon icon="linkedin" />
            </factor-link>
          </span>
          <span class="icon">
            <factor-link path="/" class="navbar-item">
              <factor-icon icon="pinterest" />
            </factor-link>
          </span>
          <h4 class="menu-label">Subscribe</h4>
          <div class="field has-addons">
            <div class="control has-icons-left is-expanded">
              <input class="input" type="email" placeholder="Email input">
              <span class="icon is-small is-left">
                <factor-icon icon="envelope" />
              </span>
            </div>
            <div class="control">
              <a class="button is-primary">
                <factor-icon icon="long-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column">
          <hr>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <div class="columns">
        <div class="column is-2 has-text-centered-mobile has-text-left-desktop">
          <factor-link path="/">
            <img
              class="footer-logo"
              :src="require(`./img/fiction.svg`)"
              alt="Factor Framework by Fiction"
            >
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
  .footer-top {
    .menu-label-indent {
      padding-left: 1em;
      padding-right: 1em;
    }
  }
  .footer-logo {
    width: 34px;
    opacity: 0.2;
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
