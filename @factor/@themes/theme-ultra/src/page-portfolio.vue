<template>
  <section id="portfolioContainerID" class="portfolio-container page-container">
    <div class="portfolio-header-container">
      <h2 class="pretitle">{{ $setting.get('portfolio.pretitle') }}</h2>
      <h1 class="title">{{ $setting.get('portfolio.title') }}</h1>
    </div>
    <!-- <div class="portfolio-gallery-container">
      <div v-for="(ele, i) in $setting.get('portfolio.pictures')" :key="i" class="item">
        <img :class="ele.pictureClass" :src="ele.picture" :alt="ele.alt" >
      </div>
    </div>-->
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
  </section>
</template>

<script>
export default {}
</script>

<style lang="less">
.portfolio-container {
  background: #111010;

  .pretitle {
    color: var(--color-text-gray);
    font-size: 1.4em;
    text-align: center;
  }
  .title {
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--color-text);
    margin-bottom: 1rem;
    text-align: center;
  }
}

.portfolio-gallery-container {
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  max-width: 800px;

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

.portfolio-previous-content-container {
  text-align: center;
}
.portfolio-previous-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
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
