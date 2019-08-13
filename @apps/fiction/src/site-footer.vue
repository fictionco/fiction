<template>
  <div class="content-footer">
    <div class="content-footer-pad">
      <div class="footer-col">
        <factor-link path="/" class="pin">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 99.98">
            <path
              d="M1677.77,1510.83h-43.29a10.41,10.41,0,0,1-7.43-3.09l-33-33a8.69,8.69,0,0,1,6.14-14.83h40.41v-40.42a8.67,8.67,0,0,1,5.36-8,8.8,8.8,0,0,1,9.47,1.87l33,33a10.48,10.48,0,0,1,3.08,7.44v43.28A13.76,13.76,0,0,1,1677.77,1510.83ZM1636.29,1496h40.35v-40.35l-21.16-21.16v40.35h-40.35Z"
              transform="translate(-1591.51 -1410.85)"
            />
          </svg>
        </factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Products</div>
        <factor-link path="/factor-js">Factor JS</factor-link>
        <factor-link path="/vip">VIP</factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Company</div>
        <factor-link path="/careers">Careers</factor-link>
        <factor-link path="/blog">Blog</factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Connect</div>
        <factor-link path="/contact">Contact Us</factor-link>
        <factor-link path="/chat">Support</factor-link>
      </div>
      <div class="footer-col">
        <factor-link path="/careers" class="hiring">We're Hiring!</factor-link>
        <div>
          <div class="copyright">
            <span>&copy; Fiction.com Inc.</span>
            <factor-link path="/terms-of-service">Terms</factor-link>
            <factor-link path="/privacy-policy">Privacy</factor-link>
          </div>
        </div>
      </div>
    </div>
  </div>
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
.content-footer {
  position: relative;
  width: 100%;
  max-width: var(--max-width);
  margin: 4em auto;
  padding: 0;
  .content-footer-pad {
    margin: 0 auto;
    padding: 1.5rem 2em;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
        font-size: 0.875em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.025em;
        margin-bottom: 0.5rem;
        color: #1b223c;
        opacity: 0.5;
      }
      a {
        display: block;
        font-size: 0.875em;
        color: #1b223c;
        opacity: 0.5;
        font-weight: 500;
        line-height: 2em;
        cursor: pointer;
        text-decoration: none;
        transition: opacity 0.1s;
        &:hover {
          opacity: 1;
        }
        &.hiring {
          color: #ff0076;
          opacity: 1;
          font-weight: 700;
          line-height: inherit;
        }
      }
      .copyright {
        margin-top: 4em;
        padding-bottom: 0.5em;
        span,
        a {
          font-size: 0.7em;
          color: #1b223c;
          opacity: 0.5;
          display: inline-block;
          margin-left: 5px;
        }
        a:hover {
          opacity: 1;
        }
      }
    }
  }
}
@media screen and (max-width: 700px) {
  .content-footer {
    .content-footer-pad {
      display: grid;
      grid-template-columns: 1fr;
      padding: 0 2em;
      .footer-col {
        padding-bottom: 2em;
      }
    }
  }
}
</style>
