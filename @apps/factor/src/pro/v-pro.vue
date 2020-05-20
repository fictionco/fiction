<template>
  <div class="view-pro">
    <section-splash />

    <section class="benefits content">
      <h2 class="title">Why you'll love being Pro...</h2>
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
        <div class="feature-figure-container">
          <div v-if="feature.figure" class="figure-container">
            <component :is="feature.figure" />
          </div>
        </div>
        <div class="feature-content-container">
          <div class="feature-content">
            <h2 v-if="feature.title" v-formatted-text="feature.title" class="title" />
            <div v-if="feature.text" class="text">{{ feature.text }}</div>

            <ul v-if="feature.list" class="list">
              <li v-for="(item, i) in feature.list" :key="i" class="list-block">
                <h3 v-formatted-text="item.title" class="list-title" />
                <p class="list-text">{{ item.text }}</p>
              </li>
            </ul>
            <div v-if="feature.link" class="action">
              <factor-link :path="feature.link.path">{{ feature.link.text }} &rarr;</factor-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quotes content">
      <h2 class="title">What they’re saying...</h2>
      <section-quotes class="content-pad quotes-pad" />
    </section>

    <section class="plugins-gallery-section content">
      <div class="plugins-gallery-header content-pad">
        <div class="text">
          <h2 class="title">Latest Plugins</h2>
          <div class="sub">Create and run your web app with Factor and extensions.</div>
        </div>
        <div class="action">
          <factor-link btn="default" path="/plugins">Browse All &rarr;</factor-link>
        </div>
      </div>

      <plugins-gallery class="content-pad" />
    </section>

    <el-cta id="cta" />
  </div>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"

export default {
  components: {
    factorLink,
    factorIcon,
    sectionSplash: () => import("./splash.vue"),
    sectionBenefits: () => import("./section-benefits.vue"),
    sectionQuotes: () => import("./section-quotes.vue"),
    elCta: () => import("./el-cta.vue"),
    pluginsGallery: () => import("../gallery/plugins-gallery.vue"),
  },
  data(this: any) {
    return {
      loading: true,
      loadingButtons: true,
      features: [
        {
          title: `Dashboard <span class="alt">Pro</span>`,
          text: `The professional suite enables special pro-level features on Factor's CMS dashboard.`,
          figure: () => import("./figure-dashboard.vue"),
          link: { path: "/plans", text: "Start Now" },
        },
        {
          title: `Extensions <span class="alt">Pro</span>`,
          text: `Want to take your applications to the next level? The Pro suite enabled Pro versions of many Factor plugins.`,
          figure: () => import("./figure-extensions.vue"),
          link: { path: "/plans", text: "Start Now" },
        },
        {
          title: `Support <span class="alt">Pro</span>`,
          text: `Lorem ipsum sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
          figure: () => import("./figure-support.vue"),
          link: { path: "/plans", text: "Start Now" },
        },
        {
          list: [
            {
              title: `Satisfaction Guaranteed`,
              text:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
            },
            {
              title: `Cancel Anytime`,
              text:
                "If you want to cancel, you can do so at any time. We'll never break production web apps.",
            },
          ],
          figure: () => import("./figure-satisfaction.vue"),
        },
      ],
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
      title: "JavaScript CMS and eCommerce Platform",
      description:
        "Factor is the leading extension-focused JavaScript CMS and eCommerce platform that helps you build websites, blogs, and eCommerce. Built with Vue, Express, Node, MongoDb and natively Typescript.",
    }
  },
}
</script>
<style lang="less">
.view-pro {
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
    h2.title {
      font-size: 1.5em;
      text-align: center;
      font-weight: var(--font-weight-bold, 700);
    }
    .content-pad {
      padding-top: 3rem;
      padding-bottom: 3rem;
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

    .title {
      font-weight: 700;
      font-size: 3em;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      .alt {
        color: var(--color-text-secondary);
      }
    }
    .text {
      font-weight: 400;
      font-size: 1.4em;
      line-height: 1.6;
      margin-bottom: 1rem;

      color: var(--color-text-secondary);
    }

    .list {
      list-style-type: none;
      .list-block {
        margin-bottom: 3rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .list-title {
        font-weight: 700;
        font-size: 2em;
        line-height: 1.1;
        margin-bottom: 1rem;
      }
      .list-text {
        font-weight: 400;
        font-size: 1.4em;
        line-height: 1.6;
        margin-bottom: 1rem;

        color: var(--color-text-secondary);
      }
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

  .quotes {
    padding: 6rem 0;
    @media (max-width: 900px) {
      padding: 4rem 0 8rem;
    }

    h2.title {
      font-size: 1.5em;
      text-align: center;
      font-weight: var(--font-weight-bold, 700);
      margin-bottom: 6rem;
    }
  }

  .plugins-gallery-section {
    padding: 3rem 0;

    .plugins-gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      padding-bottom: 2rem;
      .title {
        font-size: 1.4em;
        font-weight: var(--font-weight-bold, 700);
      }
      .sub {
        color: var(--color-text-secondary);
      }
    }
  }
}
</style>
