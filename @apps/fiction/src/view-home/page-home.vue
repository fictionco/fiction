<template>
  <div class="page-home">
    <section class="intro-wrap">
      <div class="mast">
        <div class="intro">
          <div class="content">
            <div class="super">The Factor Platorm &rarr; Coming Soon</div>
            <h2 class="title">Build the world's next amazing web app.</h2>

            <p class="subtitle">
              One platform with customizable features you need to start, build, manage,
              and grow your web app fast.
            </p>

            <div class="actions">
              <factor-email-list list-id="alphaProgram" />
            </div>
          </div>
          <div class="graphic">
            <img class="img-dashboard" :src="require(`./img/dashboard.jpg`)" alt="Factor Framework" >
            <img class="img-theme" :src="require(`./img/theme-alpha.jpg`)" alt="Factor Theme Alpha" >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
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
      title: "Build Better Javascript Applications",
      description:
        "Fiction builds Javascipt (Vue, Node) and serverless development tools for web developers.",
      image: require("./img/meta-image.jpg")
    }
  },
  routeClass() {
    return ["nav-white"]
  }
}
</script>
<style lang="less">
.page-home {
  --color-bg-splash: #1b223c;
  --color-bg-splash-contrast: #233575;
  --color-bg-contast: #f5f8fc;
  --color-text-splash: #949cb8;
  transform: skewY(-4deg);
  background-image: linear-gradient(
    35deg,
    var(--color-bg-splash) 70%,
    var(--color-bg-splash-contrast)
  );
  color: #fff;
  margin-top: -10em;
  .email-list-form {
    font-size: 1.3em;
    max-width: 600px;
    margin: 0 auto;
  }
  .mast {
    margin: 0 auto;
    max-width: var(--max-width);
    padding: 4em;
    @media (max-width: 767px) {
      padding: 2em 2em;
    }
  }
  .intro-wrap {
    padding: 15em 0 7em;

    transform: skewY(4deg);
    position: relative;
    background-image: url(./img/rectangles-blue.svg);
    background-repeat: no-repeat;
    background-size: 80%;
    @media (max-width: 900px) {
      background-size: 100%;
    }

    z-index: 0;

    @media (max-width: 767px) {
      padding: 14em 0 2em;
    }

    .intro {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 4fr 3fr;
      grid-gap: 4em;
      align-items: center;

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
      .content {
        color: #fff;
        .super {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 1.1em;
        }
        .title {
          margin: 0.3em 0;
          font-size: 4em;
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.1;
          @media (max-width: 767px) {
            font-size: 2.6em;
          }
        }
        .subtitle {
          margin: 0.3em 0 1em;
          opacity: 0.7;
          font-size: 1.4em;
          line-height: 1.6em;
          letter-spacing: -0.03em;
          @media (max-width: 767px) {
            font-size: 1.2em;
          }
        }
        .actions {
          margin-top: 3.5em;
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
        position: relative;
        perspective: 1500px;
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

  .home-features {
    padding: 7em;
    position: relative;
    z-index: 1;
    .heading {
      text-align: center;
      max-width: 650px;
      margin: 0 auto;
      letter-spacing: -0.03em;
      .title {
        font-weight: 600;
        font-size: 2em;
        line-height: 1.25em;
      }
      .subtitle {
        margin: 20px auto 14px;
        opacity: 0.7;
        font-size: 1.19em;
        line-height: 1.7em;
      }
    }
    .feature {
      display: grid;
      grid-gap: 2em;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      padding: 6em 0;
      &.feature-reverse {
        direction: rtl;
      }
      .super {
        text-transform: uppercase;
        color: var(--color-primary);
      }
      .illustration {
        perspective: 1500px;
        position: relative;
        img {
          max-width: 100%;
          &.img-left {
            border-radius: 8px;
            margin-right: 50px;
            transform: rotate3d(0.5, 0.866, 0, 15deg) rotate(-1deg);
            box-shadow: -27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
              -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
          }
          &.img-right {
            border-radius: 8px;
            margin-left: 50px;
            transform: rotate3d(0.5, -0.866, 0, 15deg) rotateZ(1deg);
            box-shadow: 27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
              16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
          }
        }
      }
      .content {
        font-size: 1.19em;
        line-height: 2em;
        font-weight: 400;
        padding: 3em;
        text-align: left;
        direction: initial;
        .title {
          font-size: 1.6em;
          font-weight: 600;
          margin: 0 0 10px;
          a {
            color: inherit;
          }
        }
        .actions {
          margin-top: 1em;
        }
      }
    }
  }
}
</style>
