<template>
  <div class="page-tour">
    <section class="splash-wrap">
      <div class="splash mast">
        <div>
          <div class="label label-blue">factor Arrives q3 2019</div>
          <h1 class="title">Built for Perfectionists</h1>
          <p
            class="subtitle"
          >A modern framework based on Vue.js that helps developers code better and ship faster.</p>
          <!-- <app-link btn="primary" size="large" path="https://factor.dev/guide/">
            Get Started
            <factor-icon icon="arrow-right" />
          </app-link>-->
        </div>
      </div>
    </section>

    <section class="items-wrap">
      <div class="mast">
        <div class="item cols-2 banner">
          <div>
            <el-svg icon="fast-clock" color="#506677" />
            <h2 class="title">5 Minute Setup</h2>
            <p>Get started in 5 minutes. A Factor site can be installed and up and running in a matter of minutes, with only basic coding knowledge.</p>
            <div class="actions">
              <factor-link path="https://factor.dev/guide/quickstart">
                Learn How
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <div>
            <strong>Install Factor</strong>
            <pre><code class="language-html">yarn add @factor/post</code></pre>
            <br >
            <strong>Or use the "Starter Kit"</strong>
            <pre><code class="language-html">yarn create-factor-app</code></pre>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="puzzle" color="#506677" />
            <h2 class="title">Modular</h2>
            <p>Customize your project by including only the code you need. Using Factor means avoiding code bloat, reusable elements, and faster development.</p>
            <div class="actions">
              <factor-link path="https://factor.dev/plugins">
                Get Plugins
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <figure class="figure">
            <img class="img-modular" :src="require(`./modular.svg`)" alt="Factor - Modular" >
          </figure>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="serverless" color="#506677" />
            <h2 class="title">Server Rendered</h2>
            <p>Build apps that handle production-ready traffic without worrying about server administration or scaling and make your idea live fast. Focus your efforts on what provides value to your users.</p>
          </div>
          <div>
            <figure class="figure">
              <img :src="require(`./ssr.svg`)" alt="Factor - Serverless and SSR" >
            </figure>
          </div>
        </div>
      </div>
    </section>
    <section class="items-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast">
        <div class="item cols-1">
          <div>
            <el-svg icon="vue" color="#506677" />
            <h2 class="title">Best of Breed Tools</h2>
            <p>We've spent years learning best practices and making mistakes so you don't have to...</p>
            <div class="actions">
      <factor-link path="https://factor.dev/guide">
                More About The Tech
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <div>
            <pre><code class="javascript">var app = new Factor({
  el: '#app',
  data: {
    message: 'Hello Factor!'
  }
})</code></pre>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="themes" color="#506677" />
            <h2 class="title">Themes &amp; Plugins</h2>
            <p>Themes and plugins integrate seamlessly when you add them to your app. Fast development without complex configurations.</p>
          </div>
          <div>
            <figure class="figure">
              <img :src="require(`./themes-plugins.svg`)" alt="Factor - Themes and Plugins" >
            </figure>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="user" color="#506677" />
            <h2 class="title">User Roles &amp; Permissions</h2>
            <p>You can add other users to access your site admin interface. To protect your sensitive information or restrict the actions they can perform, user roles limit their access. Each user is assigned a role when they are added.</p>
          </div>
          <div>
            <figure class="figure">
              <img :src="require(`./user-roles.svg`)" alt="Factor - User Roles and Permissions" >
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section class="items-wrap">
      <div class="stripes" />
      <div class="mast">
        <div class="item cols-2">
          <div>
            <el-svg icon="markdown" color="#506677" />
            <h2 class="title">Markdown Editor</h2>
            <p>The Markdown editor provides a great writing experience with simple formatting. It also saves time over hand-crafted HTML tags, and it’s faster than using a WYSIWYG.</p>
          </div>
          <div>
            <figure class="figure">
              <img :src="require(`./markdown-editor.svg`)" alt="Factor - Markdown Editor" >
            </figure>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="infinite" color="#506677" />
            <h2 class="title">Infinite Possibilities</h2>
            <p>Factor at its heart is simple and extremely flexible. Use Factor core and customize it to accomplish whatever you can think of...</p>
          </div>
          <div>
            <figure class="figure">
              <img
                class="flexible"
                :src="require(`./flexible.png`)"
                alt="Factor - Infinite Possibilities"
              >
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section class="items-wrap">
      <div class="mast">
        <div class="testimonial">
          <figure>
            <span />
          </figure>
          <blockquote>
            <p>Before I used Factor, I was struggling to build stable Javascript apps without months of frustration. The key is that this framework gives me all the structure I need to build modern apps fast.</p>
            <footer>
              <cite>Marcus W.</cite>
              New York, NY
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <section class="cta-wrap">
      <div class="mast">
        <div class="cta">
          <div>
            <h3 class="title">Ready to Start Building?</h3>
            <p class="subtitle">Get in touch or create an account</p>
          </div>
          <div class="actions">
            <app-btn path="https://docs.fiction.com/getting-started" btn="primary" size="large">
              Quick Start
              <i class="fa fa-arrow-right" />
            </app-btn>
            <app-btn path="/contact" btn="default" size="large">Contact Us</app-btn>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "el-svg": () => import("../el/el-svg")
  },
  data() {
    return {
      loading: true,
      title: "some title"
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "How Factor Works",
      description: "",
      image: ""
    }
  }
}
</script>
<style lang="less">
.nav-light {
  .site-head {
    background: #1b223c;
    .logo-img .thelogotext {
      fill: #f7f7f7;
    }
    .mobile-logo .logo-img .thelogotext {
      fill: initial;
    }

    .nav > a {
      color: #f7f7f7;
      @media (max-width: 767px) {
        color: initial;
      }
    }
  }
}
.page-tour {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1200px;
    margin: 0 auto;
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
    .mast {
      position: relative;
    }
  }

  .svg-wrap {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    svg {
      min-height: 40px;
    }
  }

  pre {
    font-size: 0.8em;
    text-align: left;
    background: #1b223c;
    margin-top: 1em;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(50, 50, 93, 0.11),
      0 20px 125px -30px rgba(80, 102, 119, 0.5),
      0 50px 65px -47.5px rgba(0, 0, 0, 0.3);
    code {
      overflow-x: auto;
      opacity: 0.7;
      color: #fff;
      white-space: pre;
      padding: 1.4em;
      line-height: 1.5em;
      font-size: 1.2em;
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
    background: #1b223c url(./rectangles.svg) no-repeat center center;
    background-size: 80%;
    @media (max-width: 767px) {
      background-size: 100%;
    }
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: center;
      max-width: 550px;
      padding: 8em 0 5em;
      @media (max-width: 767px) {
        padding: 6em 2em 4em;
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 1;
        margin: 0.3em 0;
        color: #f9f9f9;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.4em;
        font-weight: 400;
        margin-bottom: 1.5em;
        color: #d9d9d9;

        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
    }
  }

  .items-wrap {
    padding: 2em 0;
    .item {
      display: grid;
      grid-gap: 6em;
      align-items: center;
      padding: 3em 0;
      &.banner {
        margin: 0 auto;
        box-shadow: var(--panel-shadow);
        background: #fff;
        border-radius: 5px;
        padding: 3em;
      }
      &.cols-1 {
        grid-template-columns: 1fr;
        justify-content: center;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      }
      &.cols-2 {
        grid-template-columns: 1fr 1fr;
      }

      @media (max-width: 767px) {
        &.cols-1,
        &.cols-2 {
          grid-template-columns: 1fr;
          grid-gap: 2em;
          padding: 2em;
          text-align: left;
        }
      }

      &:nth-child(2n + 2) {
        direction: rtl; //reverse even items order
        > div {
          direction: ltr;
        }
      }

      .title {
        font-size: 1.6em;
        line-height: 1;
        margin: 0.5em 0;
        font-weight: var(--font-weight-bold);
      }
      p {
        font-size: 1.2em;
        line-height: 1.6em;
        opacity: 0.5;
      }
      .actions {
        margin-top: 1em;
        a {
          font-size: 1.2em;
        }
      }

      .figure {
        display: grid;
        justify-content: center;
        padding: 3em 0;
      }

      img {
        max-width: 100%;
        margin: 0 auto;
        &.flexible {
          max-width: 140%;
          transform: translateX(-30%);
          @media (max-width: 767px) {
            transform: translateX(-18%);
          }
        }
      }
    }
  }

  .testimonial {
    position: relative;
    overflow: hidden;
    margin: 2em 0;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
      0 18px 36px -18px rgba(0, 0, 0, 0.3);
    figure {
      height: 100%;
      position: absolute;
      overflow: hidden;
      z-index: 2;
      right: -30px;
      top: 0;
      left: calc(50% + 100px);
      -webkit-transform: skewX(12deg);
      transform: skewX(12deg);

      @media (max-width: 767px) {
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
        background-image: url(./testimonial.jpg);
        background-size: cover;
        background-position: center center;
        height: 100%;
        right: 30px;
        top: 0;
        bottom: 0;
        left: -110px;
        -webkit-transform: skewX(-12deg);
        transform: skewX(-12deg);

        @media (max-width: 767px) {
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
      background: #fff url(./left-quote.svg) no-repeat 3em 3em;
      background-size: 25px 25px;
      padding: 5em 3em 3em;
      @media (max-width: 767px) {
        background-position: 2em 2em;
        width: 100%;
        padding: 4em 2em 2em;
      }
      p {
        font-size: 1.2em;
        line-height: 1.6em;
        opacity: 0.6;
      }
      cite {
        display: block;
        margin-top: 1em;
      }
    }
  }

  .cta-wrap {
    padding: 3em 0;
    .cta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 60px;
      @media (max-width: 767px) {
        text-align: center;
        grid-template-columns: 1fr;
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 2.6em;
        letter-spacing: -0.03em;
        line-height: 1.2em;
        margin-bottom: 0.2em;
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.4em;
        font-weight: 500;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .app-btn + .app-btn {
          margin-left: 1em;
        }
        @media (max-width: 767px) {
          display: block;
          margin-top: 1.5em;
          a {
            display: inline-block;
            margin-bottom: 10px;
          }
          .app-btn + .app-btn {
            margin-left: 0.5em;
          }
        }
      }
    }
  }
}
</style>