<template>
  <div id="aboutContainerID" class="aboutContainer">
    <div class="aboutQuoteContainer">
      <h4 class="aboutQuote">{{ $setting.get('about.title') }}</h4>
      <h1 class="aboutTitle">{{ $setting.get('about.contentTitle') }}</h1>
    </div>
    <div class="aboutContentContainer">
      <div class="aboutContentTextContainer">
        <p class="aboutContentText">{{ $setting.get('about.aboutContentText') }}</p>
      </div>
      <div class="aboutContentPictureContainer">
        <img :src="$setting.get('about.picture')" alt class="aboutContentPicture" />
      </div>
    </div>
    <div class="aboutDataContainer">
      <div v-for="(ele, i) in $setting.get('about.aboutData')" :key="i" class="aboutData">
        <div class="dataNumber">{{ ele.number }}</div>
        <div class="dataText">{{ ele.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.aboutContainer {
  background: #f7ecea;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.aboutQuoteContainer {
  margin: 1.2vw 0 0 1.2vw;
}
.aboutQuote {
  color: #fa5855;
  font-size: 1.4vw;
}
.aboutTitle {
  font-size: 2.7vw;
  color: #111010;
}
.aboutContentContainer {
  display: flex;
}
.aboutContentTextContainer {
  margin: 1.3vw 0 0 1.2vw;
  width: 40vw;
}
.aboutContentText {
  color: rgba(17, 16, 16, 0.7);
  font-size: 1.4vw;
  margin: 5.5vw 0 0 0;
}
.aboutContentPicture {
  width: 14vw;
  height: 21vh;
  margin: 6vw 0 0 9vw;
}

.aboutDataContainer {
  margin: 19vw 0 0 0;
  display: flex;
  justify-content: space-around;
  width: 65vw;
}
.dataNumber {
  font-size: 4vw;
  font-weight: bold;
  text-align: center;
}
.dataText {
  text-align: center;
  color: #fa5855;
}
</style>
