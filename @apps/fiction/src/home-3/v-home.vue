<template>
  <div class="home-view">
    <section class="header-area">
      <div class="header-area-text">
        <h1>Let's build.</h1>
        <h3 class="sub">Fiction starts, develops, and funds early stage software companies.</h3>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import fictionLogo from "../img/fiction.jpg"
export default {
  components: {},
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
    text-align: center;
    padding: 6em 0;

    @media (max-width: 900px) {
      text-align: left;
    }

    h1 {
      font-size: 6em;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;

      @media (max-width: 900px) {
        font-size: 4em;
      }
    }
    .sub {
      max-width: 55vw;
      margin: 0 auto;
      font-family: var(--font-family-primary);
      font-size: 2.4rem;
      letter-spacing: -0.03em;
      color: var(--color-text-secondary);

      @media (max-width: 900px) {
        max-width: 100vw;
        font-size: 1.4rem;
        margin: 0;
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
