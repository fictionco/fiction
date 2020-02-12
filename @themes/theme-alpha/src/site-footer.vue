<template>
  <div class="content-footer-wrap">
    <div class="content-footer-pad">
      <div class="footer-col copy-wrap">
        <span v-formatted-text="setting('footer.legal')" class="copyright" />
        <span class="terms">
          <template v-for="(item, index) in setting('footer.nav')">
            <factor-link :key="index" :path="item.path">{{ item.text }}</factor-link>
          </template>
        </span>
      </div>
      <div class="footer-col brand-wrap">
        <site-brand />
      </div>
      <div class="footer-col social">
        <template v-for="(item, index) in setting('site.social')">
          <factor-link :key="index" :path="item.path" class="factor-icon" target="_blank">
            <factor-icon v-if="item.icon" :icon="item.icon" />
          </factor-link>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api/settings"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "site-brand": () => import("./el/brand.vue")
  },
  data: () => {
    return {}
  },
  methods: { setting }
})
</script>

<style lang="less">
.content-footer-wrap {
  background: #110d47;
  color: #e1e1e1;

  .content-footer-pad {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    grid-gap: 0 10px;
    align-items: center;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
    max-width: 1024px;

    a {
      color: #fff;
      &:hover {
        color: var(--color-primary);
      }
    }

    .footer-col {
      &.copy-wrap {
        order: 1;
        font-size: 0.7em;
        line-height: 1.6em;

        .terms a {
          padding-left: 10px;
        }
      }
      &.brand-wrap {
        justify-self: center;
        order: 2;
      }
      &.social {
        order: 3;
        text-align: right;
        a {
          padding: 0 0.5em;
        }
      }
    }
  }

  @media screen and (max-width: 900px) {
    .content-footer-pad {
      grid-template-columns: 1fr;
      padding: 1em;
      text-align: center;
      .footer-col {
        padding-bottom: 1em;
        &.copy-wrap {
          order: 3;
          .terms {
            text-align: center;
          }
        }
        &.brand-wrap {
          order: 1;
        }
        &.social {
          order: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
