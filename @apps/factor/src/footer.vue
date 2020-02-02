<template>
  <footer class="content-footer">
    <div class="content-footer-pad">
      <div class="footer-col">
        <site-logo />
      </div>
      <div class="footer-col">
        <div class="menu-header">Getting Started</div>
        <factor-link path="/install">Get started</factor-link>
        <factor-link path="/guide">Documentation</factor-link>
        <factor-link path="/themes">Themes</factor-link>
        <factor-link path="/plugins">Plugins</factor-link>
        <factor-link path="/guide/contribution">Contribution</factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Community</div>
        <factor-link path="https://github.com/fiction-com/factor">Github repo</factor-link>
        <factor-link path="https://github.com/fiction-com/factor/issues">Submit an issue</factor-link>
        <factor-link path="/link-to-email-signup">Join dev program</factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Company</div>
        <factor-link path="https://www.fiction.com/careers">We're hiring</factor-link>
        <factor-link path="https://www.facebook.com/fictioncom/">Facebook</factor-link>
        <factor-link path="https://www.fiction.com/contact">Contact Us</factor-link>
      </div>
    </div>
    <div class="copyright-wrap">
      <div class="copyright">
        <div v-formatted-text="setting('footer.legal')" />
        <nav class="copynav">
          <factor-link path="https://www.fiction.com/terms-of-service">Terms</factor-link>
          <factor-link path="https://www.fiction.com/privacy-policy">Privacy</factor-link>
        </nav>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    "site-logo": () => import("./el/brand.vue")
  },
  methods: { setting }
})
</script>

<style lang="less">
.content-footer {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 4em auto 0;
  padding: 0;
  .logo-factor {
    opacity: 0.8;
    .letter {
      fill: var(--color-text);
    }
    .pin {
      fill: var(--color-text);
    }
  }
  .content-footer-pad {
    margin-top: 2em;
    padding: 4em 2em;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0;

    .footer-col {
      .pin {
        display: block;
        width: 35px;
        svg path {
          fill: #506677;
          opacity: 0.2;
        }
      }

      .menu-header {
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        opacity: 0.5;
      }
      a {
        display: block;
        color: inherit;
        line-height: 2em;
        cursor: pointer;
        text-decoration: none;
        transition: opacity 0.1s;
        &:hover {
          opacity: 1;
          color: var(--color-primary);
        }
        &.hiring {
          color: var(--color-secondary);
          opacity: 1;
          font-weight: 700;
          line-height: inherit;
        }
      }
    }
  }
  .copyright-wrap {
    padding-left: 2em;
    padding-right: 2em;
    .copyright {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding-top: 2em;
      padding-bottom: 2em;
      border-top: 1px solid #e8ebed;
      font-size: 0.8em;
    }
    .copynav {
      text-align: right;
      a {
        margin-left: 10px;
        color: inherit;
      }
    }
  }
}
@media screen and (max-width: 767px) {
  .content-footer {
    .content-footer-pad {
      display: grid;
      grid-template-columns: 1fr;
      padding: 0 2em;
      .footer-col {
        padding-bottom: 2em;
      }
    }
    .copyright-wrap {
      .copyright {
        grid-template-columns: 1fr;
      }
      .copynav {
        text-align: left;
        margin-top: 10px;
        a {
          margin-left: 0;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
