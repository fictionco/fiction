<template>
  <div class="content-footer-wrap">
    <div class="content-footer">
      <div class="content-footer-pad">
        <div class="footer-col">
          <div v-formatted-text="setting('footer.legal')" class="copyright" />
        </div>
        <div class="footer-col">
          <div>
            <div class="terms">
              <template v-for="(item, index) in setting('footer.nav')">
                <factor-link :key="index" :path="item.path">{{ item.text }}</factor-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setting } from "@factor/tools/settings"
export default {
  components: {},
  data: () => {
    return {}
  },
  methods: { setting }
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
      .copyright,
      .terms {
        font-size: 0.7em;
        line-height: 1.6em;
      }
      .terms {
        text-align: right;
        a {
          color: inherit;
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
