<template>
  <div class="how-it-works">
    <section class="splash-wrap">
      <div class="splash mast">
        <div>
          <h1 class="title">How Factor Works</h1>
          <p
            class="subtitle"
          >Factor enables developers and content creators to do their best work, together and faster.</p>
        </div>
      </div>
    </section>

    <section class="items-wrap">
      <div class="mast">
        <div class="item cols-2">
          <div>
            <el-svg icon="fast-clock" color="#506677" />
            <h2 class="title">5 Minute Setup</h2>
            <p>Get started in 5 minutes. A Factor site can be installed and up and running in a matter of minutes, with only basic coding knowledge.</p>
            <div class="actions">
              <factor-link path="/docs">
                Learn How
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <div>
            <strong>Install with NPM</strong>
            <pre><code class="language-html">npm install @factor</code></pre>
            <strong>Install with YARN</strong>
            <pre><code class="language-html">yarn add @factor</code></pre>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="puzzle" color="#506677" />
            <h2 class="title">Modular</h2>
            <p>Customize your project by including only the code you need. Using Factor means avoiding code bloat, reusable elements, and faster development.</p>
            <div class="actions">
              <factor-link path="/plugins">
                Get Plugins
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <figure class="figure">
            <img class="img-modular" :src="require(`./img/modular.svg`)" alt="Factor - Modular">
          </figure>
        </div>
      </div>
    </section>
    <section class="items-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast">
        <div class="item cols-1">
          <div>
            <el-svg icon="vue" color="#506677" />
            <h2 class="title">Build with Vue.js</h2>
            <p>Customize your front-end layout with vue.js components</p>
            <div class="actions">
              <factor-link path="/docs">
                Explore the docs
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <figure>
            <pre><code class="javascript">
<!-- <template>
  <p>{{ greeting }} Factor!</p>
</template>

<script>
module.exports = {
  data: function () {
    return {
      greeting: 'Hello'
    }
  }
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style> -->
var app = new Factor({
  el: '#app',
  data: {
    message: 'Hello Factor!'
  }
})
          </code></pre>
          </figure>
        </div>
      </div>
    </section>
    <section class="items-wrap">
      <div class="mast">
        <div class="item cols-2">
          <div>
            <el-svg icon="markdown" color="#506677" />
            <h2 class="title">Markdown Editor</h2>
            <p>The Markdown editor provides a great writing experience with simple formatting. It also saves time over hand-crafted HTML tags, and it’s faster than using a WYSIWYG.</p>
          </div>
          <div>
            <div class="bg-rect-right">
              <img
                class="img-markdown"
                :src="require(`./img/markdown-editor.png`)"
                alt="Factor - Markdown"
              >
            </div>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="user" color="#506677" />
            <h2 class="title">User Roles &amp; Permissions</h2>
            <p>You can add other users to access your site admin interface. To protect your sensitive information or restrict the actions they can perform, user roles limit their access. Each user is assigned a role when they are added.</p>
          </div>
          <div>
            <div class="bg-rect-right figure">
              <img
                class="img-user-roles"
                :src="require(`./img/user-roles.svg`)"
                alt="Factor - User Roles and Permissions"
              >
            </div>
          </div>
        </div>
        <div class="item cols-2">
          <div>
            <el-svg icon="infinite" color="#506677" />
            <h2 class="title">Infinite Scalability</h2>
            <p>When it comes to dynamic applications, scalability is often a concern. Fortunately, Factor is deploying your content to a cloud provider like Google Firebase, Microsoft Azure, or AWS.</p>
          </div>
          <div>
            <div class="bg-rect-right">
              <img
                class="img-markdown"
                :src="require(`./img/markdown-editor.png`)"
                alt="Factor - Markdown"
              >
            </div>
          </div>
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
            <factor-link path="/" btn="primary" size="large">
              Start Building Free
              <i class="fa fa-arrow-right" />
            </factor-link>
            <factor-link path="/contact" btn="tertiary" size="large">Contact Us</factor-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "el-svg": () => import("./el/el-svg")
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
.how-it-works {
  background: #fafbff;
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1024px;
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
    background: #fff;
    margin: 1em 0 2em;
    border-radius: 4px;
    border-left: 4px solid #506677;
    //box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 6px rgba(50, 50, 93, 0.11),
      0 20px 125px -30px rgba(80, 102, 119, 0.5),
      0 50px 65px -47.5px rgba(0, 0, 0, 0.3);
    code {
      overflow-x: auto;
      opacity: 0.7;
      color: #525252;
      white-space: pre;
      padding: 1.4em;
      line-height: 1.5em;
      font-size: 1.2em;
      display: block;
    }
  }

  .splash-wrap {
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: center;
      max-width: 700px;
      padding: 7em 0 3em;
      @media (max-width: 767px) {
        padding: 4em 1em;
      }
      .title {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 0.9;
        margin-bottom: 0.2em;
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.4em;
        font-weight: 500;
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
      grid-gap: 3em;
      align-items: center;
      padding: 3em 0;

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
          padding: 2em 0;
          text-align: left;
        }
      }

      &:nth-child(2n + 2) {
        direction: rtl; //reverse even items order
        > div {
          direction: ltr;
        }
      }

      .figure {
        display: grid;
        justify-content: center;
        padding: 3em 0;
      }

      .title {
        font-size: 1.6em;
        line-height: 1;
        margin: 0.5em 0;
        font-weight: 600;
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

      .bg-rect-left {
        background: url(./img/bg-rectangles-left.svg) no-repeat center center;
        background-size: contain;
      }
      .bg-rect-right {
        background: url(./img/bg-rectangles-right.svg) no-repeat center center;
        background-size: 80% 80%;
      }

      .bg-circles {
        background: url(./img/bg-circles.svg) no-repeat center center;
        background-size: contain;
      }
      .bg-glow {
        background: url(./img/bg-glow.svg) no-repeat center center;
        background-size: contain;
      }
      .bg-dashed-circles {
        background: url(./img/bg-dashed-circles.svg) no-repeat center center;
        background-size: contain;
      }
      .bg-swirl {
        background: url(./img/bg-swirl.svg) no-repeat center center;
        background-size: contain;
      }

      img {
        max-width: 100%;
        margin: 0 auto;
        &.img-markdown {
          min-height: 320px;
          border-radius: 14px;
          background: #fff;
          box-shadow: 27.1px 62.5px 125px -25px rgba(80, 102, 119, 0.4),
            16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.4);
          transform: scale(0.7) perspective(1040px) rotateY(-5deg) rotateX(1deg)
            rotate(1deg);
        }
        // &.img-user-roles {
        //   min-height: 320px;
        //   border-radius: 14px;
        //   box-shadow: -27.1px 62.5px 125px -25px rgba(80, 102, 119, 0.5),
        //     -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
        //   transform: scale(0.8) perspective(1040px) rotateY(5deg) rotateX(-1deg)
        //     rotate(-1deg);
        // }
        @media (max-width: 767px) {
          &.img-markdown {
            min-height: auto;
            border-radius: 4px;
            // box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
            //   0 1px 3px rgba(0, 0, 0, 0.08);
            box-shadow: 0 2px 6px rgba(50, 50, 93, 0.11),
              0 20px 125px -30px rgba(80, 102, 119, 0.5),
              0 50px 65px -47.5px rgba(0, 0, 0, 0.3);
            transform: scale(1) perspective(0) rotateY(0deg) rotateX(0deg)
              rotate(0deg);
          }
        }
      }
    }
  }

  .cta-wrap {
    padding: 2em 0;
    background: #fff;
    .cta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 60px;
      padding: 4em 0;
      @media (max-width: 767px) {
        display: block;
      }
      .title {
        font-weight: 600;
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
        @media (max-width: 767px) {
          display: block;
          margin-top: 1.5em;
        }
      }
    }
  }
}
</style>