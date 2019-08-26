<template>
  <div class="view-home-version-2">
    <div class="header-wrapper">
      <section class="header content">
        <div class="content-pad">
          <div class="header-layout">
            <div class="header-content">
              <div class="header-tag">
                <div class="header-icon-text">For Front-End Professionals</div>
              </div>

              <h1 class="header-title">Ship the world's next great web and eCommerce apps</h1>
              <p class="header-text">
                Fiction helps professional front-end developers build Javascript apps that take things to the next level.
                Need to build scaleable, enterprise-grade applications? Get in touch for a free consultation.
              </p>

              <div class="header-actions">
                <input type="email" placeholder="Email Address" >
                <app-btn btn="primary">Request Invite &rarr;</app-btn>
              </div>
            </div>
            <div class="header-figure">
              <figure>tbd</figure>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="benefits content">
      <div class="content-pad">
        <div v-for="(benefit, index) in benefits" :key="index" class="benefit">
          <figure class="benefit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 48">
              <g fill="none" fill-rule="evenodd">
                <path
                  fill="#ff0076"
                  fill-rule="nonzero"
                  d="M46 33.44v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98zm0-10v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98zm0-10v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98z"
                />
                <path
                  fill="#ff0076"
                  fill-rule="nonzero"
                  d="M46 3.44v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98z"
                />
              </g>
            </svg>
          </figure>

          <h3 class="title">{{ benefit.title }}</h3>

          <p class="text">{{ benefit.text }}</p>
          <div class="action">
            <a href="#">Go &rarr;</a>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(feature, index) in features" :key="index" class="features content">
      <div class="split-feature content-pad wide" :class="[index % 2 == 0 ? 'odd' : 'even' ]">
        <div class="feature-content-container">
          <div class="feature-content">
            <div class="super">{{ feature.super }}</div>
            <div class="title">{{ feature.title }}</div>
            <div class="text">{{ feature.text }}</div>
          </div>
        </div>
        <div v-if="feature.figure" class="feature-figure-container">
          <component :is="feature.figure" />
        </div>
      </div>
    </div>

    <div class="compare content">
      <div class="content-pad">
        <div class="mast-head">
          <div class="title">Let's Create Something Beautiful Together</div>
          <div class="sub-title">
            Fiction is here to help you create the world's next great web apps.
            <br >Let's get started...
          </div>
        </div>
        <div class="feature-table-wrap">
          <div class="feature-table">
            <div
              v-for="(col, index) in compare"
              :key="index"
              class="column"
              :class="index == 0 ? 'label' : 'data'"
            >
              <div v-for="(row, rowIndex) in col.items" :key="rowIndex" class="row">{{ row }}</div>
            </div>
          </div>
        </div>
      </div>

      <el-cta />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "section-features": () => import("./section-features"),
    "section-testimonials": () => import("./section-testimonials"),
    "section-integrate": () => import("./section-integrate"),
    "el-cta": () => import("../el/cta")
  },
  data() {
    return {
      loading: true,
      benefits: [
        {
          title: "Front-End Focused",
          text: `Fiction focuses solely on the needs of front-end professionals. 
            We don't bloat your apps with unecessary features, and we help you build apps the way you actually want to.`
        },
        {
          title: "Coding, Just the Fun Parts",
          text: `The best apps are handcrafted with custom CSS and components. 
              Fiction helps you code where its fun and creative; but takes away the pitfalls, bugs and quirks common in JS apps.`
        },
        {
          title: "Professional Support",
          text: `Build your app along with with people that know design and can answer advanced coding questions. 
              Fiction provides only top-tier support run by expert designers and application devs. `
        }
      ],
      features: [
        {
          super: "Factor JS",
          title: "Create Dynamic Javascript Apps Powered by VueJS, MongoDB",
          text: `Factor is a state of the art Javascript development platform for front-end developers. 
            It includes a CMS engine powered by an advanced dashboard and post system. It also has first class support for drop-in plugins and themes.
            Factor is free and open-source, powered by VueJS, MongoDB and Node. `,
          figure: () => import("./figure-code.vue"),
          link: {
            path: "https://www.factor.dev",
            text: "Factor Development Site &rarr;"
          }
        },
        {
          super: "Factor Pro",
          title:
            "Dedicated Support and Extensions for Professional Front-End Devs",
          text: `Designed to meet the needs of professional front-end developers.`,
          link: {
            path: "/pro",
            text: "Learn More &rarr;"
          }
        },
        {
          super: "Factor VIP",
          title: "Your Development Team, Delivered",
          text: `Being a Fiction customer means you'll have a 24/7 team of expert developers ready to help you. 
            No more countless hours of debugging, or unexpected surprises, Fiction will be here to help you build, deploy and scale your apps.`,
          link: {
            path: "/vip",
            text: "Learn More &rarr;"
          }
        }
      ],
      compare: [
        {
          items: ["", "Ideal For", "Summary"]
        },
        {
          items: [
            "Factor JS",
            "Front-End Developers",
            "A free platform to ship beautiful JS apps fast."
          ],
          link: {
            path: "https://www.factor.dev",
            text: "Visit Factor.dev &rarr;"
          }
        },
        {
          items: [
            "Factor Pro",
            "Professional Front-End Developers",
            "Advanced features, options and tools. Technical support from Fiction."
          ],
          link: {
            path: "https://www.factor.dev",
            text: "Visit Factor.dev &rarr;"
          }
        },
        {
          items: [
            "Factor VIP",
            "Enterprise Front-End Developers",
            "Dedicated developers and managed infrastructure. Virtual dev team."
          ],
          link: {
            path: "https://www.factor.dev",
            text: "Visit Factor.dev &rarr;"
          }
        }
      ]
    }
  },
  metatags() {
    return {
      title: "Build the World's next great app.",
      description: "Terminal Page Description.",
      image: require("../img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.view-home-version-2 {
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2em;
    width: 100%;
    &.wide {
      max-width: 1200px;
    }
  }

  // Header
  .header-wrapper {
    max-width: 100vw;
    overflow: visible;
    .header {
      position: relative;
      z-index: 0;
      padding: 70px 0 6rem;

      @media (max-width: 767px) {
        padding: 115px 0 60px;
      }
      @media (min-width: 670px) {
        padding-bottom: 10rem;
        margin-bottom: 6vw;
      }
      .header-content {
        flex: 1;
        min-width: 520px;
        margin: 0 60px 0 0;

        @media (max-width: 767px) {
          min-width: 320px;
          margin: 0 0 40px;
        }
      }
      .header-layout {
        display: flex;
        flex-direction: row;
        @media (max-width: 767px) {
          flex-direction: column;
        }
      }
    }
  }
  .header-title {
    font-size: 3.5em;
    line-height: 1.2;
    font-weight: 400;
    margin: 0 0 0.5em;
    letter-spacing: -0.01em;
  }

  .header-text {
    font-size: 24px;
    line-height: 36px;
    font-weight: 300;
    opacity: 0.8;
  }

  .header-actions {
    font-size: 1.1em;
    margin-top: 2em;
    display: grid;
    grid-template-columns: 1fr 200px;
    grid-gap: 1.5em;

    input {
      margin: 0;
      font-size: 1.5em;
      background: #fff;
    }
  }

  .header-tag {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 32px;

    .header-icon {
      margin-left: -20px;
      margin-right: 16px;
      width: 48px;
      height: 48px;
      @media (max-width: 767px) {
        margin-left: 0;
      }
    }
    .header-icon-text {
      opacity: 0.4;
      font-size: 1.3em;

      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
  }

  .header-figure {
    position: relative;
    perspective: 1500px;
    padding-top: 2em;
    figure {
      width: 800px;
      height: 500px;
      background: #fff;
      box-shadow: var(--box-shadow-panel);
    }
  }

  // BENEFITS

  .benefits {
    .content-pad {
      display: grid;
      grid-template-rows: repeat(3, auto);
      grid-gap: 2em 0;
      @media (min-width: 670px) {
        grid-gap: 0 2em;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(1, 1fr);
      }

      .benefit {
        .title {
          font-size: 1.3em;
        }
        .text {
          opacity: 0.7;
          margin: 1rem 0;
        }
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
      grid-column-gap: 4rem;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "a b";
      align-items: center;
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
      max-width: 500px;
    }

    .feature-icon {
      margin-bottom: 1rem;
    }
    .super {
      text-transform: uppercase;
      font-weight: 600;

      font-size: 1.3em;
      color: var(--color-primary);
      margin-bottom: 1em;
    }
    .title {
      font-size: 2em;
      line-height: 1.3;
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

  .compare {
    .mast-head {
      text-align: center;
      .title {
        font-size: 2.5em;
      }
      .sub-title {
        font-size: 1.4em;
        opacity: 0.5;
      }
      margin-bottom: 3em;
    }
    .feature-table {
      display: grid;
      grid-template-columns: 10rem 1fr 1fr 1fr;
      grid-gap: 1em;
      .column {
        text-align: center;
        background: #fff;

        border-radius: 6px;
        overflow: hidden;

        &.data {
          box-shadow: 0 4px 35px 0 rgba(23, 55, 87, 0.1),
            0 5px 15px 0 rgba(0, 0, 0, 0.07);
          .row {
            border-bottom: 1px solid #eee;
            &:last-child {
              border: none;
            }
          }
          .row:first-child {
            background: #1b223c;
            color: #fff;
            font-weight: 700;
          }
        }
      }

      .column:nth-child(1) {
        box-shadow: none;
        background: none;
        text-align: right;
        font-weight: 700;
        opacity: 0.5;
      }
      .row {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100px;
        padding: 1em 2em;
      }
    }
  }

  .common-uppercase-text {
    font-size: 17px;
    line-height: 28px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  .common-PageTitle {
    font-size: 53px;
    line-height: 68px;
    font-weight: 400;
    margin: 0 0 20px;
    color: #32325d;
    letter-spacing: -0.01em;
  }
  .common-SectionTitle {
    font-weight: 400;
    font-size: 34px;
    line-height: 44px;
    color: #32325d;
    @media (min-width: 670px) {
      font-size: 42px;
      line-height: 52px;
    }
  }

  .common-Button {
    white-space: nowrap;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    background: #fff;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    color: #6772e5;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      color: #7795f8;
      transform: translateY(-1px);
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
        0 3px 6px rgba(0, 0, 0, 0.08);
    }

    &.common-Button--default {
      color: #fff;
      background: #6772e5;
      &:hover {
        color: #fff;
        background-color: #7795f8;
      }
    }
  }
  .common-body-title {
    font-weight: 500;
    font-size: 19px;
    line-height: 32px;
    color: #32325d;
  }
  .common-bodytext {
    font-weight: 400;
    font-size: 17px;
    line-height: 28px;
    color: #525f7f;
  }
  .common-MediumBodyText {
    font-weight: 400;
    font-size: 19px;
    line-height: 32px;
    color: #525f7f;
  }
  .common-link {
    color: #6772e5;
    font-weight: 500;
    transition: color 0.1s ease;
    cursor: pointer;
  }
}
</style>
