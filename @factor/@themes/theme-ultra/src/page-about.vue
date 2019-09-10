<template>
  <div
    id="aboutContainerID"
    class="about-container page-container"
    :class="[mobile ? 'about-container-mobile' : '', (mobile && orientationH) ? 'about-container-horizontal' : '']"
  >
    <div class="about-quote-container">
      <h4
        class="about-quote"
        :class="[mobile ? 'about-quote-mobile' : '', (mobile && orientationH) ? 'about-quote-horizontal' : '']"
      >{{ $setting.get('about.title') }}</h4>
      <h1
        class="about-title"
        :class="[mobile ? 'about-title-mobile' : '', (mobile && orientationH) ? 'about-title-horizontal' : '']"
      >{{ $setting.get('about.contentTitle') }}</h1>
    </div>
    <div
      class="about-content-container"
      :class="[mobile ? 'about-content-container-mobile' : '', (mobile && orientationH) ? 'about-content-container-horizontal' : '']"
    >
      <div class="about-content-text-container">
        <p
          class="about-content-text"
          :class="[mobile ? 'about-content-text-mobile' : '', (mobile && orientationH) ? 'about-content-text-horizontal' : '']"
        >{{ $setting.get('about.aboutContentText') }}</p>
      </div>
      <div class="about-content-picture-container">
        <img
          :src="$setting.get('about.picture')"
          alt
          class="about-content-picture"
          :class="[mobile ? 'about-content-picture-mobile' : '', (mobile && orientationH) ? 'about-content-picture-horizontal' : '']"
        >
      </div>
    </div>
    <div
      class="about-data-container"
      :class="[mobile ? 'about-data-container-mobile' : '', (mobile && orientationH) ? 'about-data-container-horizontal' : '']"
    >
      <div v-for="(ele, i) in $setting.get('about.aboutData')" :key="i" class="about-data">
        <div
          class="data-number"
          :class="[mobile ? 'data-number-mobile' : '', (mobile && orientationH) ? 'data-number-horizontal' : '']"
        >{{ ele.number }}</div>
        <div
          class="data-text"
          :class="[mobile ? 'data-text-mobile' : '', (mobile && orientationH) ? 'data-text-horizontal' : '']"
        >{{ ele.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mobile", "orientationH"]
}
</script>

<style lang="less">
.about-container {
  background: #f7ecea;
}
.about-container-mobile {
  padding-left: 34px;
  grid-template-rows: 60px 480px 60px;
}
.about-container-horizontal {
  grid-template-rows: 60px 100px 60px;
}
.about-quote-container {
  margin: 1.2vw 0 0 1.2vw;
}
.about-quote {
  color: #fa5855;
  font-size: 1.4vw;
}
.about-quote-mobile {
  font-size: 30px;
  margin: 30px 0 0 0;
}
.about-quote-horizontal {
  margin: 0;
}
.about-title {
  font-size: 2.7vw;
  color: #111010;
}
.about-title-mobile {
  font-size: 20px;
}
.about-content-container {
  display: flex;
}
.about-content-container-mobile {
  padding-top: 110px;
}
.about-content-container-horizontal {
  padding: 0;
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
.about-content-text-mobile {
  font-size: 12.5px;
  font-weight: 450;
}
.about-content-picture {
  width: 14vw;
  height: 21vh;
  margin: 6vw 0 0 9vw;
}
.about-content-picture-mobile {
  width: 38vw;
  height: 15vh;
}
.about-content-picture-horizontal {
  width: 30vw;
  height: 36vh;
}
.about-data-container {
  margin: 19vw 0 0 0;
  display: flex;
  justify-content: space-around;
  width: 65vw;
}
.about-data-container-mobile {
  width: 100%;
}
.data-number {
  font-size: 4vw;
  font-weight: bold;
  text-align: center;
}
.data-number-mobile {
  font-size: 24px;
}
.data-text {
  text-align: center;
  color: #fa5855;
}
.data-text-mobile {
  font-weight: 550;
  font-size: 10.5px;
}
</style>
