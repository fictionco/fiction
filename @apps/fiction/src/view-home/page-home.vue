<template>
  <div class="page-home">
    <section class="intro-wrap">
      <div class="intro mast">
        <div class="content">
          <h2 class="title">Professional Web Apps for Publishing and eCommerce</h2>

          <p
            class="subtitle"
          >One platform with customizable features you need to start, run, manage, and grow your web app fast.</p>

          <a href="/vip#contact">
            <app-btn path="/vip#contact" btn="secondary" size="large">
              Start Your App
              <i class="fa fa-arrow-right" />
            </app-btn>
          </a>
        </div>
        <div class="graphic">
          <img class="img-dashboard" :src="require(`./img/dashboard.jpg`)" alt="Factor Framework" />
          <img class="img-theme" :src="require(`./img/theme-alpha.jpg`)" alt="Factor Theme Alpha" />
        </div>
      </div>
      <div class="hhh" />
    </section>

    <section class="promo-wrap mast">
      <div class="promo">
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
    </section>
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
      image: require("./img/meta-image.jpg")
    };
  },
  routeClass() {
    return ["nav-light"];
  }
};
</script>
<style lang="less">
.page-home {
  .mast {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2em;
  }
  .intro-wrap {
    position: relative;
    background: #1b223c url(./img/rectangles-pink.svg) no-repeat 50%;
    background-size: 80%;
    padding: 5em 2em 6em;

    @media (max-width: 767px) {
      padding: 4em 0 2em;
    }

    .intro {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 4fr 3fr;
      grid-gap: 2em;
      align-items: center;
      margin: 0 auto;

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .content {
        color: #fff;
        .title {
          margin: 0.3em 0;
          font-size: 4em;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .subtitle {
          margin: 0.3em 0 1em;
          opacity: 0.7;
          font-size: 1.5em;
          letter-spacing: -0.03em;
          line-height: 1.4;
        }
        @media (max-width: 960px) {
          padding: 0;
          .title {
            font-size: 3em;
          }
        }
        @media (max-width: 767px) {
          .btn-fiction + .btn-fiction {
            margin: 1em 0 0;
          }
        }
      }

      .graphic {
        position: relative;
        padding-top: 5em;
        @media (max-width: 960px) {
          padding-top: 0;
        }
        .img-dashboard {
          position: relative;
          z-index: 1;
          max-width: 110%;
          border-radius: 0.5em;
          box-shadow: 39px 62.5px 125px -25px rgba(77, 77, 109, 0.1),
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
          top: 0;
          right: -100px;
          opacity: 1;
          width: 400px;
          max-width: 100%;
          border-radius: 0.5em;
          transform: translate(0) rotate3d(-5.5, 4.866, -0.5, -10deg)
            rotate(-1deg);
          box-shadow: 39px 62.5px 125px -25px rgba(77, 77, 109, 0.1),
            23.4px 37.5px 75px -37.5px rgba(0, 0, 0, 0.4);
          @media (max-width: 960px) {
            display: none;
          }
        }
      }
    }

    .hhh {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -120px;
      top: 84%;
      transform: skewY(-4deg);
      background: #f5f8fc;
      transition: opacity 0.2s ease-out;
      will-change: transform;
    }
  }

  .promo-wrap {
    position: relative;
    z-index: 1;
    .promo {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2em;
      margin-top: 2em;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
      .item {
        box-shadow: var(--panel-shadow);
        color: inherit;
        font-size: 1.9em;
        line-height: 1.1em;
        padding: 1em;
        min-height: 200px;
        border-radius: 0.5rem;
        background: linear-gradient(#fff, #f7f7f7);
        background-size: cover;
        background-position: 50%;
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
          background-image: url(./img/code.jpg),
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
          text-shadow: 0 1px 0px rgba(255, 255, 255, 0.5);
          background-image: url(./img/blog.jpg);
          padding-top: 85px;
        }
        &:nth-child(3) {
          color: #fff;
          text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 1);
          text-align: center;
          background-image: url(./img/team.jpg);
          padding-top: 25px;
        }
      }
    }
  }
}
</style>