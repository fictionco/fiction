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
        <factor-link path="https://factor.dev">Factor JS</factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Connect</div>

        <factor-link path="/contact">Contact Us</factor-link>
        <factor-link path="/chat">Support</factor-link>
      </div>
      <div class="footer-col">
        <div class="menu-header">Company</div>
        <!-- <factor-link path="/about">About</factor-link> -->
        <factor-link path="/careers">Careers</factor-link>
        <factor-link path="/terms-of-service">Terms of Service</factor-link>
        <factor-link path="/privacy-policy">Privacy Policy</factor-link>
      </div>
      <div class="footer-col">
        <div>
          <div class="copyright">&copy; Fiction.com Inc.</div>
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
  padding: 0;
  //max-width: 1200px;
  margin: 3em auto;
  position: relative;
  .content-footer-pad {
    margin: 0 auto;
    padding: 1.5rem;
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
        display: block;
        font-size: 0.9em;
        color: inherit;
        font-weight: 500;
        line-height: 2em;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.2s;
        &:hover {
          color: #ff0076;
        }
      }
      .copyright {
        font-size: 0.7em;
        text-align: right;
        padding-bottom: 0.5em;
      }
    }
  }
}
@media screen and (max-width: 700px) {
  .content-footer {
    .content-footer-pad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 0 2em;
      .footer-col {
        padding-bottom: 2em;
        &:nth-child(1),
        &:nth-child(5) {
          order: 1;
        }
        &:nth-child(5) {
          grid-column: span 2;
        }
        a {
          margin: 0;
        }
        .copyright {
          text-align: right;
          a {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
