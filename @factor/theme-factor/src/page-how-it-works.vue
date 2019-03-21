<template>
  <div class="how-it-works">
    <section class="splash-wrap">
      <div class="splash mast">
        <div>
          <h1 class="title">How Factor Works</h1>
          <p class="subtitle">At vero eos et accusamus et iusto odio dignissimos ducimus.</p>
        </div>
      </div>
    </section>

    <section class="items-wrap stripes-wrap">
      <div class="stripes" />
      <div class="mast">
        <div class="item">
          <div>
            <el-svg icon="fast-clock" />
            <h2 class="title">5 Minute Setup</h2>
            <p>Get started in 5 minutes. sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.</p>
            <div class="actions">
              <factor-link path="/docs">
                Start Now
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
        <div class="item">
          <div>
            <el-svg icon="puzzle" />
            <h2 class="title">Modular</h2>
            <p>Customize your project by including only the code you need. Using Factor means avoiding code bloat, reusable elements, and faster development.</p>
            <div class="actions">
              <factor-link path="/plugins">
                Get Plugins
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <div>
            <div class="bg-circles">
              <img class="img-modular" :src="require(`./img/modular.png`)" alt="Factor - Modular">
            </div>
          </div>
        </div>
        <div class="item">
          <div>
            <el-svg icon="vue" />
            <h2 class="title">Build with Vue.js</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
            <div class="actions">
              <factor-link path="/docs">
                Explore the docs
                <i class="fa fa-arrow-right" />
              </factor-link>
            </div>
          </div>
          <div>
            <pre><code class="javascript">
var app = new Factor({
  el: '#app',
  data: {
    message: 'Hello Factor!'
  }
})
          </code></pre>
          </div>
        </div>
        <div class="item">
          <div>
            <el-svg icon="markdown" />
            <h2 class="title">Markdown Editor</h2>
            <p>The Markdown editor provides a great writing experience with simple formatting. It also saves time over hand-crafted HTML tags, and it’s faster than using a WYSIWYG.</p>
          </div>
          <div>
            <div class="bg-glow">
              <img
                class="img-markdown"
                :src="require(`./img/markdown-editor.png`)"
                alt="Factor - Markdown"
              >
            </div>
          </div>
        </div>
        <div class="item">
          <div>
            <el-svg icon="user" />
            <h2 class="title">User Roles &amp; Permissions</h2>
            <p>You can add other users to access your site admin interface. To protect your sensitive information or restrict the actions they can perform, user roles limit their access. Each user is assigned a role when they are added.</p>
          </div>
          <div>
            <div class="bg-dashed-circles">
              <img
                class="img-user-roles"
                :src="require(`./img/user-roles.png`)"
                alt="Factor - User Roles and Permissions"
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mast">
      <div class="cta">
        <div>
          <h3 class="title">Ready to Start Building?</h3>
          <p class="subtitle">Get in touch or create an account</p>
        </div>
        <div class="actions">
          <factor-link path="/download" btn="primary" size="large">
            Download
            <i class="fa fa-arrow-right" />
          </factor-link>
          <factor-link path="/contact" btn="tertiary" size="large">Contact Us</factor-link>
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
      loading: true
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
      background: #fafbff;
    }
    .mast {
      position: relative;
    }
  }

  .svg-wrap {
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    svg {
      padding: 2px;
      min-height: 50px;
      max-width: 30px;
    }
  }

  pre {
    font-size: 0.8em;
    background: #fff;
    margin: 1em 0 2em;
    border-radius: 4px;
    border-left: 4px solid #506677;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    code {
      overflow-x: auto;
      color: #525252;
      white-space: pre;
      padding: 1.4em;
      line-height: 1.5em;
      font-size: 1em;
      display: block;
    }
  }

  .splash-wrap {
    background: #fff;
  }
  .splash {
    padding: 7em 0;
    text-align: center;
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

  .items-wrap {
    padding: 4em 0;
    margin: 3em 0;
  }

  .item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3em;
    align-items: center;
    padding: 3em 0;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      grid-gap: 2em;
      padding: 2em 1em;
    }

    &:nth-child(2n + 2) {
      direction: rtl; //reverse even items order
      > div {
        direction: ltr;
      }
    }
    .title {
      font-size: 2em;
      line-height: 1;
      margin: 0.5em 0;
      font-weight: 600;
    }
    p {
      font-size: 1.4em;
      line-height: 1.6em;
      opacity: 0.5;
    }
    .actions {
      margin-top: 1em;
      a {
        font-size: 1.4em;
      }
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
      &.img-modular {
        transform: scale(0.7) perspective(2910px) rotateY(12deg) rotateX(3deg)
          rotate(-2deg);
      }
      &.img-markdown {
        border-radius: 14px;
        box-shadow: -27.1px 62.5px 125px -25px rgba(80, 102, 119, 0.5),
          -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
        transform: scale(0.7) perspective(2910px) rotateY(12deg) rotateX(3deg)
          rotate(-2deg);
      }
      &.img-user-roles {
        border-radius: 14px;
        background: #fff;
        box-shadow: 27.1px 62.5px 125px -25px rgba(80, 102, 119, 0.5),
          16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
        transform: scale(0.6) perspective(1040px) rotateY(-5deg) rotateX(1deg)
          rotate(1deg);
      }
      @media (max-width: 767px) {
        &.img-modular,
        &.img-markdown,
        &.img-user-roles {
          transform: scale(1) perspective(0) rotateY(0deg) rotateX(0deg)
            rotate(0deg);
        }
      }
    }
  }

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
      font-size: 2em;
      letter-spacing: -0.03em;
      line-height: 0.9;
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
      @media (max-width: 767px) {
        display: block;
        margin-top: 1.5em;
      }
    }
  }
}
</style>