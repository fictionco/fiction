<template>
  <footer class="content-footer-wrap text-bluegray-600">
    <div class="content-footer-pad">
      <div class="footer-col copy-wrap">
        <span v-if="footerLegal" v-formatted-text="footerLegal" class="copyright" />
        <span v-if="footerNav" class="terms">
          <template v-for="(item, index) in footerNav">
            <factor-link :key="index" :path="item.path">{{ item.text }}</factor-link>
          </template>
        </span>
      </div>
      <div class="footer-col factor-col">
        <factor-link path="https://factor.dev/">
          <factor-logo-icon class="factor-img-footer" />
        </factor-link>
      </div>
      <div v-if="footerSocial" class="footer-col social">
        <template v-for="(item, index) in footerSocial">
          <factor-link :key="index" :path="item.path" class="factor-icon" target="_blank">
            <factor-icon v-if="item.icon" :icon="item.icon" />
          </factor-link>
        </template>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api/settings"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "factor-logo-icon": () => import("./el/factor.vue")
  },
  data: () => {
    return {
      footerLegal: setting("footer.legal"),
      footerNav: setting("footer.nav"),
      footerSocial: setting("site.social")
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.content-footer-wrap {
  background: #110d47;

  .content-footer-pad {
    display: grid;
    grid-template-columns: 3fr 1fr 3fr;
    grid-gap: 0 10px;
    align-items: center;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
    max-width: 1024px;

    a {
      color: #99adc0;
      &:hover {
        color: var(--color-primary);
      }
    }

    .footer-col {
      &.copy-wrap {
        order: 1;
        font-size: 0.8em;

        .terms a {
          padding: 0 7px;
        }
      }
      &.factor-col {
        order: 2;
        display: flex;
        justify-content: center;
      }
      &.social {
        order: 3;
        text-align: right;

        a {
          font-size: 1.2em;
          padding: 0 0.5em;
        }
      }
    }
  }

  @media screen and (max-width: 900px) {
    .content-footer-pad {
      grid-template-columns: 1fr;
      padding: 2rem 1rem 3rem;
      text-align: center;
      .footer-col {
        padding-bottom: 1em;
        &.copy-wrap {
          order: 2;
          font-size: 1em;
          .copyright,
          .terms a {
            display: block;
            padding: 0.5em 0;
          }
          .terms {
            text-align: center;
          }
        }
        &.social {
          order: 1;
          text-align: center;
        }
      }
    }
  }
}
</style>
