<template>
  <div class="view-how-it-works">
    <div class="top-content">
      <div class="intro">
        <h1 class="title">How Fiction Works</h1>
        <div
          class="sub-title"
        >Fiction is a one stop platform for nomads, remote-workers and travelers.</div>
      </div>
      <div class="items-wrap">
        <div class="item">
          <div>
            <span class="tag">Coming Soon</span>
            <h2 class="title">Remote Work</h2>
            <ul class="arrows-list">
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Find jobs that enable you to work from anywhere and travel.</span>
              </li>
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Post jobs and reach remote workers from different categories like marketing, development, design, customer support and more.</span>
              </li>
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Enjoy the benefits of a flexible lifestyle, better health, higher productivity and save money.</span>
              </li>
            </ul>
          </div>
          <div>
            <img :src="require(`./img/remote-work.png`)" alt="Remote Work" >
          </div>
        </div>
        <div class="item">
          <div>
            <span class="tag">Coming Soon</span>
            <h2 class="title">Home Exchange</h2>
            <ul class="arrows-list">
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Tell other network members about your home to attract some exchanges. Once your home is listed, you can start receiving requests securely on-site.</span>
              </li>
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Request a home from any city, tell us what you want and rent a home within your budget and timeline.</span>
              </li>
            </ul>
          </div>
          <div>
            <img :src="require(`./img/home-exchange.png`)" alt="Home Exchange" >
          </div>
        </div>
        <div class="item">
          <div>
            <span class="tag">Coming Soon</span>
            <h2 class="title">Travel Profile &amp; Network</h2>
            <ul class="arrows-list">
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Everyone on Fiction has a profile to help users get to know each other and build trust, safety, authenticity, and reliability.</span>
              </li>
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Network with like-minded professionals, entrepreneurs, and creators. Swap homes, live and work from anywhere.</span>
              </li>
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Access our chat with more than 1,000 nomads in cities everywhere.</span>
              </li>
            </ul>
          </div>
          <div>
            <img :src="require(`./img/profile-network.png`)" alt="Travel Profile and Network" >
          </div>
        </div>
        <div class="item">
          <div>
            <span class="tag">Coming Soon</span>
            <h2 class="title">City &amp; Travel Information</h2>
            <ul class="arrows-list">
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Fiction provides different data points of different cities to help you choose where to travel next.</span>
              </li>
              <li>
                <factor-icon icon="arrow-circle-right" />
                <span>Find destinations, places to work from, neighborhoods to stay and like-minded people nearby.</span>
              </li>
            </ul>
          </div>
          <div>
            <img :src="require(`./img/city-information.png`)" alt="City Information" >
          </div>
        </div>
      </div>
    </div>

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.$user.init(() => {
      this.loading = false
    })
  },
  metatags() {
    return {
      title: "How Fiction Works",
      description:
        "Fiction makes it easy to find and rent monthly to people you can trust.",
      image: require("./img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.view-how-it-works {
  .top-content {
    background: #fff;
    position: relative;
    z-index: 0;
    &:after {
      z-index: -1;
      content: "";
      background: #fff;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -60px;
      top: 95%;
      transform: skewY(-6deg);
    }
  }

  .intro {
    text-align: center;
    max-width: 470px;
    margin: 0 auto;
    padding: 5em 0 2em;
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-weight: 600;
      font-size: 3em;
      @media (max-width: 767px) {
        font-size: 2.5em;
      }
    }
    .sub-title {
      font-size: 1.7em;
      font-weight: 500;
      opacity: 0.6;
      margin-bottom: 1em;
      @media (max-width: 767px) {
        font-size: 1.2em;
        padding: 0 5%;
      }
    }
  }

  .items-wrap {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 2em;
    .item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 2em;
      align-items: center;
      padding: 3em 0;

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-gap: 0;
        padding: 2em 1em;
      }

      &:nth-child(2n + 2) {
        direction: rtl; //reverse even items order
        > div {
          direction: ltr;
        }
      }
      &:last-child {
        padding-bottom: 0;
      }

      .tag {
        display: inline-block;
        font-size: 0.8em;
        border-radius: 20px;
        border: 1px solid #0496ff;
        padding: 5px 10px;
        color: #0496ff;
        margin-bottom: 0.5em;
      }

      h2 {
        font-size: 2.4em;
        line-height: 1;
        margin: 1.5rem 0;
        font-weight: 600;
      }

      ul.arrows-list {
        list-style: none;
        padding: 0;
        margin: 0.5em 0 1em 0;
        font-size: 1.2em;
        line-height: 1.4em;
        @media (max-width: 767px) {
          margin: 1em 0 0;
        }
        li {
          display: flex;
          align-items: baseline;
          margin: 0 0 1em;
          i {
            font-size: 22px;
            color: #0496ff;
          }
          span {
            opacity: 0.6;
            padding-left: 10px;
          }
        }
      }

      img {
        max-width: 100%;
      }
    }
  }

  .bottom-cta {
    position: relative;
    padding: 10em 0 2em;
    text-align: center;

    h2 {
      font-size: 2.4em;
      line-height: 1.4;
      margin-bottom: 0.5em;
    }
  }
}
</style>