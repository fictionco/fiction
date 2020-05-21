<template>
  <div class="upgrade-factor content">
    <div class="content-pad">
      <div class="head">
        <home-icon icon="powered" />
        <h2 class="title">Try Pro Today</h2>
        <h3 class="sub-title">No risk, money-back guarantee</h3>
      </div>
      <div class="actions">
        <factor-link path="/plans" btn="primary">Upgrade Your App &rarr;</factor-link>
        <factor-link path="/pro" btn="default">Learn More &rarr;</factor-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink, homeIcon: () => import("./icon.vue") },
}
</script>

<style lang="less">
.upgrade-factor {
  text-align: center;
  padding: 0 0 3rem;
  line-height: 1.1;

  .content-pad {
    max-width: 700px;
    margin: 0 auto;
  }
  figure.icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
    font-size: 3.5em;

    border-radius: 50%;
    margin: 1rem auto;
  }
  .title {
    font-size: 3em;
    font-weight: 700;
  }
  .sub-title {
    font-size: 2em;
    opacity: 0.8;
    margin-top: 1rem;
  }
  .actions {
    margin: 2rem 0;
    font-size: 1.3em;
    .btn-link + .btn-link {
      margin-left: 1rem;
    }
  }
  @media (max-width: 900px) {
    text-align: left;
    padding: 1rem 0 7rem;
    .title {
      font-size: 2em;
    }
    .actions {
      .btn-link + .btn-link {
        margin-top: 1rem;
        margin-left: 0;
      }
    }
  }
}
</style>
