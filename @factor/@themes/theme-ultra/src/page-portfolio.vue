<template>
  <section id="portfolioContainerID" class="portfolio-container page-container">
    <div class="portfolio-top">
      <h2 class="pretitle">{{ $setting.get('portfolio.pretitle') }}</h2>
      <h1 class="title">{{ $setting.get('portfolio.title') }}</h1>
    </div>
    <div class="portfolio-bottom">
      <div class="portfolio-gallery-container">
        <div v-for="(ele, i) in $setting.get('portfolio.pictures')" :key="i" class="item">
          <img :class="ele.pictureClass" :src="ele.picture" :alt="ele.alt" >
        </div>
      </div>

      <div class="clients-wrap">
        <h2 class="clients-title">{{ $setting.get('portfolio.clientsTitle') }}</h2>
        <div class="clients">
          <div
            v-for="(client, i) in $setting.get('portfolio.clients')"
            :key="i"
            class="client-item"
          >
            <img :src="client.picture" :alt="client.alt" >
          </div>
        </div>
      </div>
      <!-- <div class="portfolio-previous-content-container">
      <h1 class="portfolio-previous-title">{{ $setting.get('portfolio.clientsTitle') }}</h1>
      <div class="portfolio-clients-container">
        <div
          v-for="(ele, i) in $setting.get('portfolio.clients')"
          :key="i"
          class="portfolio-clients"
        >
          <img class="portfolio-clients-picture" :src="ele.picture" :alt="ele.alt" >
        </div>
      </div>
      </div>-->
    </div>
  </section>
</template>

<script>
export default {}
</script>

<style lang="less">
.portfolio-container {
  padding: 0;
  .portfolio-top {
    background: var(--color-text-dark);
    padding: 4em 4em 8em;
  }
  .portfolio-bottom {
    background: var(--color-text);
    padding: 0 4em 4em;
    margin-top: -2em;
  }

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

  .portfolio-gallery-container {
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    max-width: 800px;
    margin-top: -4em;

    .item {
      width: 50%;
      /* Optional */
      //position: relative;
      padding: 5px;
      box-sizing: border-box;
      flex-grow: 1;

      img {
        width: 100%;
        height: auto;
      }
    }
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
      .client-item img {
        width: 100%;
        height: auto;
      }
    }
  }
}

.portfolio-previous-content-container {
  text-align: center;
}
// .portfolio-previous-title {
//   color: #f7f7f7;
//   font-size: 2.2vw;
//   font-weight: bold;
// }
.portfolio-clients-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
}
.portfolio-clients {
  width: 10vw;
  height: 9vh;
  margin: 0.3vw;
}
.portfolio-clients-picture {
  width: 100%;
  height: 100%;
}
</style>
