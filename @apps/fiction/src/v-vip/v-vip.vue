<template>
  <div class="view-vip">
    <section class="intro">
      <div class="mast">
        <div class="intro-inner">
          <div>
            <img class="title" :src="require(`./img/factor-vip-logo.svg`)" alt="Factor VIP" />
            <h1 class="subtitle">
              Premium digital experiences and web application development services powered
              by Factor.
            </h1>
            <div class="actions">
              <a href="#contact">
                <factor-btn path="#contact" btn="primary" size="large">
                  Contact Sales
                  <i class="fa fa-arrow-down" />
                </factor-btn>
              </a>
            </div>
          </div>
          <div>
            <figure class="figure">
              <img :src="require(`./img/factor-vip.svg`)" alt="Factor VIP" />
            </figure>
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>

    <section class="boxes">
      <div class="mast boxes-inner">
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">Enterprise Factor Platform</h3>
            <p class="box-description">
              VIP is a fully managed Factor cloud platform for unparalleled scale,
              security, flexibility, and performance.
            </p>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">Implementation &amp; Support</h3>
            <p class="box-description">
              End-to-end guidance and hands-on support, from project consideration through
              launch and every day thereafter.
            </p>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">Build Your Digital Experiences</h3>
            <p class="box-description">
              Solutions at the ready. Factor powers mission critical enterprise media and
              marketing systems.
            </p>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">A Complete Solution</h3>
            <p class="box-description">
              Ready models, processes, and plugins to deliver your business goals. Deep,
              extensible capabilities.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="clients">
      <!-- <div class="title">Brands:</div> -->
      <div class="mast clients-inner">
        <div class="client">
          <div class="client-image">
            <img :src="require(`./img/elasticbyte.svg`)" alt="Elastic Byte" />
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./img/carbontechpro.svg`)" alt="Carbon Tech Pro" />
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./img/pagelines.svg`)" alt="PageLines" />
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./img/aqualuna.svg`)" alt="AquaLuna" />
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>

    <section id="contact" class="contact">
      <div class="mast contact-inner">
        <h3 class="title">Getting started is easy.</h3>
        <p class="subtitle">
          You can reach out via the form below, or send a message to
          <factor-link path="mailto:vip@fiction.com">vip@fiction.com</factor-link>&nbsp;— it’ll get to us either way.
        </p>

        <component :is="$setting.get('contactForm.form')" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  computed: {},
  metatags() {
    return {
      title: "VIP - Enterprise Web Application Development and Support",
      description:
        "Need the professional touch for your website or web application? Get in touch with us about enterprise development and support,"
    }
  },
  routeClass() {
    return "nav-white"
  }
}
</script>

<style lang="less">
.nav-light {
  .site-head {
    background: #1b223c;
    .logo-img .thelogotext {
      fill: var(--color-light);
    }
    .mobile-logo .logo-img .thelogotext {
      fill: initial;
    }

    .nav > a {
      color: var(--color-light);
      &:hover {
        color: var(--color-primary);
      }
      @media (max-width: 767px) {
        color: initial;
      }
    }
  }
}
.view-vip {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1040px;
    margin: 0 auto;
  }

  // feature
  .intro {
    position: relative;
    background: #1b223c url(./img/rectangles.svg) no-repeat center center;
    background-size: 80%;
    @media (max-width: 767px) {
      background-size: 100%;
    }

    .hhh {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -120px;
      top: 84%;
      transform: skewY(-4deg);
      background: #f5f8fc;
      transition: opacity 0.2s ease-out;
      will-change: transform;
    }

    .intro-inner {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 30px;
      align-items: center;
      padding: 7em 0 10em;
      .title {
        font-weight: 600;
        font-size: 4em;
        letter-spacing: -0.03em;
        margin-bottom: 0.3em;
        @media (max-width: 767px) {
          font-size: 2.6em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        font-weight: 400;
        line-height: 1.6em;
        color: var(--color-light);
        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
      .actions {
        margin-top: 1.5em;
      }
      img {
        max-width: 100%;
        margin: 0 auto;
      }
      @media (max-width: 767px) {
        text-align: left;
        padding: 4em 0;
        grid-template-columns: 1fr;
      }
    }
  }

  //Boxes
  .boxes {
    background-color: #f5f8fc;
    padding: 0 2em 2em;

    .boxes-inner {
      box-shadow: var(--box-shadow-panel);
      background: var(--color-light);
      border-radius: 0.5em;
      padding: 3em;
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 60px 30px;
      transform: translateY(-80px);

      .box {
        display: grid;
        grid-template-columns: 40px 1fr;
        .fa {
          font-size: 22px;
          opacity: 0.7;
        }
        .box-title {
          font-size: 1.4em;
          font-weight: var(--font-weight-bold);
          letter-spacing: -0.03em;
          margin-bottom: 0.5em;
        }
        .box-description,
        a {
          font-size: 1.2em;
          line-height: 1.6em;
        }
        .box-description {
          opacity: 0.7;
        }
      }
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        transform: translateY(0);
        padding: 2em;
        .box {
          padding: 0;
        }
      }
    }
  }

  //Clients
  .clients {
    position: relative;
    background-color: #f5f8fc;
    padding: 3em 0;
    @media (max-width: 767px) {
      padding: 1em 0;
    }
    .title {
      text-align: center;
      font-size: 1.2em;
      line-height: 1.6em;
    }
    .clients-inner {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      grid-gap: 2em;
      align-items: center;
      margin: 3em auto;
      .client-image {
        max-width: 100%;
        img {
          max-width: 100%;
          display: block;
          margin: 0 auto;
        }
      }
      @media (max-width: 767px) {
        grid-template-columns: 1fr 1fr;
        grid-gap: 2em;
      }
    }
    .hhh {
      pointer-events: none;
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      bottom: -40%;
      top: 50%;
      transform: skewY(-4deg);
      background: #f5f8fc;
      transition: opacity 0.2s ease-out;
      will-change: transform;
      @media (max-width: 767px) {
        bottom: -20%;
      }
    }
  }

  //Contact
  .contact {
    position: relative;
    background: #fff;
    margin-top: 7em;

    .contact-inner {
      padding: 4em 2em 2em;
      position: relative;
      z-index: 1;
      max-width: 720px;
      .title,
      .subtitle {
        text-align: center;
        @media (max-width: 767px) {
          text-align: left;
        }
      }
      .title {
        font-size: 4em;
        font-weight: var(--font-weight-bold, 800);
        letter-spacing: -0.03em;
        margin-bottom: 0.3em;
        @media (max-width: 767px) {
          font-size: 2.6em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        line-height: 1.6em;
        max-width: 650px;
        margin: 0 auto;
        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
      .contact-form {
        box-shadow: var(--box-shadow-panel);
        background: #fff;
        border-radius: 0.5em;
        padding: 2em;
        margin-top: 2em;
      }
    }
  }
}
</style>
