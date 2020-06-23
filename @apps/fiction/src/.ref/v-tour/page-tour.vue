<template>
  <div class="view-tour">
    <section class="splash-wrap stark-bg skew-bg">
      <div class="stark-bg-image unskew-bg">
        <div class="splash content-pad">
          <div class="content-width">
            <div class="label label-blue">COMING Q1 2020</div>
            <h1 class="title" role="textbox">
              Factor CMS Platform
              <span class="alt">A Reactive CMS Platform for Typescript.</span>
            </h1>
            <p class="subtitle">Build sites, blogs or full-stack apps in hours not months</p>
            <div class="action">
              <factor-email-list list-id="alphaProgram" />
            </div>
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>
    <div class="banner-wrap">
      <div class="content-pad">
        <div class="banner content-width">
          <div class="banner-content">
            <el-svg icon="fast-clock" color="#ff0076" />
            <h2 class="title">5 Minute Setup</h2>
            <p>
              Get started in 5 minutes. A Factor site can be installed and up and running
              in a matter of minutes, with only basic coding knowledge.
            </p>
            <div class="actions">
              <factor-link path="https://factor.dev/docs/installation">Learn How &rarr;</factor-link>
            </div>
          </div>
          <div class="banner-figure">
            <strong>Install Factor</strong>
            <pre><code class="language-html">npm add  @factor/post</code></pre>
            <br />
            <strong>Or use the "Starter Kit"</strong>
            <pre><code class="language-html">yarn create-factor-app</code></pre>
          </div>
        </div>
      </div>
    </div>

    <section class="features-wrap">
      <div class="content-pad">
        <div
          v-for="(feature, i) in features"
          :key="i"
          class="feature"
          :class="[i % 2 == 0 ? 'odd' : 'even', feature.figure]"
        >
          <div class="feature-wrap">
            <div class="feature-content-container">
              <div class="feature-content">
                <el-svg
                  v-if="feature.icon"
                  :icon="feature.icon"
                  :color="feature.iconColor || `#ff0076`"
                />
                <h2 v-formatted-text="feature.title" class="title" />
                <p>{{ feature.text }}</p>
                <div v-if="feature.link" class="actions">
                  <factor-link :path="feature.link.path">
                    <span v-formatted-text="feature.link.text || `Go &rarr;`" />
                  </factor-link>
                </div>
              </div>
            </div>
            <div class="feature-figure-container">
              <figure v-if="feature.figure" class="figure">
                <template v-if="feature.figure == 'extension'">
                  <img
                    class="img-modular"
                    :src="require(`./img/modular.svg`)"
                    alt="Factor - Modular"
                  />
                </template>
                <template v-if="feature.figure == 'ssr'">
                  <img :src="require(`./img/ssr.svg`)" alt="Factor - Serverless and SSR" />
                </template>
                <template v-else-if="feature.figure == 'hello'">
                  <pre><code class="javascript"><span>var</span> app = new <span class="a">Factor</span>({
  <span>el</span>: '#app',
  <span>data</span>: {
    message: 'Hello Factor!'
  }
})</code></pre>
                </template>
                <template v-else-if="feature.figure == 'plugins'">
                  <img
                    class="flexible"
                    :src="require(`./img/flexible.png`)"
                    alt="Factor - Infinite Possibilities"
                  />
                </template>
                <template v-else-if="feature.figure == 'markdown'">
                  <img :src="require(`./img/markdown-editor.svg`)" alt="Factor - Markdown Editor" />
                </template>
                <template v-else-if="feature.figure == 'power'">
                  <img :src="require(`./img/themes-plugins.svg`)" alt="Factor - Themes and Plugins" />
                </template>
                <template v-if="feature.figure == 'roles'">
                  <img
                    :src="require(`./img/user-roles.svg`)"
                    alt="Factor - User Roles and Permissions"
                  />
                </template>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-wrap">
      <div class="content-pad">
        <div class="content-width">
          <div class="testimonial">
            <figure>
              <span />
            </figure>
            <blockquote>
              <p>
                We chose the Factor TS platform (built with VueJS, MongoDB) for the new
                company app and it's been an awesome experience guys. Incredible work
                @fictiondotcom! 🚀
              </p>
              <div class="attribution">
                <div class="cite">Matt Walsh</div>
                <factor-link path="#" target="_blank" @click.prevent>Relic Apps Ltd.</factor-link>
              </div>
            </blockquote>
          </div>
          <div class="cta">
            <div>
              <h3 class="title">
                Ready to launch an impressive web app?
                <span class="alt">
                  We're currently inviting developers to participate in alpha/beta
                  testing.
                </span>
              </h3>
            </div>
            <div class="actions">
              <factor-email-list list-id="alphaProgram" />
            </div>
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>
  </div>
</template>

<script lang="ts">
import { factorEmailList } from "@factor/plugin-email-list"
import { factorLink } from "@factor/ui"

export default {
  components: {
    factorLink,
    factorEmailList,
    "el-svg": () => import("../el/el-svg.vue"),
  },
  data() {
    return {
      loading: true,
      features: [
        {
          title: `There's a Plugin for that...`,
          text: `Customize your project by including only the code you need. Using Factor
              means avoiding code bloat, reusable elements, and faster development.`,
          figure: `extension`,
          link: {
            path: `https://factor.dev/plugins`,
            text: `See Plugins &rarr;`,
          },
          icon: `puzzle`,
        },
        {
          title: `Built for Marketing, SEO and Social`,
          text: `Build apps that handle production-ready traffic without worrying about
              server administration or scaling and make your idea live fast. Focus your
              efforts on what provides value to your users.`,

          icon: `wrench`,
          figure: "ssr",
        },
        {
          title: `Built on the Shoulders of (<i>Open-Source</i>) Giants`,
          text: `Factor Platform is built on time-tested open source technologies.
            Stop worrying about lock-in and immature tech. Stop reading technical documentation endlessly and trust the stack.`,

          icon: `vue`,
          figure: "hello",
        },
        {
          title: `The Future of Themes`,
          text: `Themes and plugins integrate seamlessly when you add them to your app. Fast
              development without complex configurations.`,

          icon: `themes`,
          figure: "plugins",
        },
        {
          title: `Manage Users with Roles`,
          text: `You can add other users to access your site admin interface. To protect your
              sensitive information or restrict the actions they can perform, user roles
              limit their access. Each user is assigned a role when they are added.`,

          icon: `user`,
          figure: "roles",
        },
        {
          title: `Simple Content Editing with Markdown`,
          text: `The Markdown editor provides a great writing experience with simple
              formatting. It also saves time over hand-crafted HTML tags, and it’s faster
              than using a WYSIWYG.`,

          icon: `markdown`,
          figure: "markdown",
        },
        {
          title: `Absolute Power Corrupts Absolutely, Enjoy...`,
          text: `What could you accomplish if you didn't have to spend time debugging, rewriting, refactoring and researching?
                Factor at its heart is simple and extremely flexible. Use Factor core and
                customize it to accomplish whatever you can think of...`,

          icon: `infinite`,
          figure: "power",
        },
      ],
    }
  },
  routeClass() {
    return "nav-white"
  },
  metaInfo() {
    return {
      title: "Factor Typescript CMS - Application Framework of the Future",
      description:
        "Build server-rendered web applications that stun your friends and followers with Factor JS Universal VueJS platform.",
    }
  },
}
</script>
<style lang="less">
.view-tour {
  font-weight: 400;
  --color-bg-splash: #1b223c;
  --color-bg-splash-contrast: #233575;
  --color-bg-contast: #f5f8fc;
  --color-text-splash: #949cb8;

  .email-list-form {
    font-size: 1.3em;
    max-width: 600px;
    margin: 0 auto;
  }
  .content-pad {
    line-height: 1.2;

    font-size: 1.2em;
    .content-width {
      max-width: 1200px;
      margin: 0 auto;
    }
    .title {
      font-size: 1.2em;
      line-height: 1.4;
      margin: 0.5em 0;
      font-weight: 600;
    }
    p {
      line-height: 1.6em;
      opacity: 0.8;
    }
    .actions {
      margin-top: 1em;
    }
    img {
      width: 100%;
      margin: 0 auto;
    }
    @media (max-width: 900px) {
      font-size: 1em;
      .title {
        font-size: 1.1em;
        .alt {
          display: block;
        }
      }
    }
  }

  .skew-bg {
    // transform: translateY(-5em) skewY(-4deg);
    // .unskew-bg {
    //   transform: skewY(4deg) scale(0.8);
    // }
  }

  .stark-bg {
    background-image: linear-gradient(
      35deg,
      var(--color-bg-splash) 70%,
      var(--color-bg-splash-contrast)
    );
    color: #fff;
    .stark-bg-image {
      background-image: url(./img/rectangles.svg);
      background-repeat: no-repeat;
      background-size: 80%;
      @media (max-width: 900px) {
        background-size: 100%;
      }
    }
  }

  .hhh {
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5em;
    height: 5em;
    background-color: #fff;
    background-image: linear-gradient(15deg, #fff, var(--color-bg-contast) 90%);
  }

  .stripes-wrap {
    position: relative;
    .stripes {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      top: 0;
      transform: skewY(-5deg);
      background: #fff;
    }
    .content-pad {
      position: relative;
    }
  }

  .svg-wrap {
    display: inline-block;
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    svg {
      min-height: 2.5em;
      min-width: 2.5em;
    }
  }

  pre {
    font-size: 1em;
    text-align: left;
    background: #1b223c;
    margin-top: 1em;
    border-radius: 4px;

    code {
      overflow-x: auto;
      opacity: 0.7;
      color: #fff;
      white-space: pre;
      padding: 1.4em;
      line-height: 1.5em;

      display: block;
    }
  }

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    &.label-blue {
      color: var(--color-primary);
    }
  }

  .splash-wrap {
    position: relative;

    .splash {
      position: relative;
      z-index: 1;

      text-align: center;
      max-width: 800px;
      margin: 0 auto;
      padding: 7em 0 10em;
      @media (max-width: 900px) {
        padding: 6em 2em 15em;
        text-align: left;
      }
      .title {
        font-size: 2.5em;
        letter-spacing: -0.03em;
        line-height: 1.3;
        margin: 0.3em 0;
        color: var(--color-light);
        .alt {
          display: block;
          opacity: 0.75;
          font-size: 0.9em;
        }
        @media (max-width: 900px) {
          font-size: 1.8em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        line-height: 1.6em;

        margin-bottom: 1.5em;
        color: var(--color-text-splash);

        @media (max-width: 900px) {
          font-size: 1.2em;
        }
      }
    }
  }

  .banner-wrap {
    position: relative;
    margin-top: -140px;
    z-index: 60;
    .banner {
      padding: 2em 0;

      box-shadow: var(--box-shadow-panel);
      background: #fff;
      border-radius: 5px;
      padding-right: 3em;
      padding-left: 3em;
      display: grid;
      grid-gap: 4em;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 900px) {
      .banner {
        grid-template-columns: 1fr;
        padding: 1em;
        border-radius: 0;
      }
      margin-top: -170px;
    }
  }

  .features-wrap {
    // &.stripes-wrap {
    //   background-image: linear-gradient(
    //     35deg,
    //     var(--color-bg-splash) 70%,
    //     var(--color-bg-splash-contrast)
    //   );
    //   color: #fff;
    // }
    overflow-x: hidden;
    overflow: visible;
    .feature {
      overflow-x: visible;
      .feature-wrap {
        position: relative;
        z-index: 1;
        min-height: 90vh;
        display: grid;
        grid-column-gap: 4rem;
        grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr);
        grid-template-areas: "a b";
        align-items: center;
      }
      @media (max-width: 900px) {
      }

      .figure {
        display: flex;
        padding: 3em 0;
        width: 100%;
        @media (max-width: 900px) {
          padding: 2em;
          max-width: 600px;
        }
      }
      &.even {
        .feature-content-container {
          justify-self: flex-end;
        }
      }
      &.odd {
        background-color: #fff;
        background-image: linear-gradient(45deg, var(--color-bg-contast), #fff 90%);
        transform: skewY(-3deg);
        .feature-wrap {
          grid-template-areas: "b a";
          transform: skewY(3deg);
        }
        .feature-figure-container {
          min-width: 0;
          width: 100%;
          justify-self: flex-end;
          figure {
            justify-content: flex-end;
          }
        }
        &.power {
          @media (min-width: 900px) {
            .feature-content-container {
              padding-bottom: 12em;
            }
          }
        }
        &.hello {
          transform: skewY(0);
          background-image: url("./img/dot.svg");
          .feature-wrap {
            transform: skewY(0);
            background: #fff;
            max-width: 1100px;
            margin: 0 auto;
            padding: 3em;
            min-height: auto;
            box-shadow: var(--box-shadow-panel);
            @media (max-width: 900px) {
              padding: 3em 1em;
              overflow: hidden;
            }
          }
          .feature-content-container {
            padding: 0;
          }
          .feature-content {
            padding: 0;
          }
          pre {
            overflow: inherit;
            background: white;
            transform: scale(1) perspective(1040px) rotateY(11deg) rotateX(2deg)
              rotate(-2deg) translateZ(-40px);
            box-shadow: -1px 1px 4px 0 rgba(26, 26, 67, 0.1),
              -9px 25.5px 15px -25px rgba(50, 50, 93, 0.3),
              -10.4px 25.5px 75px -37.5px rgba(0, 0, 0, 0.3);
            code {
              color: var(--color-text);
              font-size: 1.6em;
              span {
                color: #ff0076;
                &.a {
                  color: #0496ff;
                }
              }
              @media (max-width: 900px) {
                font-size: 1.4em;
              }
            }
          }
        }
      }
      .feature-content-container {
        grid-area: a;
        padding: 6rem 0;
      }
      .feature-figure-container {
        grid-area: b;
        position: relative;
      }
      .feature-content {
        max-width: 500px;
        padding: 4em 1em;
        font-size: 1.3em;
      }

      @media (max-width: 900px) {
        .feature-wrap {
          grid-template-columns: 1fr;
          grid-template-areas: "a" "b";
        }

        &.odd {
          .feature-wrap {
            grid-template-areas: "a" "b";
          }
        }
        .feature-content-container {
          padding: 0;
          .feature-content {
            padding: 5rem 1em 1rem;
            max-width: 100%;
          }
        }
        .feature-figure-container {
          justify-content: center;
          .figure {
            justify-content: flex-start;
          }
        }
      }
      perspective: 1000px;
    }
  }

  .testimonial {
    margin: -10em 0 5em;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    background: #233575;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
      0 18px 36px -18px rgba(0, 0, 0, 0.3);
    z-index: 10;
    figure {
      height: 100%;
      position: absolute;
      overflow: hidden;
      z-index: 2;
      right: -40px;
      top: 0;
      left: calc(50% + 100px);

      transform: skewX(-8deg);

      @media (max-width: 900px) {
        position: relative;
        height: 200px;
        background: #525f7f;
        overflow: hidden;
        right: 0;
        top: 0;
        left: 0;
        -webkit-transform: skewX(0);
        transform: skewX(0);
      }
      span {
        display: block;
        position: absolute;
        background-image: url(./img/testimonial.jpg);
        background-size: cover;
        background-position: center center;
        height: 100%;
        right: 30px;
        top: 0;
        bottom: 0;
        left: -110px;

        transform: skewX(8deg);

        @media (max-width: 900px) {
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-position: 50%;
          background-size: cover;
          -webkit-transform: skewX(0);
          transform: skewX(0);
        }
      }
    }
    blockquote {
      width: 50%;
      background-image: url(./img/left-quote.svg);
      background-repeat: no-repeat;
      background-position: 3em 3em;
      background-size: 25px 25px;
      padding: 5em 3em 3em;
      @media (max-width: 900px) {
        background-position: 2em 2em;
        width: 100%;
        padding: 4em 2em 2em;
      }
      p {
        font-size: 1.3em;
        line-height: 1.6;
      }
      .attribution {
        margin-top: 2em;
        font-weight: 500;
        a {
          color: inherit;
          opacity: 0.5;
        }
      }
    }
  }

  .cta-wrap {
    transform: skewY(-3deg);
    padding: 8em 1em;
    color: var(--color-light);
    background: #1b223c url(./img/rectangles.svg) no-repeat center center;
    background-size: 80%;

    .content-pad {
      transform: skewY(3deg);
    }
    .cta {
      margin: 0 auto;
      max-width: 600px;
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      text-align: center;
      @media (max-width: 900px) {
        text-align: left;
        grid-template-columns: 1fr;
      }
      .title {
        font-weight: 600;
        font-size: 1.6em;
        letter-spacing: -0.03em;
        line-height: 1.4em;
        margin-bottom: 0.2em;
        .alt {
          opacity: 0.7;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.2em;
        line-height: 1.6em;
        font-weight: 400;
      }
      .actions {
        margin-top: 2em;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (max-width: 900px) {
          display: block;
          margin-top: 1.5em;
          a {
            display: inline-block;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
