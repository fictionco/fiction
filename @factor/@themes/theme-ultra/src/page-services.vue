<template>
  <div
    id="servicesContainerID"
    class="services-container"
    :class="[mobile ? 'services-container-mobile' : '', (mobile && orientationH) ? 'services-container-horizontal' : '']"
  >
    <div class="services-quote-container">
      <p
        class="services-quote"
        :class="[mobile ? 'services-quote-mobile' : '', (mobile && orientationH) ? 'services-quote-horizontal' : '']"
      >{{ $setting.get('services.quote') }}</p>
    </div>
    <div
      class="services-title-container"
      :class="[mobile ? 'services-title-container-mobile' : '', (mobile && orientationH) ? 'services-title-container-horizontal' : '']"
    >
      <h1
        class="services-title"
        :class="[mobile ? 'services-title-mobile' : '', (mobile && orientationH) ? 'services-title-horizontal' : '']"
      >{{ $setting.get('services.title') }}</h1>
    </div>
    <div
      class="services-content-container"
      :class="[mobile ? 'services-content-container-mobile' : '', (mobile && orientationH) ? 'services-content-container-horizontal' : '']"
    >
      <div
        v-for="(ele, i) in $setting.get('services.contentBlocks')"
        :key="i"
        class="services-content"
        :class="[ele.title, mobile ? 'services-content-mobile' : '', (mobile && orientationH) ? 'services-content-horizontal' : '']"
      >
        <img class="services-content-icon" :src="ele.icon" :alt="ele.alt" >
        <h4
          class="services-content-title"
          :class="[mobile ? 'services-content-title-mobile' : '', (mobile && orientationH) ? 'services-content-title-horizontal' : '']"
        >{{ ele.title }}</h4>
        <p
          class="services-content-text"
          :class="[mobile ? 'services-content-text-mobile' : '', (mobile && orientationH) ? 'services-content-text-horizontal' : '']"
        >{{ ele.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mobile", "orientationH"]
}
</script>

<style>
.services-container {
  background: #fa5855;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100vh;
}
.services-container-mobile {
  grid-template-rows: 60px 110px 60px;
}
.services-container-horizontal {
  grid-template-rows: 60px 60px 60px;
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
.services-quote-mobile {
  font-size: 18px;
  margin-bottom: 0;
}
.services-title-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.services-title-container-mobile {
  margin: 1.2vw 0 0 7.2vw;
}
.services-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.services-title-mobile {
  font-size: 18px;
  margin-top: 0;
}
.services-content-container {
  margin-left: 9.5vw;
  display: grid;
  grid-template-areas:
    "div div"
    "div div";
}
.services-content-container-mobile {
  margin-left: 32px;
}
.services-content-container-horizontal {
  margin-left: 80px;
}
.services-content {
  width: 25vw;
  padding: 1vw;
  margin-bottom: 1.2vw;
  background: #da524f;
  border-radius: 12px;
  color: #f7f7f7;
}
.services-content-mobile {
  width: 159px;
  height: 240px;
  padding: 5px;
}
.services-content-horizontal {
  width: 300px;
  height: 109px;
}
.Illustration {
  background: #f7f7f7;
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.4), 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: #111010;
}
.services-content-title-mobile {
  margin: 0;
  font-size: 13px;
}
.services-content-text-mobile {
  margin: 5px 0 0 0;
  font-size: 11px;
}
.services-content-text-horizontal {
  font-size: 9.5px;
}
.services-content-icon {
  width: 5.5vw;
  height: 5.5vh;
}
</style>
