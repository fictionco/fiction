<template>
  <div id="newsContainerID" class="news-container page-container">
    <div class="news-quote-container">
      <p class="news-quote">{{ $setting.get('news.quote') }}</p>
      <h1 class="news-title">{{ $setting.get('news.title') }}</h1>
    </div>
    <div class="news-content-container">
      <div v-for="(ele, i) in $setting.get('news.content')" :key="i" class="news-content">
        <p class="news-date">{{ ele.date }}</p>
        <h4 class="news-content-title">{{ ele.title }}</h4>
        <p class="news-content-text">{{ ele.text }}</p>
        <button class="news-read-more" @click="handleReadMore(ele)">{{ ele.buttonText }}</button>
      </div>
    </div>
    <div v-show="showMoreContent">
      <div class="news-more-content">
        <p class="news-date-more">{{ moreContent.date }}</p>
        <h4 class="news-content-title-more">{{ moreContent.title }}</h4>
        <p class="news-content-text-more">{{ moreContent.fullContent }}</p>
        <button
          class="news-close-read-more"
          @click="handleCloseReadMore(moreContent.contentClass)"
        >{{ moreContent.closeButtonText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mobile", "orientationH"],
  data() {
    return {
      showMoreContent: false,
      newsContainer: null,
      newsMoreContent: null,
      moreContent: {}
    }
  },
  mounted() {
    this.newsContainer = document.querySelector(".news-container")
    this.newsMoreContent = document.querySelector(".news-more-content")
  },
  methods: {
    handleReadMore(content) {
      this.moreContent = content
      this.showMoreContent = true
      this.newsContainer.scrollIntoView()
      this.newsContainer.style.background = "#8a7272"
      this.newsMoreContent.classList.add("animated")
    },
    handleCloseReadMore() {
      this.showMoreContent = false
      this.moreContent = {}
      this.newsContainer.style.background = "#F7ECEA"
      this.newsMoreContent.classList.remove("animated")
    }
  }
}
</script>

<style lang="less">
.news-container {
  background: #f7ecea;
}
/* .news-quote-container {
  margin: 2vh 0 0 9.5vw;
} */
/* .news-quote-container-mobile {
  margin: 2vh 0 0 12vw;
}
.news-quote-container-horizontal {
  margin: 0 0 0 8vw;
} */
.news-quote {
  color: #fa5855;
  font-size: 1.4vw;
  font-weight: bold;
}
.news-quote-mobile {
  font-size: 28px;
  margin: 10px 0 0 0;
}
.news-title {
  color: #111010;
  font-size: 2.2vw;
  font-weight: bold;
}
.news-title-mobile {
  font-size: 22px;
  font-weight: 600;
  margin: 10px 0 0 0;
}
.news-title-horizontal {
  margin: 0;
}
.news-content-container {
  /* margin: 18vh 0 0 9.5vw; */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
}
.news-content-container-mobile {
  /* margin: 10vh 0 0 8vw; */
  width: 90vw;
  height: 65vh;
  justify-self: center;
}
.news-content-container-horizontal {
  width: 90vw;
  /* margin: 4vh 0 0 4vw; */
  grid-template-areas:
    "div div div"
    "div div div";
}
.news-content {
  width: 25vw;
  padding: 1vw;
  margin-bottom: 1.2vw;
  border: 1px solid rgba(17, 16, 16, 0.1);
  background: transparent;
  border-radius: 12px;
  color: #f7f7f7;
}
.news-content-mobile {
  width: 90%;
  justify-self: center;
  margin-bottom: 3vw;
}
.firstNews {
  background: #f7f7f7;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15), 0px 5px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
.news-date {
  color: #111010;
  font-size: 1vw;
  margin: 1.1vh 0 0 0;
}
.news-date-mobile {
  font-size: 10px;
}
.news-content-title {
  color: #111010;
  font-weight: bold;
  font-size: 1.1vw;
  margin: 1.1vh 0 0 0;
}
.news-content-title-mobile {
  font-size: 9px;
}
.news-content-text {
  color: rgba(17, 16, 16, 0.5);
  font-size: 1vw;
  margin: 1.1vh 0 0 0;
}
.news-content-text-mobile {
  font-size: 8px;
}
.newsMoreContentIntoView {
  width: 0;
  height: 0;
}
.news-read-more {
  margin: 1.2vh 0 0 0;
  padding: 0;
  color: #fa5855;
  border: none;
  outline: none;
  font-size: 1.1vw;
  background-color: transparent;
}
.news-read-more-mobile {
  font-size: 8.5px;
  font-weight: 700;
}
.news-more-content {
  transform: scale(0);
  transition: all 0.5s;
  width: 70vw;
  height: 84vh;
  padding: 1vw;
  margin: auto;
  margin-top: -22.5vh;
  border: 1px solid rgba(17, 16, 16, 0.1);
  border-radius: 12px;
  background: #f7f7f7;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15), 0px 5px 8px rgba(0, 0, 0, 0.1);
}
.news-more-content-mobile {
  width: 85vw;
  height: 85vh;
  margin: -18vh auto auto 38px;
  border-radius: 8px;
}
.news-more-content-horizontal {
  width: 92vw;
  height: 93vh;
  /* margin: -58vh auto auto 38px; */
}
.news-more-content.animated {
  transform: scale(1);
}
.news-content-title-more {
  text-align: center;
  font-size: 1.2vw;
}
.news-content-title-more-mobile {
  font-size: 15px;
  font-weight: 600;
}
.news-content-title-more-horizontal {
  margin: 0;
}
.news-content-text-more {
  font-size: 1.1vw;
}
.news-content-text-more-mobile {
  font-size: 10px;
}
.news-close-read-more {
  width: 10vw;
  height: 6.5vh;
  outline: none;
  margin: 0 0 0 30vw;
  font-size: 1.1vw;
  border-radius: 12px;
  background: #fa5855;
  color: #f7f7f7;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}
.news-close-read-more-mobile {
  width: 90px;
  height: 50px;
  font-size: 15px;
  margin: 0 0 0 108px;
}
.news-close-read-more-horizontal {
  width: 120px;
  height: 40px;
  font-size: 14px;
  /* margin: 5px 0 0 300px; */
}
</style>
