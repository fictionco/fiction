<template>
  <div class="content-footer-wrap">
    <div class="content-footer">
      <div class="content-footer-pad">
        <div class="footer-col">
          <factor-link path="/">
            <site-logo theme="muted" />
          </factor-link>
        </div>
        <div class="footer-col">
          <div class="menu-header">Developers</div>
          <factor-link path="/docs">Docs</factor-link>
          <factor-link path="/plugins">Plugins</factor-link>
          <factor-link path="/">Quick Start</factor-link>
        </div>
        <div class="footer-col">
          <div class="menu-header">Connect</div>

          <factor-link path="/link">Contact Us</factor-link>
          <factor-link path="/link">Link</factor-link>
          <factor-link path="/link">Link</factor-link>
        </div>
        <div class="footer-col">
          <div class="menu-header">Header</div>
          <factor-link path="/link">Link</factor-link>
          <factor-link path="/link">Link</factor-link>
          <factor-link path="/link">Link</factor-link>
        </div>
        <div class="footer-col">
          <div>
            <div class="copyright">&copy; Factor by Fiction Inc.</div>
            <div class="terms">
              <factor-link path="/terms-of-service">Terms of Service</factor-link>
              <factor-link path="/privacy-policy">Privacy Policy</factor-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "site-logo": () => import("./el/factor-logo")
  },
  data: () => {
    return {}
  },
  computed: {}
}
</script>

<style lang="less">
.content-footer {
  padding: 3em 2em;
  max-width: 1024px;
  margin: 0 auto;
  position: relative;
  .content-footer-pad {
    max-width: 1024px;
    margin: 0 auto;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 0;

    .footer-col {
      &:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
      }

      .menu-header {
        font-weight: 600;
        opacity: 0.3;
        margin-bottom: 0.5rem;
      }
      a {
        font-size: 0.9em;

        color: inherit;
        font-weight: 500;
        line-height: 2em;
        display: block;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.2s;
        &:hover {
          color: #ff0076;
        }
      }
      .copyright,
      .terms {
        font-size: 0.7em;
        text-align: right;
      }
      .copyright {
        padding-bottom: 0.5em;
      }
      .terms {
        opacity: 0.5;
        a {
          display: inline-block;
          padding-left: 10px;
        }
      }
    }
  }
}
@media screen and (max-width: 700px) {
  .content-footer {
    .content-footer-pad {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      .footer-col {
        padding-bottom: 2em;
        &:first-child {
          grid-column-start: 1;
          grid-column-end: -1;
        }
        &:last-child {
          align-items: flex-start;
        }
        .copyright,
        .terms {
          text-align: left;
          a {
            display: block;
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
