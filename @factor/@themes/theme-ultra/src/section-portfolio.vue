<template>
  <section id="portfolio" class="portfolio-container page-container">
    <div class="header">
      <h2 class="pretitle">{{ $setting.get('portfolio.pretitle') }}</h2>
      <h1 class="title">{{ $setting.get('portfolio.title') }}</h1>
    </div>
    <div class="portfolio-content">
      <portfolio-index />
      <!-- <div class="portfolio-gallery-container">
        <div v-for="(ele, i) in $setting.get('portfolio.pictures')" :key="i" class="item">
          <img :class="ele.pictureClass" :src="ele.picture" :alt="ele.alt" >
        </div>
      </div>-->

      <div class="clients-wrap">
        <h2 class="clients-title">{{ $setting.get('portfolio.clientsTitle') }}</h2>
        <div class="clients">
          <div v-for="(logo, i) in $setting.get('portfolio.clients')" :key="i" class="logo">
            <img :src="logo.picture" :alt="logo.alt" >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    "portfolio-index": () => import("./portfolio/portfolio-index")
  }
}
</script>

<style lang="less">
.portfolio-container {
  padding: 0;
  .header {
    background: var(--color-text-dark);
    padding: 4em 4em 8em;

    .pretitle {
      color: var(--color-text-gray);
      font-size: 1.4em;
      text-align: center;
      @media (max-width: 900px) {
        font-size: 1.2rem;
      }
    }
    .title {
      font-size: 3.2em;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-text);
      margin-bottom: 1rem;
      text-align: center;
      @media (max-width: 900px) {
        font-size: 2.2rem;
      }
    }
  }
  .portfolio-content {
    background: var(--color-text);
    padding: 0 4em 4em;
    margin-top: -2em;
  }

  .clients-wrap {
    text-align: center;
    margin-top: 4em;
    .clients-title {
      font-size: 2em;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-text-dark);
      margin-bottom: 2rem;
      text-align: center;
      @media (max-width: 900px) {
        font-size: 1.8rem;
      }
    }
    .clients {
      display: grid;
      grid-gap: 3em;
      grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr) minmax(
          100px,
          1fr
        );
      align-items: center;

      @media (max-width: 900px) {
        grid-template-columns: 1fr 1fr;
      }
      .logo img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
