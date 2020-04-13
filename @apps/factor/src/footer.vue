<template>
  <footer class="content-footer">
    <div class="content-footer-pad">
      <div class="footer-col">
        <factor-link path="/" class="fiction-pin">
          <svg
            width="39"
            height="41"
            viewBox="0 0 39 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.307 40.5H16.5925C15.508 40.5 14.4866 40.0577 13.7194 39.2507L0.984092 25.8887C0.0213371 24.8811 -0.26336 23.3741 0.256049 22.0564C0.777632 20.7364 1.99248 19.8815 3.35512 19.8815H18.9613V3.51018C18.9613 2.0853 19.7741 0.810894 21.0303 0.263742C22.2668 -0.276572 23.7403 0.0312015 24.6857 1.02292L37.4275 14.3894C38.1947 15.1987 38.6163 16.268 38.6163 17.4033V34.9327C38.6141 38.0036 36.2344 40.5 33.307 40.5ZM17.2922 34.4768H32.8745V18.1306L24.7031 9.5585V25.9047H9.12078L17.2922 34.4768Z"
              fill="white"
            />
          </svg>
        </factor-link>
      </div>
      <div class="footer-col list">
        <div class="menu-header">Getting Started</div>
        <factor-link path="/install">Get started</factor-link>
        <factor-link path="/docs">Documentation</factor-link>
        <factor-link path="/themes">Themes</factor-link>
        <factor-link path="/plugins">Plugins</factor-link>
        <factor-link path="/docs/contribution">Contribution</factor-link>
      </div>
      <div class="footer-col list">
        <div class="menu-header">Community</div>
        <factor-link
          path="https://go.factor.dev/slack"
          target="_blank"
        >Slack Channel</factor-link>
        <factor-link
          path="https://go.factor.dev/github"
          target="_blank"
        >Github repo</factor-link>
        <factor-link path="https://factor.dev/blog" target="_blank">Blog</factor-link>
        <factor-link path="/#join">Join dev program</factor-link>
      </div>
      <div class="footer-col list">
        <div class="menu-header">Company</div>
        <factor-link path="https://www.fiction.com/careers">We're hiring</factor-link>
        <factor-link
          path="https://go.factor.dev/facebook"
          target="_blank"
        >Facebook</factor-link>
        <factor-link path="https://www.fiction.com/contact">Contact Us</factor-link>
      </div>

      <div class="footer-col icons">
        <factor-link
          class="icon-link"
          path="https://go.factor.dev/facebook"
          target="_blank"
        >
          <factor-icon icon="fab fa-facebook" />
        </factor-link>
        <factor-link
          class="icon-link"
          path="https://go.factor.dev/twitter"
          target="_blank"
        >
          <factor-icon icon="fab fa-twitter" />
        </factor-link>
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
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
  },
  methods: { setting },
})
</script>

<style lang="less">
.content-footer {
  position: relative;
  width: 100%;
  max-width: var(--content-width, 1200px);
  margin: 4em auto 0;
  padding: 0;
  .logo-factor {
    opacity: 0.8;
  }
  .content-footer-pad {
    margin-top: 2em;
    padding: 4em 1rem;
    display: grid;
    grid-template-columns: 0.9fr repeat(2, 1fr) 0.8fr 0.5fr;
    grid-gap: 0;

    .footer-col {
      .fiction-pin {
        display: block;
        svg {
          width: 50px;
          height: 50px;
        }
        svg path {
          fill: var(--color-primary);
        }
      }
      &.icons {
        text-align: right;
        .icon-link {
          font-size: 1.2em;
          color: inherit;
          opacity: 0.8;

          margin: 0 0.5rem;
          display: inline-block;
          border-radius: 50%;
          text-align: center;

          &:hover {
            color: var(--color-primary);
            opacity: 1;
          }
        }
      }
      &.list {
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
  }
  .copyright-wrap {
    padding-left: 1rem;
    padding-right: 1rem;
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
      padding: 0 1rem;
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
