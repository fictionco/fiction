<template>
  <div class="view-network">
    <div class="intro">
      <h1 class="title">Traveling Solo?</h1>
      <div
        class="sub-title"
      >Stay connected with like-minded professionals, entrepreneurs, and creators. Swap homes and live in places you never thought possible.</div>
      <app-btn v-if="!$userId" :loading="loading" action="signinModal" btn="primary" size="large">
        Become a Member
        <factor-icon icon="arrow-right" />
      </app-btn>
    </div>
    <div class="members-wrap">
      <ul class="members">
        <member-avatar v-for="(num, index) in 16" :key="index" :item="num" />
      </ul>
    </div>
    <div class="benefits-wrap">
      <h2>
        <span class="light">Why do you need a travel network?</span>
        Here's a few reasons:
      </h2>
      <ul class="arrows-list">
        <li>
          <factor-icon icon="arrow-circle-right" />
          <span>
            <strong>Safety</strong> &mdash; When you're traveling, having local connections you know you can trust is important.
          </span>
        </li>
        <li>
          <factor-icon icon="arrow-circle-right " />
          <span>
            <strong>Fun</strong> &mdash; Fiction members are exactly the type of people you want hang out with (if you love travel).
          </span>
        </li>
        <li>
          <factor-icon icon="arrow-circle-right" />
          <span>
            <strong>Insight</strong> &mdash; Use your network to help you find the best hotels, clubs, restaurants, etc...
          </span>
        </li>
        <li>
          <factor-icon icon="arrow-circle-right" />
          <span>
            <strong>Work + Homes</strong> &mdash; Use your network to help you find remote work or deals on great homes.
          </span>
        </li>
      </ul>
    </div>
    <div class="testimonial-wrap">
      <div class="testimonial">
        <figure>
          <span />
        </figure>
        <blockquote>
          <p>As a woman, it's important to stay safe and around people I'm familiar with as I travel. Fiction helps me stay in touch with a network that I know I can trust.</p>
          <footer>
            <cite>Karen Schimmel</cite>
            San Francisco, CA
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="bottom-cta">
      <app-btn v-if="!$userId" :loading="loading" action="signinModal" btn="primary" size="large">
        Apply to Join
        <factor-icon icon="arrow-right" />
      </app-btn>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "member-avatar": () => import("./el/member-avatar")
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
      title: "Your Travel Network",
      description: "Stay connected with people you meet around the world.",
      image: require("./img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.view-network {
  .intro {
    max-width: 960px;
    margin: 0 auto;
    text-align: left;
    padding: 5em 0;
    line-height: 1.4;
    letter-spacing: -0.03em;
    @media (max-width: 767px) {
      padding: 3em 2em;
    }
    .title {
      font-size: 3em;
      line-height: 1.2em;
      @media (max-width: 767px) {
        font-size: 2.5em;
      }
    }
    .sub-title {
      font-size: 1.3em;
      font-weight: 500;
      opacity: 0.6;
      margin-bottom: 1em;
      max-width: 630px;
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }

  .members-wrap {
    max-width: 1300px;
    margin: 0 auto;
    padding: 2em 0;
    overflow: hidden;
    position: relative;
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      z-index: 1;
      height: 150px;
      width: 300px;
      @media (max-width: 767px) {
        width: 100px;
      }
    }
    &:before {
      left: 0;
      background-image: linear-gradient(
        to left,
        rgba(255, 255, 255, 0) 0%,
        #fff 100%
      );
    }
    &:after {
      right: 0;
      background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        #fff 100%
      );
    }
    .members {
      display: flex;
      justify-content: center;
      list-style: none;
      padding: 0;
      overflow: hidden;
      max-height: 85px;
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
  .benefits-wrap {
    max-width: 960px;
    margin: 0 auto;
    padding: 4em 0;
    line-height: 1.4;
    @media (max-width: 767px) {
      padding: 3em 2em;
    }
    h2 {
      font-size: 2em;
      line-height: 1.4;
      .light {
        display: block;
        font-weight: 400;
      }
    }
    ul.arrows-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 15px 30px;
      list-style: none;
      padding: 0;
      margin: 2em 0;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        margin: 2em 0 0;
      }
      li {
        display: flex;
        align-items: baseline;
        font-size: 1.2em;
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
  }
  .testimonial-wrap {
    max-width: 960px;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 0 2em;
    }
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
          background-image: url(./img/karen.jpg);
          background-size: cover;
          background-position: top center;
          height: 100%;
          right: 30px;
          top: 0;
          bottom: 0;
          left: -50px;
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
  }
  .bottom-cta {
    max-width: 650px;
    margin: 0 auto;
    text-align: center;
    padding: 4em 0;
    @media (max-width: 767px) {
      padding: 2em 0;
    }
  }
}
</style>