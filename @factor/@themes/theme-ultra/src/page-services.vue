<template>
  <div id="servicesContainerID" class="services-container">
    <div class="services-quote-container">
      <p class="services-quote">{{ $setting.get('services.quote') }}</p>
    </div>
    <div class="services-title-container">
      <h1 class="services-title">{{ $setting.get('services.title') }}</h1>
    </div>
    <div class="services-content-container">
      <div
        v-for="(ele, i) in $setting.get('services.contentBlocks')"
        :key="i"
        :class="ele.title"
        class="services-content"
      >
        <img class="services-content-icon" :src="ele.icon" :alt="ele.alt" >
        <h4 class="services-content-title">{{ ele.title }}</h4>
        <p class="services-content-text">{{ ele.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.services-container {
  background: #fa5855;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.services-quote-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.services-quote {
  color: #f7ecea;
  font-size: 1.4vw;
  font-weight: bold;
}
.services-title-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.services-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.services-content-container {
  margin-left: 9.5vw;
  display: grid;
  grid-template-areas:
    "div div"
    "div div";
}
.services-content {
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
.services-content-icon {
  width: 5.5vw;
  height: 5.5vh;
}
</style>
