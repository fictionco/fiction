<template>
  <div class="site-footer">
    <div class="site-footer-pad">
      <div class="copy-wrap">
        <span v-formatted-text="setting('footer.legal')" class="legal" />
        <nav class="copynav">
          <factor-link path="https://www.fiction.com/terms-of-service">Terms</factor-link>
          <factor-link path="https://www.fiction.com/privacy-policy">Privacy</factor-link>
        </nav>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { factorLink } from "@factor/ui"

export default {
  components: {
    factorLink,
  },
  methods: { setting },
}
</script>

<style lang="less">
.site-footer {
  position: relative;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 5em auto 0;
  padding: 0;
  .site-footer-pad {
    margin: 0.5rem auto;
    max-width: 1200px;
  }
  .copy-wrap {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    font-size: 0.8em;

    .legal,
    .copynav {
      color: inherit;
      color: var(--color-text-secondary);
      a {
        color: inherit;
      }
    }
    .copynav {
      text-align: right;
      a {
        margin-left: 10px;
      }
    }
  }
}
</style>
