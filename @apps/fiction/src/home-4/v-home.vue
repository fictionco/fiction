<template>
  <div class="home-view">
    <section class="header-area">
      <div class="header-area-text">
        <h1>Let's build.</h1>
        <h3 class="sub">Fiction starts, develops, and funds early stage software companies.</h3>
        <factor-link btn="primary" size="large" path="/contact">Contact us &rarr;</factor-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import fictionLogo from "../img/fiction.jpg"
export default {
  components: {
    factorLink,
  },
  data() {
    return {
      loading: true,
      buttonsLoaded: false,
    }
  },
  mounted() {},

  metaInfo() {
    return {
      title: "We start, partner and invest in early stage software companies.",
      description: `Fiction helps entrepreneurs develop, market and launch applications.`,
      image: fictionLogo,
    }
  },
}
</script>
<style lang="less">
.home-view {
  .header-area {
    padding: 1rem;
    max-width: 1100px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media (max-width: 900px) {
      padding: 1rem 2rem;
    }
  }
  .header-area-text {
    max-width: 540px;
    margin: 0 auto;
    padding: 6em 0;
    text-align: left;

    h1 {
      font-size: 5em;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;
      color: var(--color-primary);

      @media (max-width: 900px) {
        font-size: 4em;
      }
    }
    .sub {
      font-family: var(--font-family-primary);
      font-size: 1.6rem;
      letter-spacing: -0.03em;
      margin-bottom: 2rem;

      @media (max-width: 900px) {
        font-size: 1.4rem;
      }
    }
    .actions {
      margin-top: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }
  }
}
</style>
