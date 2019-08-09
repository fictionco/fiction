<template>
  <div class="page-home">
    <div class="hero primary-content">
      <div class="hero-pad">
        <div class="intro">
          <div class="content">
            <h2 class="title">Build your web app</h2>
            <p
              class="sub-title"
            >One platform with customizable features you need to start, run, manage, and grow your web app fast.</p>

            <app-link path="/vip" btn="primary" size="large">
              Learn More
              <factor-icon icon="arrow-right" />
            </app-link>
            <!-- &nbsp;<app-link path="https://github.com/fiction-com/factor" btn="default" size="large">
              <factor-icon icon="github" />
            </app-link>-->
          </div>
          <div class="graphic">
            <img class="img-dashboard" :src="require(`./dashboard.jpg`)" alt="Factor Framework" />
            <img class="img-theme" :src="require(`./theme-alpha.jpg`)" alt="Factor Theme Alpha" />
          </div>
        </div>

        <!-- <div class="features">
          <div>
            <h6>
              <strong>5-Minutes</strong> From Start to App
            </h6>
          </div>
          <div>
            <h6>
              <strong>MEVN Stack</strong>
              Mongo, Express, Vue, Node
            </h6>
          </div>
          <div>
            <h6>
              <strong>Post System</strong>
              CMS and Dashboard
            </h6>
          </div>
          <div>
            <h6>
              <strong>Themes + Plugins</strong> Rapid Development
            </h6>
          </div>
        </div>-->
      </div>
    </div>

    <div class="promo primary-content">
      <factor-link path="https://factor.dev" class="item">
        <h3>
          Get Started
          <br />with
          <strong>Factor</strong>
        </h3>
        <pre><code class="hljs language-bash">$ yarn factor dev</code></pre>
      </factor-link>

      <factor-link path="/blog" class="item">
        <h3>
          <strong>Essays</strong> by Fiction
        </h3>
        <p>Essays on web development, remote-life and web business.</p>
      </factor-link>

      <factor-link path="/careers" class="item">
        <h3>
          Work With
          <strong>Fiction</strong>
        </h3>
        <p>Join a talented team working on big ideas.</p>
      </factor-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    this.$user.init(() => {
      this.loading = false;
    });
  },
  metatags() {
    return {
      title: "Build Better Javascript Applications",
      description:
        "Fiction builds Javascipt (Vue, Node) and serverless development tools for web developers.",
      image: require("./meta-image.jpg")
    };
  }
};
</script>
<style lang="less">
.page-home {
  .primary-content {
    max-width: 1200px;
    padding: 0 2em;
    margin: 2em auto;
  }
  .hero {
    .hero-pad {
      // box-shadow: var(--panel-shadow);
      // background: #fff;
      //border-radius: 0.5em;
      padding: 2em 0;
      @media (max-width: 767px) {
        background: transparent;
        box-shadow: none;
        padding: 2em 0 0;
      }
    }
  }
  .intro {
    display: grid;
    grid-template-columns: 3fr 4fr;
    grid-gap: 2em;
    align-items: center;
    text-align: left;
    padding-bottom: 4em;
    margin: 0 auto;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      padding: 0 0 4em;
      text-align: center;
    }
    .content {
      .title,
      .sub-title {
        letter-spacing: -0.03em;
      }
      .title {
        font-size: 4em;
        font-weight: 800;
        line-height: 1.1;
        margin: 0.3em 0;
      }
      .sub-title {
        line-height: 1.4;
        font-size: 1.5em;

        line-height: 1.4;
        letter-spacing: -0.03em;
        margin: 0.3em 0 1em;
        opacity: 0.7;
      }
      @media (max-width: 960px) {
        padding: 0;
      }
      @media (max-width: 767px) {
        .btn-fiction + .btn-fiction {
          margin: 1em 0 0;
        }
      }
    }

    .graphic {
      text-align: center;
      position: relative;
      .img-dashboard {
        position: relative;
        z-index: 1;
        max-width: 110%;
        /* width: 520px; */
        border-radius: 0.5em;

        box-shadow: 0px 0px 0px 1px rgba(184, 184, 218, 0.3),
          39px 62.5px 125px -25px rgba(77, 77, 109, 0.1),
          23.4px 37.5px 75px -37.5px rgba(0, 0, 0, 0.4);
        transform: translateX(0px) translateY(0) perspective(1190px)
          rotateY(-7deg) rotateX(2deg) rotate(0.7deg);
        @media (max-width: 767px) {
          max-width: 100%;
          transform: translateX(0) translateY(0) perspective(0) rotateY(0)
            rotateX(0) rotate(0);
          box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
            0 18px 36px -18px rgba(0, 0, 0, 0.3),
            0 -12px 36px -8px rgba(0, 0, 0, 0.025);
        }
      }
      .img-theme {
        z-index: 0;
        position: absolute;
        top: -40px;
        right: -100px;
        opacity: 0.8;
        width: 400px;
        max-width: 100%;
        border-radius: 0.5em;
        //transform: translate(0) rotate3d(0.5, 0.866, 0, 16deg) rotate(-2deg)
        // perspective(300px);
        transform: translate(0) rotate3d(-5.5, 4.866, -0.5, -10deg)
          rotate(-1deg);
        box-shadow: 0 0 0 1px rgba(184, 184, 218, 0.3),
          39px 62.5px 125px -25px rgba(77, 77, 109, 0.1),
          23.4px 37.5px 75px -37.5px rgba(0, 0, 0, 0.4);
        @media (max-width: 960px) {
          display: none;
        }
      }
    }
  }
  .features {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1em 2em 1em;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    text-align: center;
    font-size: 1em;
    line-height: 1.4;
    strong {
      display: block;
    }
    > div {
      border-right: 1px solid #edf0f5;
      h6 {
        font-size: 1.1em;
      }
      &:last-child {
        border-right: none;
      }
    }
    @media (max-width: 960px) {
      grid-template-columns: repeat(2, 1fr);
      > div {
        &:after {
          display: block;
          content: "";
          height: 1px;
          width: 40px;
          background: #edf0f5;
          margin: 1em auto 0;
        }
        &:nth-child(2),
        &:last-child {
          border-right: none;
        }
      }
    }
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      padding: 0 1em 1em;
      > div {
        border-right: none;
      }
    }
  }
  .promo {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2em;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2em;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      padding: 0 1em;
    }
    > .item {
      box-shadow: var(--panel-shadow);
      color: inherit;
      font-size: 1.9em;
      line-height: 1.1em;
      padding: 1.5em;
      min-height: 200px;
      border-radius: 0.5rem;
      background: linear-gradient(#fff, #f7f7f7);
      background-size: cover;
      background-position: 50%;
      text-shadow: 0 1px 0px rgba(255, 255, 255, 0.5);
      p {
        font-size: 0.7em;
        line-height: 1.3;
        margin-top: 5px;
        opacity: 0.9;
      }
      &:nth-child(1) {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        justify-content: center;
        text-align: right;
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.5);
        background-image: url(./code.jpg),
          linear-gradient(-126.24deg, #506677 4.42%, #2b3034 70.27%);

        h3 {
          margin-bottom: 10px;
        }
        pre code {
          font-size: 0.7em;
          padding: 8px 16px;

          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          box-shadow: 0px 0px 5px rgba(4, 149, 254, 0.25);
          color: #fff;
        }
      }
      &:nth-child(2) {
        text-align: center;
        background-image: url(./blog.jpg);

        padding-top: 85px;
      }
      &:nth-child(3) {
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 1);
        text-align: center;
        background-image: url(./team.jpg);
        padding-top: 25px;
      }
    }
  }
}
</style>