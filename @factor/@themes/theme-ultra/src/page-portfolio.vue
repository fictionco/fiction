<template>
  <div id="portfolioContainerID" class="portfolioContainer">
    <div class="portfolioHeaderContainer">
      <h4 class="portfolioQuote">{{ $setting.get('portfolio.quote')}}</h4>
      <h1 class="portfolioTitle">{{ $setting.get('portfolio.title')}}</h1>
    </div>
    <div class="portfolioGalleryContainer">
      <div
        class="portfolioPictureContainer"
        v-for="(ele, i) in $setting.get('portfolio.pictures')"
        :key="i"
      >
        <img :class="ele.pictureClass" :src="ele.picture" :alt="ele.alt" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.portfolioContainer {
  background: #111010;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.portfolioHeaderContainer {
  text-align: center;
  margin-top: 2vh;
}
.portfolioQuote {
  color: #9e9e9e;
  font-size: 1.4vw;
}
.portfolioTitle {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.portfolioGalleryContainer {
  margin: 15vh 0 0 26vw;
  width: 20vw;
  display: grid;
  grid-template-areas:
    "div div"
    "div div"
    "div div";
  justify-items: center;
}
.portfolioPictureContainer {
  width: 15vw;
  height: 32vh;
}
.pictureClasslong {
  width: 100%;
  height: 100%;
}
</style>
