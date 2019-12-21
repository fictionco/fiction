<template>
  <div class="view-home">
    <section class="header">
      <div class="headline content">
        <div class="content-pad">
          <h1 class="page-title">
            Create websites, blogs, and full-stack apps
            <span
              class="highlight"
            >with a modern Javascript stack</span>
          </h1>
          <h3 class="page-title-sub">The marketing and CMS platform for web developers.</h3>

          <div class="actions">
            <factor-email-list list-id="alphaProgram" />
            <div v-if="!loadingButtons" class="github-actions">
              <script async defer src="https://buttons.github.io/buttons.js"></script>

              <a
                class="github-button"
                href="https://github.com/fiction-com/factor"
                data-color-scheme="no-preference: light; light: light; dark: light;"
                data-icon="octicon-star"
                data-size="large"
                data-show-count="true"
                aria-label="Star fiction-com/factor on GitHub"
              >Star</a>

              <!-- Place this tag where you want the button to render. -->
              <a
                class="github-button"
                href="https://github.com/fiction-com/factor/subscription"
                data-color-scheme="no-preference: light; light: light; dark: light;"
                data-icon="octicon-eye"
                data-size="large"
                data-show-count="true"
                aria-label="Watch fiction-com/factor on GitHub"
              >Watch</a>
              <!-- <factor-link path="https://github.com/fiction-com/factor">
                Version 1.1 (Beta)
                <span class="arrow">&rarr;</span>
              </factor-link>-->
            </div>
          </div>
          <div class="points">
            <div class="point">
              <span class="arrow">
                <factor-icon icon="check" />
              </span>
              <span class="text">Full-Stack VueJS</span>
            </div>
            <div class="point">
              <span class="arrow">
                <factor-icon icon="check" />
              </span>
              <span class="text">Drop-In Themes + Plugins</span>
            </div>
            <div class="point">
              <span class="arrow">
                <factor-icon icon="check" />
              </span>
              <span class="text">Free and Open-Source</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content screencast-container">
        <div class="content-pad">
          <div class="screenshots">
            <div v-for="(s, i) in screenshots" :key="i" class="screenshot">
              <img :src="s.img" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits content">
      <section-benefits class="content-pad" />
    </section>

    <section
      v-for="(feature, index) in features"
      :id="feature.id"
      :key="index"
      class="features content"
      :data-test="`feature-` + index"
      :class="[index == features.length - 1 ? 'last' : '']"
    >
      <div class="split-feature" :class="[index % 2 == 0 ? 'even' : 'odd']">
        <div class="feature-content-container">
          <div class="feature-content">
            <home-icon v-if="feature.icon" class="feature-icon" :icon="feature.icon" />
            <h2 class="title">{{ feature.title }}</h2>
            <div class="text">{{ feature.text }}</div>
            <div v-if="feature.link" class="action">
              <factor-link :path="feature.link.path">{{ feature.link.text }} &rarr;</factor-link>
            </div>
          </div>
        </div>
        <div class="feature-figure-container">
          <div v-if="feature.figure" class="figure-container">
            <component :is="feature.figure" />
          </div>
        </div>
      </div>
    </section>

    <div class="quotes-wrap">
      <div class="quotes">
        <div class="quotes-pad">
          <article
            v-for="(quote, index) in quotes"
            :key="index"
            :class="[
              index % 2 == 0 ? 'odd' : 'even',
              index % 4 == 0 || index % 4 == 3 ? 'diagonal' : ''
            ]"
          >
            <blockquote>
              <div class="quote-media">
                <a class="quote-image" href="#">
                  <img :src="quote.img" alt="quote" />
                </a>
              </div>
              <p class="quote-body">"{{ quote.text }}"</p>
              <footer>
                <a :href="quote.link" target="_blank">{{ quote.attribution }}</a>
              </footer>
            </blockquote>
          </article>
        </div>
      </div>
    </div>

    <div class="alpha-program content">
      <div class="content-pad">
        <div class="head">
          <div class="glyph">&alpha;</div>
          <h2 class="title">Join The Developer Program</h2>
          <h3 class="sub-title">Request an Invite or Contact Us</h3>
        </div>
        <div class="text">
          Join other developers building the next big things for
          the web. Join to get chat access, latest updates and support.
        </div>
        <div class="action">
          <factor-email-list list-id="alphaProgram" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorEmailList } from "@factor/plugin-email-list"
import { factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorEmailList,
    factorLink,
    factorIcon,

    "home-icon": () => import("./icon.vue"),
    "section-benefits": () => import("./section-benefits.vue")
  },
  data(this: any) {
    return {
      loading: true,
      loadingButtons: true,
      poster: require(`./img/screencast-poster.jpg`), // 1280x720,
      screenshots: [
        { img: require("./img/theme-ultra.jpg"), name: "Alpha Theme" },
        { img: require("./img/screencast-poster.jpg"), name: "Dashboard" },
        { img: require("./img/theme-alpha.jpg"), name: "Ultra Theme" }
      ],
      quotes: [
        {
          text: `Really enjoying @factordev! Brilliant design here, you can basically do everything with a plugin. #js #factordev`,
          attribution: "Justin Keller, CEO Elastic Byte",
          img: require("./img/elastic-byte.svg"),
          link: "https://www.elasticbyte.net"
        },
        {
          text: `wow! So impressed with the speed and ease of use of @factordev for creating universal #vuejs apps 💨 #factorjs`,
          attribution: "Nick Dryburgh, Zeno co.",
          img: require("./img/zeno.svg")
        }
      ],
      features: [
        {
          icon: "powered",
          title: "Powered by VueJS and MongoDB",
          text: `When you use Factor you'll be using best-of-class open source software under the hood.
            Stop worrying about lock-in. No more endlessly comparing new tools and techniques.
            Just trust Factor and get started building your app.`,
          figure: () => import("./figure-powered-by.vue"),
          link: { path: "/guide/quickstart", text: "View Quickstart" }
        },
        {
          icon: "ssr",
          title: "Dynamic Beats Static",
          text: `Factor is a universal Typescript platform which means you can dynamically make changes
              to your content and see them reflected immediately (without a build step).
              This also enables custom endpoints and server-side rendering (SSR) important for SEO,
              social, and performance reasons.`,
          figure: () => import("./figure-live-changes.vue"),
          link: { path: "/guide", text: "Try Factor" }
        },
        {
          icon: "dashboard2",
          title: "Dashboard Included",
          text: `Factor comes with a professional dashboard and post management system.
            This tool was carefully crafted to give you maximum powerful but with minimum bloat.
            It is simple by default but can be extended to handle even the most complex tasks.`,
          figure: () => import("./figure-dashboard.vue"),
          link: { path: "/guide", text: "Learn More" }
        },
        {
          id: "plugins-feature",
          //icon: "plugins",
          title: `Plugins that just work`,
          text: `Most coding frameworks make you do way too much coding and customization
              to make plugins work. Factor focuses on making plugins dead simple with intelligent
              defaults. This means they "just work," no mandatory customization.`,
          figure: () => import("./figure-plugins.vue"),
          link: { path: "/plugins", text: "View Plugins" }
        },
        {
          //icon: "brush",
          title: "Theming for the 21st Century",
          text: `Ever seen a theming system for Javascript apps that you could work with? We hadn't either.
              Factor was developed from the start with customizable theming and rapid app development in mind.`,
          figure: () => import("./figure-themes.vue"),
          link: { path: "/themes", text: "View Themes" }
        }
      ]
    }
  },
  mounted(this: any) {
    this.loadingButtons = false
  },
  metaInfo() {
    return {
      title: "VueJS Framework for Website, blogs, apps and eCommerce",
      description:
        "Factor VueJS framework to help you build websites, blogs, apps and eCommerce. Powerful tools built with Vue, Express, Node and MongoDb."
    }
  }
})
</script>
<style lang="less">
.view-home {
  padding-top: 45px;
  font-weight: 400;
  overflow: hidden;
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
      padding: 6em 2em 2em;
      text-align: center;
      @media (min-height: 1000px) {
        padding-top: 170px;
      }
      h1 {
        z-index: 5;
        position: relative;
      }

      .page-title {
        font-size: 3.7em;
        line-height: 1.1;
        font-weight: 500;
        margin: 0 0 1rem;
        letter-spacing: -0.03em;
        .highlight {
          display: block;
          color: var(--color-primary);
        }
      }
      .page-title-sub {
        font-size: 2em;
        opacity: 0.7;
        margin: 1em 0;
      }
      .points {
        display: flex;
        margin: 4rem auto 2rem;
        justify-content: center;

        .point {
          margin: 0 1rem;
          text-transform: uppercase;
          font-weight: 600;
          .arrow {
            background: var(--color-primary);
          }
          &:hover {
            .arrow {
              background: var(--color-primary);
            }
          }
        }
        .arrow {
          text-align: center;
          transition: all 0.3s;
          color: #fff;
          background: var(--color-text);
          border-radius: 50%;
          width: 1.5em;
          height: 1.5em;
          display: inline-block;
          margin-right: 0.5em;
        }
      }
      @media (max-width: 900px) {
        text-align: left;
        padding: 3rem 0;
        .page-title {
          font-weight: 500;
          font-size: 1.7em;
          line-height: 1.3;
          .highlight {
            color: #0496ff;
          }
        }
        .page-title .highlight {
          color: var(--color-primary);
        }
        .page-title-sub {
          font-size: 1.4em;
          line-height: 1.4;
        }
        .points {
          display: block;
          text-align: left;
          .point {
            margin: 0.6em 0;
          }
        }
      }
      .actions {
        margin-top: 1.5em;
        .github-actions {
          margin: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 1;
          > span {
            margin: 0 0.5rem;
          }
        }

        .email-list-form {
          max-width: 650px;
          font-size: 1.3em;
          margin: 0 auto;
          @media (max-width: 900px) {
            font-size: 1em;
          }
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
      background-image: url("./img/dot.svg");

      .content-pad {
        max-width: 100%;
      }
      .screenshots {
        display: grid;
        grid-gap: 2rem;
        justify-content: center;
        align-items: center;
        grid-template-columns: repeat(3, minmax(370px, 800px));
        perspective: 1000px;
        width: 220%;
        margin-left: -60%;
        .screenshot {
          img {
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1), 0 15px 35px rgba(0, 0, 0, 0.1),
              0 50px 100px rgba(50, 50, 93, 0.1);
          }
          &:nth-child(1) {
            transform: translateX(-30%);
          }
          &:nth-child(2) {
            z-index: 50;
          }
          &:nth-child(3) {
            transform: translateX(30%);
          }
        }
      }
      .screencast {
        width: 100%;
        padding-top: 56.25%;
        padding-top: calc(9 / 16 * 100%);
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1), 0 15px 35px rgba(0, 0, 0, 0.1),
          0 50px 100px rgba(50, 50, 93, 0.1);
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
            0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
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
      @media (max-width: 900px) {
        padding-top: 6rem;
        padding-bottom: 3rem;
      }
    }
  }

  .features {
    &.content {
      box-shadow: 0 1px 0 rgba(227, 228, 249, 1);
      &.last {
        box-shadow: none;
      }
      @media (max-width: 900px) {
        padding: 4rem 0;
        box-shadow: none;
      }
    }
    .split-feature {
      display: grid;
      grid-column-gap: 3rem;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "a b";
      align-items: center;
      min-height: 80vh;
      &.even {
        .feature-content-container {
          justify-self: flex-end;
        }
      }
      &.odd {
        grid-template-areas: "b a";
        .feature-figure-container {
          justify-content: flex-end;
          @media (max-width: 900px) {
            justify-content: center;
          }
        }
      }
      .feature-content-container {
        grid-area: a;
        min-width: 0;
        .feature-content {
          padding: 10rem 1.5rem;
          max-width: 550px;
        }
      }
      .feature-figure-container {
        grid-area: b;
        min-width: 0; // defaults content width
        height: 100%;
        position: relative;
        // width: 100%;
        display: flex;
        align-items: center;
        .figure-container {
          max-width: 100%;
        }
      }
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-template-areas: "a" "b";
        &.odd {
          grid-template-areas: "a" "b";
        }
        .feature-content-container {
          .feature-content {
            padding: 3rem 1.5rem 1rem;
            max-width: 100%;
          }
        }
        .feature-figure-container {
          justify-content: center;
        }
      }
    }

    .feature-content {
      letter-spacing: -0.01em;
    }
    .feature-icon {
      height: 72px;
      width: 72px;
      margin-bottom: 1rem;
    }
    .title {
      font-weight: 500;
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
      font-weight: 500;
      font-size: 1.3em;
    }
    @media (max-width: 900px) {
      .title {
        font-size: 1.8em;
      }
      .text {
        font-size: 1.1em;
      }
    }
  }

  .quotes-wrap {
    position: relative;
    background-image: url("./img/dot.svg");

    margin-top: 5em;
    .quotes {
      transform: skewY(-10deg);

      .quotes-pad {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 4em;
        perspective: 800px;
      }
      @media (max-width: 900px) {
        .quotes-pad {
          grid-template-columns: 1fr;
          article:nth-child(odd),
          article:nth-child(even) {
            transform: none;
            margin: 0 auto;
          }
          article {
            blockquote {
              padding: 4rem 2rem;
              text-align: left;
              .quote-media {
                text-align: left;
              }
            }
          }
        }
      }
      article {
        position: relative;
        display: flex;

        &:nth-child(odd) {
          transform: rotateX(2deg) rotateY(7deg);
          //    background-image: linear-gradient(45deg, #fff, #f7f7f7);
          blockquote {
            box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
              -9px 22.5px 65px -5px rgba(50, 50, 93, 0.2);
          }
        }
        &:nth-child(even) {
          transform: rotateX(1deg) rotateY(-7deg);
          // background-image: linear-gradient(45deg, #fff, #f7f7f7);
          blockquote {
            box-shadow: 1px 1px 4px 0 rgba(26, 26, 67, 0.1),
              19px 22.5px 75px -5px rgba(50, 50, 93, 0.2);
          }
        }
        &.odd {
          justify-content: flex-end;
        }
        blockquote {
          transform: skewY(10deg);

          max-width: 550px;
          padding: 8rem 4rem;
          font-size: 1.4em;
          line-height: 1.8;
          text-align: center;
          background: #fff;
          border-radius: 6px;

          .quote-media {
            display: block;
            text-align: center;
            a {
              display: inline-block;
              width: 100px;

              img {
                display: block;
                width: 100%;
              }
            }

            margin-bottom: 1rem;
          }
          footer {
            margin-top: 1rem;
            text-transform: uppercase;

            font-size: 0.8em;
            font-weight: 500;
            // a {
            //   color: inherit;
            //   opacity: 0.4;
            // }
          }
        }
      }
    }
  }

  .alpha-program {
    text-align: center;
    padding: 12rem 0;
    .content-pad {
      max-width: 700px;
    }
    .glyph {
      color: #ff0076;

      width: 100px;
      height: 100px;
      line-height: 100px;
      font-size: 3.5em;

      border-radius: 50%;
      margin: 1rem auto;
    }
    line-height: 1.1;
    .title {
      font-size: 3em;
      font-weight: 500;
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
      line-height: 1.5;
      margin: 2rem 0;
    }
    .action {
      font-weight: 500;
    }
    @media (max-width: 900px) {
      text-align: left;
      padding: 7rem 0;
      .title {
        font-size: 2em;
      }
      .glyph {
        margin: 0;
      }
    }
  }

  // .section-title {
  //   font-size: 3em;
  //   line-height: 1.1;

  //   @media (max-width: 670px) {
  //     font-size: 2em;
  //     line-height: 1.2;
  //   }
  // }
  // .body-title {
  //   font-weight: 500;
  //   font-size: 1.35em;
  //   line-height: 1.5em;
  // }
  // .body-text {
  //   font-weight: 400;

  //   opacity: 0.85;
  // }
  // .section-title-highlight {
  //   font-weight: 300;
  //   color: var(--color-primary);
  // }
  // .medium-body-text {
  //   font-weight: 400;
  //   font-size: 1.3em;
  //   line-height: 1.6;
  // }
}
</style>
