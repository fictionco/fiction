<template>
  <div id="servicesContainerID" class="servicesContainer">
    <div class="servicesQuoteContainer">
      <p class="servicesQuote">{{ $setting.get('services.quote') }}</p>
    </div>
    <div class="servicesTitleContainer">
      <h1 class="servicesTitle">{{ $setting.get('services.title') }}</h1>
    </div>
    <div class="servicesContentContainer">
      <div
        class="servicesContent"
        v-for="(ele, i) in $setting.get('services.contentBlocks')"
        :key="i"
        :class="ele.title"
      >
        <img class="servicesContentIcon" :src="ele.icon" :alt="ele.alt" />
        <h4 class="servicesContentTitle">{{ ele.title }}</h4>
        <p class="servicesContentText">{{ ele.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.servicesContainer {
  background: #fa5855;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.servicesQuoteContainer {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.servicesQuote {
  color: #f7ecea;
  font-size: 1.4vw;
  font-weight: bold;
}
.servicesTitleContainer {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.servicesTitle {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.servicesContentContainer {
  margin-left: 9.5vw;
  display: grid;
  grid-template-areas:
    "div div"
    "div div";
}
.servicesContent {
  width: 25vw;
  padding: 1vw;
  margin-bottom: 1.2vw;
  background: #da524f;
  border-radius: 12px;
  color: #f7f7f7;
}
.Illustration {
  background: #f7f7f7;
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.4), 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: #111010;
}
.servicesContentIcon {
  width: 5.5vw;
  height: 5.5vh;
}
</style>
