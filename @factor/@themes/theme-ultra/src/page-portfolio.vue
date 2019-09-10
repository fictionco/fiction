<template>
  <div
    id="portfolioContainerID"
    class="portfolio-container page-container"
    :class="[mobile ? 'portfolio-container-mobile' : '', (mobile && orientationH) ? 'portfolio-container-horizontal' : '']"
  >
    <div class="portfolio-header-container">
      <h4
        class="portfolio-quote"
        :class="[mobile ? 'portfolio-quote-mobile' : '', (mobile && orientationH) ? 'portfolio-quote-horizontal' : '']"
      >{{ $setting.get('portfolio.quote') }}</h4>
      <h1
        class="portfolio-title"
        :class="[mobile ? 'portfolio-title-mobile' : '', (mobile && orientationH) ? 'portfolio-title-horizontal' : '']"
      >{{ $setting.get('portfolio.title') }}</h1>
    </div>
    <div
      class="portfolio-gallery-container"
      :class="[mobile ? 'portfolio-gallery-container-mobile' : '', (mobile && orientationH) ? 'portfolio-gallery-container-horizontal' : '']"
    >
      <div
        v-for="(ele, i) in $setting.get('portfolio.pictures')"
        :key="i"
        class="item"
        :class="[mobile ? 'item-mobile' : '', (mobile && orientationH) ? 'item-horizontal' : '']"
      >
        <img :class="ele.pictureClass" :src="ele.picture" :alt="ele.alt" >
      </div>
    </div>
    <div
      class="portfolio-previous-content-container"
      :class="[mobile ? 'portfolio-previous-content-container-mobile' : '', (mobile && orientationH) ? 'portfolio-previous-content-container-horizontal' : '']"
    >
      <h1
        class="portfolio-previous-title"
        :class="[mobile ? 'portfolio-previous-title-mobile' : '', (mobile && orientationH) ? 'portfolio-previous-title-horizontal' : '']"
      >{{ $setting.get('portfolio.previousTitle') }}</h1>
      <div
        class="portfolio-clients-container"
        :class="[mobile ? 'portfolio-clients-container-mobile' : '', (mobile && orientationH) ? 'portfolio-clients-container-horizontal' : '']"
      >
        <div
          v-for="(ele, i) in $setting.get('portfolio.clients')"
          :key="i"
          class="portfolio-clients"
          :class="[mobile ? 'portfolio-clients-mobile' : '', (mobile && orientationH) ? 'portfolio-clients-horizontal' : '']"
        >
          <img class="portfolio-clients-picture" :src="ele.picture" :alt="ele.alt" >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mobile: { type: String, default: () => {} },
    orientationH: { type: Boolean, default: () => {} }
  }
}
</script>

<style lang="less" scope>
.portfolio-container {
  background: #111010;
}
.portfolio-container-mobile {
  grid-template-rows: 0.4fr 1.2fr 0.7fr;
  height: 100vh;
}
.portfolio-header-container {
  text-align: center;
}
.portfolio-quote {
  color: #9e9e9e;
  font-size: 1.4vw;
}
.portfolio-quote-mobile {
  font-size: 18px;
  margin: 0;
}
.portfolio-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.portfolio-title-mobile {
  font-size: 14px;
  margin: 10px 0 0 20px;
}
.portfolio-gallery-container {
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  max-width: 800px;

  .item {
    width: 50%;
    /* Optional */
    position: relative;
    padding: 5px;
    box-sizing: border-box;
    flex-grow: 1;

    img {
      width: 100%;
      height: auto;
    }
  }
}
// .portfolio-gallery-container-mobile {
//   margin: 0 0 0 50px;
// }
// .portfolio-gallery-container-horizontal {
//   margin: 10px 0 0 120px;
//   grid-template-areas:
//     "div div div"
//     "div div div";
// }
// .item {
//   width: 100%;
//   height: auto;
// }
// .item-mobile {
//   width: 150px;
//   height: 160px;
// }
// .item-horizontal {
//   width: 200px;
//   height: 110px;
// }

.portfolio-previous-content-container {
  text-align: center;
}
.portfolio-previous-content-container-mobile {
  margin: 0;
}
.portfolio-previous-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.portfolio-previous-title-mobile {
  font-size: 13px;
  font-weight: 500;
}
.portfolio-previous-title-horizontal {
  margin: 0;
}
.portfolio-clients-container {
  margin: 1vh 0 0 22vw;
  width: 20vw;
  display: grid;
  grid-template-areas:
    "div div div"
    "div div div";
  justify-items: center;
}
.portfolio-clients-container-mobile {
  margin: 0 0 0 90px;
  width: 200px;
}
.portfolio-clients-container-horizontal {
  margin: 5px 0 0 309px;
}
.portfolio-clients {
  width: 10vw;
  height: 9vh;
  margin: 0.3vw;
}
.portfolio-clients-mobile {
  width: 100%;
  height: 100%;
  margin: 3vw;
}
.portfolio-clients-horizontal {
  margin: 0;
}
.portfolio-clients-picture {
  width: 100%;
  height: 100%;
}
</style>
