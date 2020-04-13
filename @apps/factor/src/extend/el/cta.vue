<template>
  <section class="plugins-cta-wrap">
    <div class="content-pad">
      <div class="plugins-cta">
        <div class="text">
          <h2 class="title">Have A Factor Plugin or Theme?</h2>
          <div class="sub-title">Submit Your Extension</div>
        </div>

        <div class="buttons">
          <factor-link
            btn="primary"
            path="https://www.fiction.com/contact"
          >Submit &rarr;</factor-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({ components: { factorLink }, methods: { setting } })
</script>
<style lang="less">
.plugins-cta-wrap {
  .content-pad {
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }
  .plugins-cta {
    max-width: 700px;
    margin: 9rem auto 0;
    display: grid;
    grid-gap: 2rem;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr 200px;
    align-items: center;
    .buttons {
      text-align: right;
    }
    .text {
      margin-right: 2rem;
      max-width: 500px;
      font-size: 1.5em;
      h2 {
        &.title {
          color: var(--color-primary);
        }
      }
    }
    @media (max-width: 900px) {
      margin: 0;
      padding: 3rem 0 1rem;
      grid-template-columns: 1fr;
      .buttons {
        text-align: left;
      }
    }
  }
}
</style>
