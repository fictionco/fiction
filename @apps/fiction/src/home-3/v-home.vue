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
    h1 {
      font-size: 6em;
      font-weight: 800;
      line-height: 1.2;
      //color: var(--color-primary);
    }
    .sub {
      font-size: 3em;
      color: var(--color-text-secondary);
    }
    .actions {
      margin-top: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }
  }
}
</style>
