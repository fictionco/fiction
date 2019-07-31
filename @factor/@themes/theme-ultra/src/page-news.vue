<template>
  <div id="newsContainerID" class="news-container">
    <div class="news-quote-container">
      <p class="news-quote">{{ $setting.get('news.quote') }}</p>
      <h1 class="news-title">{{ $setting.get('news.title') }}</h1>
    </div>
    <div class="news-content-container">
      <div
        v-for="(ele, i) in $setting.get('news.content')"
        :key="i"
        class="news-content"
        :class="ele.contentClass"
      >
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

<style>
.news-container {
  background: #f7ecea;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100%;
}
.news-quote-container {
  margin: 2vh 0 0 9.5vw;
}
.news-quote {
  color: #fa5855;
  font-size: 1.4vw;
  font-weight: bold;
}
.news-title {
  color: #111010;
  font-size: 2.2vw;
  font-weight: bold;
}
.news-content-container {
  margin: 18vh 0 0 9.5vw;
  display: grid;
  grid-template-areas:
    "div div"
    "div div";
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
.news-content-title {
  color: #111010;
  font-weight: bold;
  font-size: 1.1vw;
  margin: 1.1vh 0 0 0;
}
.news-content-text {
  color: rgba(17, 16, 16, 0.5);
  font-size: 1vw;
  margin: 1.1vh 0 0 0;
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
.news-more-content.animated {
  transform: scale(1);
}
.news-content-title-more {
  text-align: center;
  font-size: 1.2vw;
}
.news-content-text-more {
  font-size: 1.1vw;
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
</style>
