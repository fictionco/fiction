<template>
  <div id="homeContainerID" :class="!mobile ? 'home-container' : 'home-container-mobile'">
    <div class="home-quotes-container">
      <h5 :class="!mobile ? 'home-quotes' : 'home-quotes-mobile'">{{ $setting.get('home.quotes') }}</h5>
    </div>
    <div class="home-main-quotes-container">
      <h1
        :class="!mobile ? 'home-main-quotes' : 'home-main-quotes-mobile'"
      >{{ $setting.get('home.mainQuotes') }}</h1>
    </div>
    <div class="home-buttons-container">
      <div v-for="(ele, i) in $setting.get('home.homeButtons')" :key="i" class="home-buttons">
        <button
          :class="[!mobile ? 'home-button' : 'home-button-mobile', ele.class]"
          @click="homePaths(ele.path)"
        >{{ ele.text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["mobile"],
  data() {
    return {
      loading: true
    }
  },
  methods: {
    homePaths(path) {
      let ele = document.querySelector(path)
      ele.scrollIntoView()
    }
  }
}
</script>
<style scoped>
.home-container {
  background: linear-gradient(294.11deg, #732b29 0%, #111010 100%);
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.home-container-mobile {
  background: linear-gradient(294.11deg, #732b29 0%, #111010 100%);
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 500px 60px;
  height: 100%;
  padding-left: 34px;
}
.home-quotes-container {
  margin: 1.2vw 0 0 1.2vw;
}
.home-quotes {
  color: #9e9e9e;
  font-size: 1.4vw;
}
.home-quotes-mobile {
  color: #9e9e9e;
  font-size: 6vw;
}
.home-main-quotes-container {
  margin: 0.6vw 0 0 1.2vw;
  width: 60%;
}
.home-main-quotes {
  font-size: 3em;
  color: #f7f7f7;
}
.home-main-quotes-mobile {
  font-size: 2.3em;
  color: #f7f7f7;
  width: 280px;
}
.home-buttons-container {
  margin: 7vw 0 0 1.2px;
  display: flex;
  justify-content: center;
}
.home-button {
  width: 20vw;
  height: 8vh;
  outline: none;
  margin: 1.2vw;
  font-size: 1.4vw;
  border-radius: 3px;
}
.home-button-mobile {
  height: 8vh;
  outline: none;
  width: 130px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 3px;
  margin: 1.2vw;
}
.home-button-start {
  background: #fa5855;
  border: none;
  color: #f7f7f7;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.home-button-more {
  background: transparent;
  border: 1px solid #fa5855;
  color: #fa5855;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
