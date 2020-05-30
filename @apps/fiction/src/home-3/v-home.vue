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
  }
  .header-area-text {
    text-align: center;
    padding: 6em 0;
    font-size: 12vw;

    h1 {
      font-size: inherit;
      font-weight: 800;
      line-height: 1.2;
      color: var(--color-primary-dark);
      margin-bottom: 1rem;
    }
    .sub {
      max-width: 56vw;
      margin: 0 auto;
      font-family: var(--font-family-primary);
      font-size: calc(0.125em + 0.6rem);
      line-height: 1.75;
    }
    .actions {
      margin-top: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }
  }
}
</style>
