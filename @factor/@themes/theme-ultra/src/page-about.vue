<template>
  <div id="aboutContainerID" class="about-container">
    <div class="about-quote-container">
      <h4 class="about-quote">{{ $setting.get('about.title') }}</h4>
      <h1 class="about-title">{{ $setting.get('about.contentTitle') }}</h1>
    </div>
    <div class="about-content-container">
      <div class="about-content-text-container">
        <p class="about-content-text">{{ $setting.get('about.aboutContentText') }}</p>
      </div>
      <div class="about-content-picture-container">
        <img :src="$setting.get('about.picture')" alt class="aboutContentPicture" >
      </div>
    </div>
    <div class="about-data-container">
      <div v-for="(ele, i) in $setting.get('about.aboutData')" :key="i" class="about-data">
        <div class="data-number">{{ ele.number }}</div>
        <div class="data-text">{{ ele.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.about-container {
  background: #f7ecea;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.about-quote-container {
  margin: 1.2vw 0 0 1.2vw;
}
.about-quote {
  color: #fa5855;
  font-size: 1.4vw;
}
.about-title {
  font-size: 2.7vw;
  color: #111010;
}
.about-content-container {
  display: flex;
}
.about-content-text-container {
  margin: 1.3vw 0 0 1.2vw;
  width: 40vw;
}
.about-content-text {
  color: rgba(17, 16, 16, 0.7);
  font-size: 1.4vw;
  margin: 5.5vw 0 0 0;
}
.aboutContentPicture {
  width: 14vw;
  height: 21vh;
  margin: 6vw 0 0 9vw;
}

.about-data-container {
  margin: 19vw 0 0 0;
  display: flex;
  justify-content: space-around;
  width: 65vw;
}
.data-number {
  font-size: 4vw;
  font-weight: bold;
  text-align: center;
}
.data-text {
  text-align: center;
  color: #fa5855;
}
</style>
