<template>
  <div class="view-home-version-2">
    <section class="header content">
      <div class="header-bg">
        <div class="grid">
          <div v-for="r in 16" :key="r" class="row" />
        </div>
      </div>
      <div class="content-pad wide">
        <div class="header-text">
          <div class="header-tag">
            <home-icon class="feature-icon" icon="powered" />
            <div class="header-icon-text">Factor JS &rarr; Platform</div>
          </div>

          <h1 class="title">
            A Javascript App Platform
            <span class="alt">for Front-End Professionals</span>
          </h1>
          <p class="text">
            Powered by VueJS, MongoDB and Node, Factor is a platform that helps you professionally develop, manage,
            and scale your app on the web.
          </p>

          <div class="header-actions">
            <factor-email-list list-id="alphaProgram" />
          </div>
        </div>
        <figure-header />
      </div>
    </section>

    <div class="benefits content">
      <div class="content-pad wide">
        <div v-for="(benefit, index) in benefits" :key="index" class="benefit">
          <home-icon v-if="benefit.icon" class="feature-icon" :icon="benefit.icon" />

          <h3 class="title">{{ benefit.title }}</h3>

          <p class="text">{{ benefit.text }}</p>
          <div v-if="benefit.link" class="action">
            <app-link :path="benefit.link.path">
              <span v-formatted-text="benefit.link.text" />
            </app-link>
          </div>
        </div>
      </div>
    </div>

    <div
      v-for="(feature, index) in features"
      :id="feature.id"
      :key="index"
      class="features content"
    >
      <div class="split-feature content-pad wide" :class="[index % 2 == 0 ? 'odd' : 'even']">
        <div class="feature-content-container">
          <div class="feature-content">
            <div class="super">{{ feature.super }}</div>
            <div class="title">{{ feature.title }}</div>
            <div class="text">{{ feature.text }}</div>
            <div v-if="feature.bullets" class="bullets">
              <div v-for="(bullet, i) in feature.bullets" :key="i" class="bullet">
                <span class="bullet-icon">
                  <factor-icon icon="check" />
                </span>
                <span class="bullet-text">{{ bullet }}</span>
              </div>
            </div>
            <div v-if="feature.link" class="action">
              <app-link :path="feature.link.path" btn="primary">
                <span v-formatted-text="feature.link.text" />
              </app-link>
            </div>
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
          <div class="sub-title">Create an account or get in touch.</div>
        </div>
        <div class="feature-table-wrap">
          <div class="feature-table">
            <div
              v-for="(col, index) in compare"
              :key="index"
              class="column"
              :class="index == 0 ? 'label' : 'data'"
            >
              <div
                v-for="(row, rowIndex) in col.items"
                :key="rowIndex"
                v-formatted-text="row"
                class="row"
                :class="row ? 'has-content' : 'empty'"
              />
              <div v-if="col.link" class="footer-row row">
                <app-link :path="col.link.path">
                  <span v-formatted-text="col.link.text" />
                </app-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="alpha-program content">
        <div class="content-pad">
          <div class="head">
            <div class="glyph">&alpha;</div>
            <h2 class="title">Join The Alpha Program</h2>
            <h3 class="sub-title">Request an Invite or Contact Us</h3>
          </div>
          <div class="text">
            Fiction has a robust community of developers building the next big things for
            the web. Join to get chat access, latest updates and support.
          </div>
          <div class="action">
            <factor-email-list list-id="alphaProgram" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue"),
    "figure-header": () => import("./figure-header.vue")
  },
  data() {
    return {
      poster: require("./img/screencast-poster.jpg"),
      loading: true,
      benefits: [
        {
          icon: "front-end",
          title: "Front-End Focused",
          text: `Fiction focuses solely on the needs of front-end professionals. 
            We don't bloat your apps with unecessary features, and we help you build apps the way you actually want to.`
        },
        {
          icon: "code",
          title: "Coding, Just the Fun Parts",
          text: `The best apps are handcrafted with custom CSS and components. 
              Fiction helps you code where its fun and creative; but takes away the pitfalls, bugs and quirks common in JS apps.`
        },
        {
          icon: "pro-support",
          title: "Professional Support",
          text: `Build your app witb people that know design and can answer advanced coding questions. 
              Fiction provides only top-tier support run by expert designers and application devs. `
        }
      ],
      features: [
        {
          id: "feature-factor",
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
          id: "feature-pro",
          super: "Factor Pro",
          title:
            "Dedicated Support and Extensions for Professional Front-End Devs",
          text: `Professional features designed for professional front-end developers. 
            Get access to the best web app platform money can buy including pro eCommerce and web publishing extensions, 
            enhanced SEO and brand capabilities and more. `,
          figure: () => import("./figure-pro.vue"),
          link: {
            path: "/vip",
            text: "Learn More &rarr;"
          }
        },
        {
          id: "feature-vip",
          super: "Factor VIP",
          title: "Your Development Team, Delivered",
          text: `Being a Fiction customer means you'll have a 24/7 team of expert developers ready to help you. 
            No more countless hours of debugging, or unexpected surprises, Fiction will be here to help you build, deploy and scale your apps.`,
          figure: () => import("./figure-vip.vue"),
          link: {
            path: "/vip",
            text: "Learn More &rarr;"
          },
          bullets: [
            "Design",
            "Development",
            "Managed Infrastructure",
            "SEO",
            "Dedicated Developers",
            "Guaranteed Satisfaction",
            "Phone Support",
            "Free Setup"
          ]
        }
      ],
      compare: [
        {
          items: ["", "Ideal For &rarr;", "Summary  &rarr;"]
        },
        {
          items: [
            "Factor JS",
            "Front-End Developers",
            "A free platform to ship beautiful JS apps fast."
          ],
          link: {
            path: "https://www.factor.dev",
            text: "Go to Factor.dev &rarr;"
          }
        },
        {
          items: [
            "Factor Pro",
            "Professional Front-End Developers",
            "Advanced features, options and tools. Technical support from Fiction."
          ],
          link: {
            path: "/pro",
            text: "Learn More &rarr;"
          }
        },
        {
          items: [
            "Factor VIP",
            "Enterprise Front-End Developers",
            "Dedicated developers and managed infrastructure. Virtual dev team."
          ],
          link: {
            path: "/vip",
            text: "Learn More &rarr;"
          }
        }
      ]
    }
  },
  routeClass() {
    return "nav-white"
  },
  metatags() {
    return {
      title: "A Platform and Tools for Front-End Developers",
      description: `Fiction designs and devolops tools and services for front-end developers and remote workers. 
        Including Factor Platform built with Vue, Mongo, and Node.`,
      image: require("../img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.view-home-version-2 {
  --color-bg-splash: #1b223c;
  --color-bg-splash-contrast: #233575;
  --gutter-columns: 4;
  --content-columns: 12;
  --row-height: 64px;
  --content-column-width: minmax(0, calc(1200px / var(--content-columns)));
  --gutter-column-width: var(--content-column-width);
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    width: 100%;
    &.wide {
      max-width: 1200px;
    }
  }

  // Header
  .header {
    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(
        35deg,
        var(--color-bg-splash) 70%,
        var(--color-bg-splash-contrast)
      );
      transform: translateY(-4rem);
      perspective: 1000px;

      .grid {
        backface-visibility: none;
        opacity: 0.5;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: rotateY(30deg) translateX(10rem) rotate(2deg) rotateX(34deg);
        display: grid;
        grid-template-rows: repeat(auto-fill, var(--row-height));
        grid-template-columns:
          [viewport-start] 1fr [left-gutter-start] repeat(
            var(--gutter-columns),
            var(--gutter-column-width)
          )
          [left-gutter-end content-start] repeat(
            var(--content-columns),
            var(--content-column-width)
          )
          [content-end right-gutter-start] repeat(
            var(--gutter-columns),
            var(--gutter-column-width)
          )
          [right-gutter-end] 1fr [viewport-end];

        grid-auto-rows: 1fr;
        .row {
          border-radius: 5px;
          &:first-child {
            background-color: var(--color-bg-splash-contrast);
            grid-column: ~"16 / 17";
            grid-row: ~"-3 / -4";
          }
          &:nth-child(2) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"4/5";
            grid-row: ~"-6/-5";
            opacity: 0.4;
          }
          &:nth-child(3) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"6/7";
            grid-row: ~"-4/-5";
            opacity: 0.4;
          }
          &:nth-child(4) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"12/13";
            grid-row: ~"-1/-2";
          }
          &:nth-child(5) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"6/7";
            grid-row: ~"1/2";
          }
          &:nth-child(6) {
            background-color: #ff0076;

            grid-column: ~"10/11";
            grid-row: ~"-4/-5";
          }
          &:nth-child(8) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"14 / 15";
            grid-row: ~"-2 / -3";
          }
          &:nth-child(9) {
            background-color: var(--color-bg-splash-contrast);
            grid-column: ~"6/7";
            grid-row: ~"-2/-3";
          }
          &:nth-child(10) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"13 / 14";
            grid-row: ~"-6 / -7";
          }
          &:nth-child(11) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"11 / 12";
            grid-row: ~"-7 / -8";
          }
          &:nth-child(11) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"3 / 4";
            grid-row: ~"-2 / -3";
          }
          &:nth-child(12) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"5 / 6";
            grid-row: ~"3 / 4";
          }
          &:nth-child(13) {
            background-color: var(--color-bg-splash-contrast);

            grid-column: ~"9 / 10";
            grid-row: ~"4 / 5";
          }
        }
      }
    }
    position: relative;
    z-index: 0;
    padding: 8rem 0 14rem;

    color: #fff;
    @media (max-width: 900px) {
      padding: 5rem 0 9rem;
    }

    .content-pad {
      // opacity: 0.1;
      z-index: 1;
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 4rem;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        .header-figure {
          min-width: 0;
        }
      }
    }

    .header-text {
      flex: 1;
      min-width: 520px;
      text-shadow: 0 1px 1px rgba(20, 20, 25, 0.7);
      @media (max-width: 900px) {
        min-width: 320px;
        margin: 0 0 40px;
      }
      .header-tag {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 32px;
        opacity: 0.4;
        .icon {
          display: none;
        }
        .header-icon-text {
          font-size: 1.2em;

          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
      }
      .title {
        font-size: 3em;
        line-height: 1.1;

        margin: 0 0 0.5em;
        letter-spacing: -0.02em;
        font-weight: 600;
      }

      .text {
        font-size: 1.5em;
        line-height: 1.5;
        opacity: 0.8;
      }
      .header-actions {
        font-size: 1.1em;
        margin-top: 2em;
        // display: grid;
        // grid-template-columns: 1fr 200px;
        // grid-gap: 1.5em;
        .email-list-form {
          font-size: 1.2em;
          input {
            margin: 0;

            background: #fff;
          }
        }
      }

      @media (max-width: 900px) {
        font-size: 1em;
        .title {
          font-size: 2em;
          .alt {
            display: block;
          }
        }
        .text {
          font-size: 1.2em;
          line-height: 1.5;
          opacity: 0.8;
        }
        .header-tag {
          opacity: 0.4;
          .icon {
            display: none;
          }
        }
      }
    }

    .header-figure {
      figure.screencast {
        width: 800px;
        background: #fff;
        padding-top: 56.25%;
        padding-top: calc(9 / 16 * 100%);
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1),
          0 15px 35px rgba(0, 0, 0, 0.1), 0 50px 100px rgba(50, 50, 93, 0.1);
        background: #f6f9fc url(./img/screencast-poster.jpg) 50%/100%;
        background-size: cover;
        transition: opacity 0.2s;
        @media (max-width: 900px) {
          width: 100%;
        }
        &:hover {
          cursor: pointer;
          .play-button {
            opacity: 0.8;
          }
        }
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
          transition: opacity 0.2s;
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

  // BENEFITS

  .benefits {
    margin: -7rem 1rem 0;
    background: url("./img/dot.svg");
    .content-pad {
      z-index: 100;
      position: relative;
      border-radius: 7px;
      box-shadow: var(--box-shadow-panel);
      background: #fff;
      padding: 2rem 2.5rem;
      display: grid;
      grid-gap: 0 2em;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(1, 1fr);

      .benefit {
        max-width: 500px;
        font-size: 1.1em;
        .feature-icon svg {
          width: 3rem;
          margin-bottom: 0.75rem;
        }
        .title {
          font-size: 1.1em;
        }
        .text {
          font-weight: 400;
          opacity: 0.7;
          margin: 1rem 0;
        }
      }
    }
    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, auto);
        grid-gap: 2em 0;
        padding: 1rem;
      }
    }
  }

  .features {
    &.content {
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
    }
    .split-feature {
      min-height: 90vh;

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
        padding: 10rem 0;
      }
      .feature-figure-container {
        grid-area: b;
        position: relative;
        height: 100%;
      }
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-template-areas: "a" "b";
        &.odd {
          grid-template-areas: "a" "b";
        }
        .feature-content-container {
          padding: 0;
          .feature-content {
            padding: 5rem 0 1rem;
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
      max-width: 500px;
      .bullets {
        margin: 2rem 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        .bullet {
          font-weight: 600;
          display: flex;
          .bullet-text {
            opacity: 0.7;
          }
          .bullet-icon {
            background: #ff0076;
            border-radius: 50%;

            width: 1.5rem;
            height: 1.5rem;
            display: inline-block;
            text-align: center;
            margin-right: 0.5rem;
          }
        }
      }
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
      margin-top: 2rem;
    }
  }

  .compare {
    background-color: var(--color-bg-alt);
    background-image: linear-gradient(var(--color-bg-alt) 90%, #eff6ff);

    box-shadow: inset 0px -1px 1px #c3dcfd;
    padding: 10rem 0;
    .mast-head {
      text-align: center;
      line-height: 1.1;
      font-size: 1.8em;
      letter-spacing: -0.02em;
      .title {
        font-weight: 600;
      }
      .sub-title {
        margin: 0.5em 0;
        opacity: 0.7;
      }
      margin-bottom: 3em;
      @media (max-width: 900px) {
        text-align: left;
      }
    }
    .feature-table {
      display: grid;
      grid-template-columns: 10rem 1fr 1fr 1fr;
      grid-gap: 1rem;

      .column {
        text-align: center;
        background: #fff;

        border-radius: 6px;
        overflow: hidden;

        &.label {
          box-shadow: none;
          background: none;
          text-align: right;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--color-primary);
          z-index: 0;
          margin-right: -1em;

          .has-content {
            background: #fff;
          }
        }

        &.data {
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 35px 0 rgba(23, 55, 87, 0.1),
            0 5px 15px 0 rgba(0, 0, 0, 0.07);
          transition: 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
          .row {
            border-bottom: 1px solid #eee;
            transition: 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

            &:last-child {
              border: none;
            }
          }
          .row:first-child {
            font-size: 1.2em;
            background: var(--color-bg-splash);
            color: #fff;
            font-weight: 700;
          }
          .footer-row {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            //padding: 8px 10px;
            height: 56px;
            transform: translateY(50%);
            opacity: 0;
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
              0 30px 60px -30px rgba(0, 0, 0, 0.3),
              0 -18px 60px -10px rgba(0, 0, 0, 0.025);
            .row:nth-last-child(2) {
              padding-bottom: 4em;
            }
            .footer-row {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      }

      .row {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 140px;
        padding: 1em 2em;
        &:nth-child(1) {
          height: 100px;
        }
      }
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        .row {
          height: 100px;
        }
        .column {
          text-align: left;
          &:nth-child(1) {
            display: none;
          }
          &.data {
            .footer-row {
              position: relative;
              opacity: 1;
              transform: none;
            }
          }
        }
      }
    }
  }

  .alpha-program {
    text-align: center;
    padding: 7rem 0 4em;
    .content-pad {
      max-width: 750px;
    }
    .glyph {
      color: var(--color-primary);

      width: 100px;
      height: 100px;
      line-height: 100px;
      font-size: 3.5em;

      border-radius: 50%;
      margin: 1rem auto;
    }
    .title {
      font-size: 3em;
      line-height: 1.1;
    }
    .sub-title {
      font-size: 2em;
      opacity: 0.8;
      font-weight: 400;
      line-height: 1.1;
      margin: 1em 0;
      // color: var(--color-primary);
    }
    .text,
    .action {
      font-size: 1.3em;
    }
    .text {
      margin: 2rem 0;
      font-weight: 400;
    }
    .action {
      font-weight: 600;
    }
    .email-list-form {
      input {
        background: #fff;
      }
      max-width: 500px;
      margin: 0 auto;
    }

    @media (max-width: 900px) {
      text-align: left;
      .glyph {
        margin: 0;
      }
    }
  }
}
</style>
