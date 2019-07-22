<template>
  <div id="homeContainerID" class="homeContainer">
    <div class="homeQuotesContainer">
      <h5 class="homeQuotes">{{ $setting.get('home.quotes') }}</h5>
    </div>
    <div class="homeMainQuotesContainer">
      <h1 class="homeMainQuotes">{{ $setting.get('home.mainQuotes') }}</h1>
    </div>
    <div class="homeButtonsContainer">
      <div v-for="(ele, i) in $setting.get('home.homeButtons')" :key="i" class="homeButtons">
        <button class="homeButton" :class="ele.class" @click="homePaths(ele.path)">{{ ele.text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {},
  data() {
    return {
      loading: true
    };
  },
  methods: {
    homePaths(path) {
      let ele = document.querySelector(path);
      ele.scrollIntoView();
    }
  }
};
</script>
<style scoped>
.homeContainer {
  background: linear-gradient(294.11deg, #732b29 0%, #111010 100%);
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.homeQuotesContainer {
  margin: 1.2vw 0 0 1.2vw;
}
.homeQuotes {
  color: #9e9e9e;
  font-size: 1.4vw;
}
.homeMainQuotesContainer {
  margin: 0.6vw 0 0 1.2vw;
  width: 60%;
}
.homeMainQuotes {
  font-size: 2.7vw;
  color: #f7f7f7;
}
.homeButtonsContainer {
  margin: 7vw 0 0 1.2px;
  display: flex;
  justify-content: center;
}
.homeButton {
  width: 20vw;
  height: 8vh;
  outline: none;
  margin: 1.2vw;
  font-size: 1.4vw;
  border-radius: 3px;
}
.homeButtonStart {
  background: #fa5855;
  border: none;
  color: #f7f7f7;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.homeButtonMore {
  background: transparent;
  border: 1px solid #fa5855;
  color: #fa5855;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
