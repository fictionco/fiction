<template>
  <div class="view-home">
    <home-splash />

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
            itemprop="review"
            itemscope
            itemtype="http://schema.org/Review"
          >
            <blockquote itemprop="reviewRating" itemscope itemtype="http://schema.org/Review">
              <div class="quote-media">
                <a class="quote-image" href="#">
                  <img :src="quote.img" alt="quote" />
                </a>
              </div>
              <p class="quote-body" itemprop="reviewBody">"{{ quote.text }}"</p>
              <div
                class="rating"
                itemprop="reviewRating"
                itemscope
                itemtype="https://schema.org/Rating"
              >
                <factor-icon icon="fas fa-star" />
                <factor-icon icon="fas fa-star" />
                <factor-icon icon="fas fa-star" />
                <factor-icon icon="fas fa-star" />
                <factor-icon icon="fas fa-star" />
                <span class="rating-value" itemprop="ratingValue">5</span>
              </div>
              <footer>
                <a
                  :href="quote.link"
                  target="_blank"
                  itemprop="author"
                  itemscope
                  itemtype="https://schema.org/Person"
                >{{ quote.attribution }}</a>
              </footer>
            </blockquote>
          </article>
        </div>
      </div>
    </div>

    <join-program id="join" />
  </div>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    joinProgram: () => import("./el-join.vue"),
    homeSplash: () => import("./splash.vue"),
    homeIcon: () => import("./icon.vue"),
    sectionBenefits: () => import("./section-benefits.vue")
  },
  data(this: any) {
    return {
      loading: true,
      loadingButtons: true,
      features: [
        {
          icon: "powered",
          title: "Stop worrying about your tools.",
          text: `When you use Factor you'll be using best-of-class open source software under the hood.
            Stop worrying about lock-in and making the right choice. No more endlessly comparing new tools and techniques.
            Just trust Factor and get started building your app.`,
          figure: () => import("./figure-powered-by.vue"),
          link: { path: "/guide/quickstart", text: "View Quickstart" }
        },
        {
          icon: "ssr",
          title: "Make web apps that do more.",
          text: `Factor helps you bring together all the different tools you'll need to build great apps.
              It helps you build custom endpoints and easily optimize things for SEO,
             marketing, and performance.`,
          figure: () => import("./figure-live-changes.vue"),
          link: { path: "/guide", text: "Try Factor" }
        },
        {
          icon: "dashboard2",
          title: "Manage your users and content.",
          text: `Factor comes with a professional dashboard and post management system.
            This tool was carefully crafted to give you maximum powerful but with minimum bloat.
            It is simple by default but can be extended to handle even the most complex tasks.`,
          figure: () => import("./figure-dashboard.vue"),
          link: { path: "/guide", text: "Learn More" }
        },
        {
          id: "plugins-feature",

          title: `Add new features in seconds.`,
          text: `Most coding frameworks make you do way too much coding and customization
              to make plugins work. Factor focuses on making plugins dead simple with intelligent
              defaults. This means they "just work," no mandatory customization.`,
          figure: () => import("./figure-plugins.vue"),
          link: { path: "/plugins", text: "View Plugins" }
        },
        {
          title: "Save time with themes.",
          text: `Ever seen a theming system for Javascript apps that you could work with? We hadn't either.
              Factor was developed from the start with customizable theming and rapid app development in mind.`,
          figure: () => import("./figure-themes.vue"),
          link: { path: "/themes", text: "View Themes" }
        }
      ],
      quotes: [
        {
          text: `Really enjoying @factordev! Brilliant design here, you can basically do everything with a plugin. #js #factordev`,
          attribution: "Justin Keller, CEO ElasticByte",
          img: require("./img/elastic-byte.svg"),
          link: "https://www.elasticbyte.dev"
        },
        {
          text: `wow! So impressed with the speed and ease of use of @factordev for creating universal #vuejs apps 💨 #factorjs`,
          attribution: "Nick Dryburgh, Relic Games co.",
          img: require("./img/zeno.svg")
        }
      ]
    }
  },
  mounted(this: any) {
    setTimeout(() => {
      this.loadingButtons = false
    }, 1000)
  },
  methods: {},
  metaInfo() {
    return {
      title: "The Javascript CMS",
      description:
        "A purely Javascript CMS that helps you build websites, blogs, and eCommerce. Built with Vue, Express, Node, MongoDb and natively Typescript."
    }
  }
})
</script>
<style lang="less">
.view-home {
  padding-top: 45px;
  overflow: hidden;
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  .benefits {
    .content-pad {
      padding-top: 8rem;
      padding-bottom: 10rem;
      @media (max-width: 900px) {
        padding-top: 6rem;
        padding-bottom: 3rem;
      }
    }
  }

  .features {
    &.content {
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
      box-shadow: 0px 2px 3px rgba(50, 50, 93, 0.13), 0px 2px 5px rgba(50, 50, 93, 0.11),
        0px 5px 15px rgba(0, 0, 0, 0.07);
      border-radius: 6px;
    }
    .title {
      font-weight: 700;
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
          }
          .rating-value {
            display: none;
          }
        }
      }
    }
  }
}
</style>
