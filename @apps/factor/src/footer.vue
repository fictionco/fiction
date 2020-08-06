<template>
  <footer class="content-footer">
    <div class="content-footer-pad">
      <div class="footer-col">
        <factor-link path="/" class="factor-pin">
          <svg
            width="35"
            height="40"
            viewBox="0 0 35 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 20C0 12.8943 5.76036 7.13391 12.8661 7.13391H20.7739C27.8796 7.13391 33.6399 12.8943 33.6399 20C33.6399 27.1058 27.8796 32.8661 20.7738 32.8661H12.8661C5.76035 32.8661 0 27.1058 0 20ZM12.8661 13.0969C9.05359 13.0969 5.96294 16.1875 5.96294 20C5.96294 23.8126 9.05359 26.9032 12.8661 26.9032H20.7738C24.5864 26.9032 27.6771 23.8126 27.6771 20C27.6771 16.1875 24.5864 13.0969 20.7739 13.0969H12.8661Z"
              fill="#0471FF"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.7318 40C14.3444 40 14.0303 39.6859 14.0303 39.2985V0.701524C14.0303 0.314082 14.3444 0 14.7318 0H19.2917C19.6792 0 19.9932 0.314081 19.9932 0.701518V39.2985C19.9932 39.6859 19.6792 40 19.2917 40H14.7318Z"
              fill="#0471FF"
            />
          </svg>
        </factor-link>
      </div>
      <div class="footer-col list">
        <div class="menu-header">Build Apps</div>
        <factor-link path="/install">Install</factor-link>
        <factor-link path="/docs">Documentation</factor-link>
        <factor-link path="/forum">Support Forum</factor-link>
      </div>
      <div class="footer-col list">
        <div class="menu-header">Extend</div>

        <factor-link path="/themes">Themes</factor-link>
        <factor-link path="/plugins">Plugins</factor-link>
        <!-- <factor-link path="/pro">Pro / Business Suite</factor-link> -->
        <factor-link path="/developers">Contribute</factor-link>
      </div>

      <div class="footer-col list">
        <div class="menu-header">Company</div>
        <factor-link path="https://fiction.com/careers?ref=factor">We're hiring</factor-link>
        <!-- <factor-link path="https://factor.dev/blog" target="_blank">Blog</factor-link> -->
        <factor-link path="/contact">Contact Us</factor-link>
      </div>

      <div class="footer-col icons">
        <!-- <factor-link class="icon-link" path="https://go.factor.dev/facebook" target="_blank">
          <factor-icon icon="fab fa-facebook" />
        </factor-link>-->
        <factor-link class="icon-link" path="https://go.factor.dev/twitter" target="_blank">
          <factor-icon icon="fab fa-twitter" />
        </factor-link>
        <factor-link class="icon-link" path="https://go.factor.dev/slack" target="_blank">
          <factor-icon icon="fab fa-slack" />
        </factor-link>
        <factor-link class="icon-link" path="https://go.factor.dev/github" target="_blank">
          <factor-icon icon="fab fa-github" />
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

export default {
  components: {
    factorLink,
    factorIcon,
  },
  methods: { setting },
}
</script>

<style lang="postcss">
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
      .factor-pin {
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
          color: var(--color-text-secondary);
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
          color: var(--color-text-secondary);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        a {
          display: block;

          color: var(--color-text-secondary);
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
      color: var(--color-text-secondary);
      a {
        color: var(--color-text);
      }
    }
    .copynav {
      text-align: right;
      a {
        margin-left: 10px;
        color: var(--color-text-secondary);
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
