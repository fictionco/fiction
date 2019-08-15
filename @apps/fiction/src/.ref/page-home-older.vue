<template>
  <div class="home-page">
    <section class="home-container">
      <div class="mast">
        <div class="home-intro">
          <h1 class="title">The Remote Work Platform</h1>
          <div
            class="subtitle"
          >Fiction is working on tools for location-independent workers to find remote work, find monthly housing and more</div>
          <div class="actions">
            <div class="join-up">
              <factor-link v-if="!$userId" btn="secondary" size="large" action="signinModal">
                Become a Member &mdash; $99
                <factor-icon icon="arrow-right" />
              </factor-link>
              <factor-link v-else path="/dashboard" btn="primary" size="large">
                Member Dashboard
                <factor-icon icon="arrow-right" />
              </factor-link>
            </div>
          </div>
        </div>
      </div>

      <div class="mast">
        <div class="boxes">
          <div class="box">
            <el-svg icon="wallet" />
            <h2 @click="test()">Host or Rent</h2>
            <p>Rent from other or host someone while you're away and fund your travel.</p>
          </div>
          <div class="box">
            <el-svg icon="home" />
            <h2>Find Remote Jobs</h2>
            <p>Make money on the road, Fiction only posts purely remote jobs.</p>
          </div>
          <div class="box">
            <el-svg icon="handheart" />
            <h2>Build Reputation</h2>
            <p>Build your reputation and use it to stay in more places or get better gigs.</p>
          </div>
          <!-- <div class="box">
            <el-svg icon="luggage" />
            <h2>Coworking / Coliving</h2>
            <p>Fiction partners with unique coworking and coliving locations globally.</p>
          </div>
          <div class="box">
            <el-svg icon="city-guides" />
            <h2>City Guides and Tips</h2>
            <p>Get the best tips and information about new cities as you travel.</p>
          </div>
          <div class="box">
            <el-svg icon="chat" />
            <h2>Community Chat</h2>
            <p>A place to chat and share with fellow Fiction members.</p>
          </div>-->
        </div>
      </div>

      <div class="mast">
        <div class="brands">
          <div class="brand">
            <img :src="require(`./img/icon/forbes.svg`)" alt="Forbes" >
          </div>
          <div class="brand">
            <img :src="require(`./img/icon/bloomberg.svg`)" alt="Bloomberg Business" >
          </div>
          <!-- <div class="brand">
            <img :src="require(`./img/icon/thenewyorktimes.svg`)" alt="The New York Times">
          </div>-->
          <div class="brand">
            <img :src="require(`./img/icon/fortune.svg`)" alt="Fortune" >
          </div>
          <div class="brand">
            <img :src="require(`./img/icon/wallstreetjournal.svg`)" alt="The Wallstreet Journal" >
          </div>
        </div>
      </div>
      <div class="mast">
        <div class="testimonial">
          <figure>
            <span />
          </figure>
          <blockquote>
            <p>
              The people at Fiction helped me get started on my location-independent journey.
              Now my life is full of adventure and I can't wait to see what Fiction releases next...
            </p>
            <footer>
              <cite>Marcus Williams</cite>
              New York, New York
            </footer>
          </blockquote>
        </div>
      </div>
      <div class="mast">
        <div class="members">
          <h2>Newest Members</h2>
          <ul class="newest-members">
            <member-avatar v-for="(num, index) in 8" :key="index" :item="num" />
          </ul>
          <ul class="newest-members row-2">
            <member-avatar v-for="(num, index) in 8" :key="index" :item="num + 8" />
          </ul>
        </div>
      </div>
      <el-cta />
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta.vue"),
    "el-svg": () => import("./el/el-svg.vue"),
    "member-avatar": () => import("./el/member-avatar.vue")
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
      title: "The Remote Work Platform",
      description:
        "Fiction helps people become remote workers, digital nomads and long term travelers. Find us in Miami, Salt Lake City, Los Angeles and New York.",
      image: require("./img/fiction.jpg")
    }
  },
  methods: {}
}
</script>
<style lang="less">
.home-container {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  //Home Intro
  .home-intro {
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: column;
    max-width: 650px;
    margin: 0 auto;
    padding: 7em 0;
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .title {
      font-weight: 600;
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 0.9;
      margin-bottom: 0.2em;
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .subtitle {
      opacity: 0.5;
      font-size: 1.5em;
      font-weight: 500;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
    .join-up {
      .fi-btn {
        font-size: 1em;
      }
    }
    .actions {
      margin-top: 1.5em;
    }
  } // end .home-intro
  // Home boxes
  .boxes {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 60px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    @media (max-width: 767px) {
      display: block;
    }
    .box {
      padding-bottom: 4em;
      @media (max-width: 767px) {
        padding-bottom: 2em;
      }
      .svg-wrap {
        display: inline-block;
        width: 40px;
        svg {
          min-height: 40px;
        }
      }
      h2 {
        margin: 0.5em 0;
        font-weight: 600;
      }
      p {
        font-weight: 500;
        margin-top: 0.5em;
        opacity: 0.6;
      }
    }
  }
  //Home brands
  .brands {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 80px;
    align-items: center;
    padding: 2em 0;
    width: 80%;
    margin: 0 auto;
    @media (max-width: 767px) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 20px;
      justify-content: center;
    }
    .brand {
      text-align: center;
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
      img {
        max-width: 100px;
        max-height: 40px;
        width: auto;
      }
    }
  }
  //Home testimonial
  .testimonial {
    position: relative;
    overflow: hidden;
    margin: 2em 0;
    border-radius: 4px;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
      0 18px 36px -18px rgba(0, 0, 0, 0.3);
    figure {
      height: 100%;
      position: absolute;
      overflow: hidden;
      z-index: 2;
      right: -30px;
      top: 0;
      left: calc(50% + 100px);
      -webkit-transform: skewX(12deg);
      transform: skewX(12deg);

      @media (max-width: 767px) {
        position: relative;
        height: 200px;
        background: #525f7f;
        overflow: hidden;
        right: 0;
        top: 0;
        left: 0;
        -webkit-transform: skewX(0);
        transform: skewX(0);
      }
      span {
        display: block;
        position: absolute;
        background-image: url(./img/marcus.jpg);
        background-size: cover;
        background-position: center center;
        height: 100%;
        right: 30px;
        top: 0;
        bottom: 0;
        left: -110px;
        -webkit-transform: skewX(-12deg);
        transform: skewX(-12deg);

        @media (max-width: 767px) {
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-position: 50%;
          background-size: cover;
          -webkit-transform: skewX(0);
          transform: skewX(0);
        }
      }
    }
    blockquote {
      width: 50%;
      background: #fff url(./img/icon/left-quote.svg) no-repeat 3em 1em;
      background-size: 25px 25px;
      padding: 3em;
      @media (max-width: 767px) {
        background-position: 2em 1em;
        width: 100%;
        padding: 3em 2em 2em;
      }
      p {
        opacity: 0.6;
        font-size: 1.2em;
        font-weight: normal;
      }
      cite {
        display: block;
        margin-top: 1em;
      }
    }
  }

  // Home members
  .members {
    padding: 3em 0;
    text-align: center;
    h2 {
      font-weight: 600;
      font-size: 2em;
      margin-bottom: 1em;
    }
    .newest-members {
      display: flex;
      justify-content: center;
      list-style: none;
      padding: 0;
      &.row-2 {
        margin-left: 80px;
      }
      @media (max-width: 767px) {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 0;
        &.row-2 {
          margin-left: 0;
        }
      }
      .member {
        display: inline-block;
        padding: 0 0.3em;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          box-shadow: 0 0 0 2px hsla(0, 0%, 100%, 0.9),
            0 0 0 1px rgba(0, 0, 0, 0.2), 0 3px 0.5em 0 rgba(24, 32, 41, 0.1),
            0 0.5em 1em 0 rgba(24, 32, 41, 0.1);
        }
      }
    }
  }
} // .home-container ends
</style>
