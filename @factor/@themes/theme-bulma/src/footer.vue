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

          <template v-for="(item, index) in $setting.get('footer.social')">
            <factor-link
              :key="index"
              :path="item.path"
              class="navbar-item is-inline-block"
              target="_blank"
            >
              <factor-icon v-if="item.icon" :icon="item.icon" />
            </factor-link>
          </template>
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
          <factor-link path="/" class="footer-logo">
            <component :is="$setting.get(`footer.logo`)" />
          </factor-link>
        </div>
        <div class="column has-text-centered-mobile has-text-right-tablet is-size-7">
          <div v-formatted-text="$setting.get('footer.legal')" class="copyright" />
          <div class="terms">
            <template v-for="(item, index) in $setting.get('footer.terms')">
              <factor-link :key="index" :path="item.path">{{ item.text }}</factor-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {}
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
    svg {
      width: 34px;
      opacity: 0.2;
    }
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
