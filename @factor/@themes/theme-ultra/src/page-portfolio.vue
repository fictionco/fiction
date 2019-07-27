<template>
  <div id="portfolioContainerID" class="portfolio-container">
    <div class="portfolio-header-container">
      <h4 class="portfolio-quote">{{ $setting.get('portfolio.quote') }}</h4>
      <h1 class="portfolio-title">{{ $setting.get('portfolio.title') }}</h1>
    </div>
    <div class="portfolio-gallery-container">
      <div
        v-for="(ele, i) in $setting.get('portfolio.pictures')"
        :key="i"
        class="portfolio-picture-container"
      >
        <img :class="ele.pictureClass" :src="ele.picture" :alt="ele.alt" >
      </div>
    </div>
    <div class="portfolio-previous-content-container">
      <h1 class="portfolio-previous-title">{{ $setting.get('portfolio.previousTitle') }}</h1>
      <div class="portfolio-clients-container">
        <div
          v-for="(ele, i) in $setting.get('portfolio.clients')"
          :key="i"
          class="portfolio-clients"
        >
          <img class="portfolio-clients-picture" :src="ele.picture" :alt="ele.alt" >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.portfolio-container {
  background: #111010;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.portfolio-header-container {
  text-align: center;
  margin-top: 2vh;
}
.portfolio-quote {
  color: #9e9e9e;
  font-size: 1.4vw;
}
.portfolio-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.portfolio-gallery-container {
  margin: 15vh 0 0 26vw;
  width: 20vw;
  display: grid;
  grid-template-areas:
    "div div"
    "div div"
    "div div";
  justify-items: center;
}
.portfolio-picture-container {
  width: 15vw;
  height: 32vh;
}
.pictureClasslong {
  width: 100%;
  height: 100%;
}
.portfolio-previous-content-container {
  margin: 96vh 0 0 3.5vw;
  text-align: center;
}
.portfolio-previous-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.portfolio-clients-container {
  margin: 1vh 0 0 22vw;
  width: 20vw;
  display: grid;
  grid-template-areas:
    "div div div"
    "div div div";
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
