<template>
  <div class="content-footer-wrap">
    <div class="content-footer">
      <div class="content-footer-pad">
        <div class="footer-col">
          <div
            class="copyright"
          >&copy; {{ new Date().getFullYear() }} Factor Alpha Theme by Fiction Inc. All rights reserved.</div>
        </div>
        <div class="footer-col">
          <div>
            <div class="terms">
              <factor-link v-if="!$uid" event="signin-modal" data-test="login">Sign In</factor-link>
              <factor-link v-else path="/dashboard">View Dashboard</factor-link>
              <factor-link path="/terms-of-service">Terms of Service</factor-link>
              <factor-link path="/privacy-policy">Privacy Policy</factor-link>
              <factor-link path="/" btn="tertiary" size="large">
                <i class="fa fa-long-arrow-up" />
              </factor-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data: () => {
    return {}
  },
  computed: {}
}
</script>

<style lang="less">
.content-footer {
  max-width: 1024px;
  margin: 0 auto;
  position: relative;
  .content-footer-pad {
    max-width: 1024px;
    margin: 0 auto;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 10px;
    align-items: center;

    .footer-col {
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
        line-height: 1.6em;
      }
      .terms {
        text-align: right;
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
@media screen and (max-width: 767px) {
  .content-footer {
    .content-footer-pad {
      grid-template-columns: 1fr;
      padding: 1em;
      text-align: center;
      .footer-col {
        padding-bottom: 1em;
        .terms {
          text-align: center;
        }
      }
    }
  }
}
</style>
