<template>
  <div class="content-footer">
    <div class="logo">
      <factor-link path="https://www.fiction.com" class="pin">
        <component :is="setting(`footer.logo`)" />
      </factor-link>
    </div>
    <div class="legal">
      <div v-formatted-text="setting('footer.headline')" class="license" />
      <div v-formatted-text="setting('footer.legal')" class="copyright" />
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  methods: { setting }
})
</script>

<style lang="less">
.content-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.6em;
  font-size: 0.9em;
  padding: 2em 1em 4em;
  margin-top: 4em;

  .logo {
    margin-bottom: 1em;
  }
  .pin {
    display: inline-block;
    &:last-of-type {
      margin-left: 15px;
    }
  }
  .legal {
    line-height: 1.8;
    text-align: center;
  }
  .license {
    font-weight: var(--font-weight-bold);
  }
  .copyright {
    opacity: 0.7;
  }
  a {
    color: inherit;
    text-decoration: underline;
  }
  @media (max-width: 900px) {
    display: block;
    text-align: left;
    .legal {
      text-align: left;
    }
  }
}
</style>
