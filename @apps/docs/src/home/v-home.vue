<template>
  <div class="view-home">
    <section class="header">
      <div class="headline content">
        <div class="content-pad">
          <h1 class="page-title">
            The Universal VueJS Platform
            <span
              class="highlight"
            >for Professional Front-End Developers</span>
          </h1>
          <h3 class="page-title-sub">
            Perfect for websites, blogs, dashboard-driven apps, CMS and eCommerce.
            <br >Open source and built with Vue, Mongo, and Node.
          </h3>
          <div class="actions">
            <app-link path="/guide/quickstart" btn="primary" size="large">Get Started &rarr;</app-link>
            <app-link path="https://github.com/fiction-com/factor" btn="default" size="large">
              <span>
                <i>v</i>
                <span>1.0ALPHA</span>
              </span>
            </app-link>
          </div>
        </div>
      </div>
      <div class="content screencast-container">
        <div class="content-pad">
          <figure class="screencast">
            <video preload="true" :poster="poster" playsinline="true" autoplay muted
loop />
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

    <section class="benefits content">
      <section-benefits class="content-pad" />
    </section>

    <section v-for="(feature, index) in features" :key="index" class="features content">
      <div class="split-feature content-pad" :class="[index % 2 == 0 ? 'even' : 'odd' ]">
        <div class="feature-content-container">
          <div class="feature-content">
            <home-icon class="feature-icon" :icon="feature.icon" />
            <h2 class="title">{{ feature.title }}</h2>
            <div class="text">{{ feature.text }}</div>
            <div class="action">
              <app-link path="/read">Something &rarr;</app-link>
            </div>
          </div>
        </div>
        <div class="feature-figure-container">
          <div class="figure-container" />
        </div>
      </div>
    </section>

    <div class="quotes">
      <article
        v-for="(quote, index) in quotes"
        :key="index"
        :class="[index % 2 == 0 ? 'odd' : 'even', index % 4 == 0 || index % 4 == 3 ? 'diagonal' : '']"
      >
        <blockquote>
          <a class="quote-image" href="#">
            <factor-avatar width="64px" />
          </a>
          <p class="quote-body">{{ quote.text }}</p>
          <footer>{{ quote.attribution }}</footer>
        </blockquote>
      </article>
    </div>

    <div class="pro content">
      <div class="content-pad">
        <div class="head">
          <h2 class="title">Ready to go pro?</h2>
          <h3 class="sub-title">Create a Fiction Account</h3>
        </div>
        <div class="text">
          Fiction has a robust community of developers building the next big things for the web.
          Join to get the latest updates and support.
        </div>
        <div class="action">
          <a href="#">Create An Account &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue"),
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
      poster: require(`./img/screencast-poster.jpg`), // 1280x720,
      quotes: [
        {
          text: `Stripe Sigma has helped accelerate our financial close process. Instead of
            manually combining multiple data sources each month, we’re now able to run a
            few simple queries in Sigma, enabling faster monthly reconciliation for credit
            card transactions.`,
          attribution: "Kelly Hofmann, Revenue Accounting"
        },
        {
          text: `Stripe Sigma has helped accelerate our financial close process. Instead of
            manually combining multiple data sources each month, we’re now able to run a
            few simple queries in Sigma, enabling faster monthly reconciliation for credit
            card transactions.`,
          attribution: "Kelly Hofmann, Revenue Accounting"
        },
        {
          text: `Stripe Sigma has helped accelerate our financial close process. Instead of
            manually combining multiple data sources each month, we’re now able to run a
            few simple queries in Sigma, enabling faster monthly reconciliation for credit
            card transactions.`,
          attribution: "Kelly Hofmann, Revenue Accounting"
        },
        {
          text: `Stripe Sigma has helped accelerate our financial close process. Instead of
            manually combining multiple data sources each month, we’re now able to run a
            few simple queries in Sigma, enabling faster monthly reconciliation for credit
            card transactions.`,
          attribution: "Kelly Hofmann, Revenue Accounting"
        }
      ],
      features: [
        {
          icon: "powered",
          title: "Powered by VueJS and MongoDB",
          text:
            "Factor is a universal Javascript framework which means you can dynamically make changes to your content and see them reflected immediately (without a build step). This also enables custom endpoints and server-side rendering (SSR) important for SEO, social, and performance reasons."
        },
        {
          icon: "ssr",
          title: "Dynamic SSR Apps",
          text:
            "Factor is a universal Javascript framework which means you can dynamically make changes to your content and see them reflected immediately (without a build step). This also enables custom endpoints and server-side rendering (SSR) important for SEO, social, and performance reasons."
        },
        {
          icon: "dashboard2",
          title: "Dashboard and Posts",
          text: `Factor core comes with a professional dashboard and post management system.
          This tool was carefully crafted to give you maximum powerful but with minimum bloat. It is simple by default but can be extended to handle even the most complext tasks.`
        },
        {
          icon: "plugins",
          title: "Drop-In Plugins",
          text:
            "Most Javascript frameworks make you do way too much coding and customization to make plugins work. That's why Factor makes plugins dead simple with intelligent defaults and no mandatory customization."
        },
        {
          icon: "brush",
          title: "Customizable Themes",
          text:
            "Ever seen a theming system for Javascript apps that you could work with? We hadn't either. Factor was developed from the start with customizeable theming and rapid app development in mind."
        }
        // {
        //   title: "GPL Licensed",
        //   text:
        //     "Factor core is free and open-source, built on the time-proven GPLv2 license that powers platforms like WordPress and Linux. "
        // }
      ]
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
  padding-top: 45px;
  font-weight: 400;
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  /* HEADER */
  .header {
    .headline {
      padding: 6em 2em 4em;
      text-align: center;
      @media (min-height: 1000px) {
        padding-top: 170px;
      }
      h1 {
        z-index: 5;
        position: relative;
      }

      .page-title {
        font-size: 3.5em;
        line-height: 1.1;
        margin: 0 0 1rem;
        letter-spacing: -0.02em;
        .highlight {
          display: block;
          opacity: 0.9;
        }
      }
      .page-title-sub {
        font-size: 1.4em;
        opacity: 0.7;
      }
      @media (max-width: 767px) {
        text-align: left;
        padding: 3rem 0;
        .page-title {
          font-weight: 600;
          font-size: 1.7em;
          line-height: 1.3;
        }
        .page-title .highlight {
          color: var(--color-primary);
        }
      }
      .actions {
        margin-top: 1.5em;
        .factor-btn {
          margin: 0 0.5em 0 0;
        }
      }
    }

    // .content {
    //   position: relative;
    //   z-index: 2;
    //   &:before {
    //     content: "";
    //     position: absolute;
    //     z-index: -1;
    //     left: 0;
    //     top: 126px;
    //     right: 0;
    //     bottom: -20px;
    //     transform: skewY(-10deg);
    //     background: linear-gradient(
    //       190deg,
    //       var(--color-bg-contrast),
    //       hsla(0, 0%, 100%, 0) 75%
    //     );
    //   }
    // }
    .screencast-container {
      position: relative;
      .content-pad {
        max-width: 1024px;
      }
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

  .benefits {
    .content-pad {
      padding-top: 10rem;
      padding-bottom: 10rem;
      @media (max-width: 767px) {
        padding-top: 6rem;
        padding-bottom: 3rem;
      }
    }
  }

  .features {
    &.content {
      padding: 10rem 0;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
    }
    .split-feature {
      display: grid;
      grid-column-gap: 2rem;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "a b";
      &.odd {
        grid-template-areas: "b a";
      }
      .feature-content-container {
        grid-area: a;
      }
      .feature-figure-container {
        grid-area: b;
      }
    }

    .feature-content {
      letter-spacing: -0.01em;
    }
    .feature-figure {
    }
    .feature-icon {
      height: 72px;
      width: 72px;
      margin-bottom: 1rem;
    }
    .title {
      font-size: 3em;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }
    .text {
      font-weight: 400;
      font-size: 1.4em;
      line-height: 1.6;
      margin-bottom: 1rem;
      opacity: 0.8;
    }
    .action {
      font-weight: 600;
      font-size: 1.3em;
    }
  }

  .quotes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 2rem;
    transform: skewY(-10deg);
    background: var(--color-bg-contrast);
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    article {
      position: relative;
      display: flex;
      &.diagonal {
      }
      &.odd {
        justify-content: flex-end;
      }
      blockquote {
        background: #fff;
        border-radius: 6px;
        box-shadow: var(--box-shadow-panel);
        transform: skewY(10deg);
        max-width: 550px;
        padding: 6rem 5rem;
        font-size: 1.3em;
        line-height: 1.8;
        text-align: center;
        .quote-image {
          display: block;
          text-align: center;
          .avatar {
            display: inline-block;
          }
          margin-bottom: 1rem;
        }
        footer {
          margin-top: 1rem;
          text-transform: uppercase;
          opacity: 0.5;
          font-size: 0.8em;
          font-weight: 600;
        }
      }
    }
  }

  .pro {
    text-align: center;
    padding: 12rem;
    .content-pad {
      max-width: 700px;
    }
    .head {
    }
    .title {
      font-size: 3em;
      line-height: 1.1;
    }
    .sub-title {
      font-size: 2em;
      opacity: 0.8;
      // color: var(--color-primary);
    }
    .text,
    .action {
      font-size: 1.3em;
    }
    .text {
      margin: 2rem;
    }
  }

  .section-title {
    font-size: 3em;
    line-height: 1.1;

    @media (max-width: 670px) {
      font-size: 2em;
      line-height: 1.2;
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
}
</style>
