<template>
  <div class="view-home">
    <section class="header">
      <div class="headline">
        <div class="mast">
          <h1 class="page-title">An Engine for Javascript Apps</h1>
          <h3
            class="page-title-sub"
          >A platform for universal VueJS Apps designed for front-end developers.</h3>
        </div>

        <div class="actions">
          <app-link
            v-for="(action ,i) in $setting.get('home.actions')"
            :key="i"
            :path="action.path"
            :btn="action.btn"
            size="large"
          >{{ action.text }}</app-link>
        </div>
      </div>

      <div class="content">
        <div class="mast screencast-container">
          <figure class="screencast">
            <video
              poster="require(`./img/screencast-poster.jpg`)"
              playsinline="true"
              autoplay
              muted
              loop
              preload="true"
            >
              <!-- <source :src="oggvideourl" type="video/ogg" /> -->
              <source :src="mp4videourl" type="video/mp4" >
            </video>
            <div class="play-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
                <path
                  d="M22.5 19.8v32.5c0 1.5 1.7 2.5 3 1.7l28.3-16.2c1.3-.8 1.3-2.7 0-3.5L25.5 18c-1.4-.7-3 .2-3 1.8z"
                  fill="#fff"
                />
              </svg>
            </div>
          </figure>
        </div>
      </div>
    </section>

    <section-benefits />

    <section-ide />

    <section-data />

    <section-share />

    <section-quotes />

    <section-pricing />
  </div>
</template>

<script>
export default {
  components: {
    "el-stripes": () => import("./el-stripes"),
    "section-benefits": () => import("./section-benefits"),
    "section-ide": () => import("./section-ide"),
    "section-data": () => import("./section-data"),
    "section-share": () => import("./section-share"),
    "section-quotes": () => import("./section-quotes"),
    "section-pricing": () => import("./section-pricing")
  },
  data() {
    return {
      loading: true,
      //oggvideourl: require(`./img/screencast-full.ogv`),
      mp4videourl: require(`./img/screencast-full.mp4`)
    }
  },
  metatags() {
    return {
      title: "Factor JS - Universal VueJS Apps for Front-End Pros",
      description: "Terminal Page Description."
    }
  },
  routeClass() {
    //return ["nav-light"]
  }
}
</script>
<style lang="less">
.view-home {
  .mast {
    //max-width: var(--max-width);
    max-width: 1040px;
    margin: 0 auto;
    padding: 2em 2em;
    width: 100%;
  }

  .page-title {
    font-size: 3em;
    line-height: 1.1;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }
  .page-title-sub {
    font-size: 1.4em;
    opacity: 0.7;
  }
  .section-title {
    font-weight: var(--font-weight-light);
    font-size: 2em;
    line-height: 44px;

    @media (min-width: 670px) {
      font-size: 42px;
      line-height: 52px;
    }
  }
  .body-title {
    font-weight: 500;
    font-size: 1.35em;
    line-height: 1.5em;
  }
  .body-text {
    font-weight: 400;

    opacity: 0.85;
  }
  .section-title-highlight {
    font-weight: 300;
    color: var(--color-primary);
  }
  .medium-body-text {
    font-weight: 400;
    font-size: 1.3em;
    line-height: 1.6;
  }
  // .common-IntroText {
  //   font-size: 24px;
  //   line-height: 36px;
  //   font-weight: 300;
  //   color: #424770;
  // }
  // .common-button {
  //   white-space: nowrap;
  //   display: inline-block;
  //   height: 40px;
  //   line-height: 40px;
  //   padding: 0 14px;
  //   box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  //   background: #fff;
  //   border-radius: 4px;
  //   font-size: 15px;
  //   font-weight: 600;
  //   text-transform: uppercase;
  //   letter-spacing: 0.025em;
  //   color: #6772e5;
  //   text-decoration: none;
  //   transition: all 0.15s ease;

  //   &:hover {
  //     color: #7795f8;
  //     transform: translateY(-1px);
  //     box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
  //       0 3px 6px rgba(0, 0, 0, 0.08);
  //   }

  //   &.common-button-default {
  //     color: #fff;
  //     background: #6772e5;
  //     &:hover {
  //       color: #fff;
  //       background-color: #7795f8;
  //     }
  //   }
  // }

  // .common-link {
  //   color: #6772e5;
  //   font-weight: 500;
  //   transition: color 0.1s ease;
  //   cursor: pointer;
  // }

  // .stripes-container {
  //   pointer-events: none;
  //   .pattern {
  //     display: block;
  //     background-size: 100%, 1000px 245px;
  //     background-position: center center;
  //   }
  //   > div {
  //     position: absolute;
  //     left: 0;
  //     right: 0;
  //     height: 245px;
  //     transform: skewY(-10deg);
  //     &:first-child {
  //       top: calc(126px + 245px * -3);
  //       background: linear-gradient(
  //         90deg,
  //         var(--color-bg-contrast),
  //         rgba(215, 222, 232, 0) 20%
  //       );
  //     }
  //     &:nth-child(2) {
  //       top: calc(126px + 245px * -1);
  //       background: linear-gradient(
  //         90deg,
  //         rgba(224, 226, 241, 0) 60%,
  //         var(--color-bg-contrast)
  //       );
  //     }
  //     &:nth-child(3) {
  //       top: calc(126px);
  //       // background: linear-gradient(
  //       //   90deg,
  //       //   rgba(190, 176, 244, 0),
  //       //   rgba(190, 176, 244, 0.15)
  //       // );
  //     }
  //     &:nth-child(4) {
  //       bottom: calc(-20px - 245px);
  //       background: linear-gradient(
  //         90deg,
  //         rgba(255, 255, 255, 0) 75%,
  //         var(--color-bg-contrast)
  //       );
  //     }
  //   }
  // }

  .header {
    .headline {
      padding: 150px 0 310px;
      margin-bottom: -270px;
      // padding: 150px 0 690px;
      // margin-bottom: -650px;
      text-align: center;
      @media (min-height: 1000px) {
        padding-top: 170px;
      }
      h1 {
        z-index: 5;
        position: relative;
      }
    }
    .content {
      position: relative;
      z-index: 2;
      &:before {
        content: "";
        position: absolute;
        z-index: -1;
        left: 0;
        top: 126px;
        right: 0;
        bottom: -20px;
        transform: skewY(-10deg);
        background: linear-gradient(
          190deg,
          var(--color-bg-contrast),
          hsla(0, 0%, 100%, 0) 75%
        );
      }
    }
    .screencast-container {
      position: relative;
      .screencast {
        width: 100%;
        padding-top: 56.25%;
        padding-top: calc(9 / 16 * 100%);
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1),
          0 15px 35px rgba(0, 0, 0, 0.1), 0 50px 100px rgba(50, 50, 93, 0.1);
        background: #f6f9fc url(./img/screencast-poster.jpg) 50%/100%;
        background-size: contain;
        video {
          position: absolute;
          left: 0;
          top: 0;
          min-width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 7px;
        }
        .play-button {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          background: var(--color-text);
          opacity: 0.9;
          border-radius: 50%;
          box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
            0 8px 16px -8px rgba(0, 0, 0, 0.3),
            0 -6px 16px -6px rgba(0, 0, 0, 0.025);
          width: 72px;
          height: 72px;
        }
      }
    }
  }
}
</style>
