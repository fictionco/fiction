<template>
  <div class="home-view">
    <section class="header-area">
      <div class="header-area-text">
        <h1>Welcome to Fiction</h1>
        <h3 class="sub">Fiction starts, buys, and invests in internet businesses.</h3>
        <factor-link btn="primary" path="/contact">Contact us &rarr;</factor-link>
      </div>
    </section>

    <!-- <blockquote>
      <p>"Technology alone is not enough—it’s technology married with liberal arts, married with the humanities, that yields us the results that make our heart sing."</p>
      <cite>&mdash; Steve Jobs</cite>
    </blockquote>-->
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
      title: "Fiction Fund",
      description: `Fiction helps entrepreneurs develop, market and launch applications.`,
      image: fictionLogo,
    }
  },
}
</script>
<style lang="less">
.home-view {
  blockquote {
    max-width: 500px;
    margin: 3rem auto;
    p {
      font-weight: 700;
    }
    cite {
      opacity: 0.7;
    }
  }
  .header-area {
    padding: 1rem;
    max-width: 1100px;
    margin: 0 auto;
    height: 90vh;
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media (max-width: 900px) {
      padding: 1rem 2rem;
    }
  }
  .header-area-text {
    max-width: 640px;
    margin: 0 auto;
    padding: 6em 0;
    text-align: left;

    h1 {
      font-size: 2em;
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
