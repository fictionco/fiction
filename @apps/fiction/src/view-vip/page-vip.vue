<template>
  <div class="view-vip">
    <section class="intro">
      <div class="mast">
        <div class="intro-inner">
          <div>
            <img class="title" :src="require(`./factor-vip-logo.svg`)" alt="Factor VIP" >
            <div
              class="subtitle"
            >Premium digital experiences and web application development services powered by Factor.</div>
            <div class="actions">
              <app-link path="#contact" btn="primary" size="large">
                Start Your Web App
                <i class="fa fa-arrow-right" />
              </app-link>
            </div>
          </div>
          <div>
            <figure class="figure">
              <img :src="require(`./factor-vip.svg`)" alt="Factor VIP" >
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
            <p
              class="box-description"
            >VIP is a fully managed Factor cloud platform for unparalleled scale, security, flexibility, and performance.</p>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">Implementation &amp; Support</h3>
            <p
              class="box-description"
            >End-to-end guidance and hands-on support, from project consideration through launch and every day thereafter.</p>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">Build Your Digital Experiences</h3>
            <p
              class="box-description"
            >Solutions at the ready. Factor powers mission critical enterprise media and marketing systems.</p>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">A Complete Solution</h3>
            <p
              class="box-description"
            >Ready models, processes, and plugins to deliver your business goals. Deep, extensible capabilities.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="clients">
      <div class="title">Trusted by:</div>
      <div class="mast clients-inner">
        <div class="client">
          <div class="client-image">
            <img :src="require(`./elasticbyte.svg`)" alt="Elastic Byte" >
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./carbontechpro.svg`)" alt="Carbon Tech Pro" >
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./pagelines.svg`)" alt="PageLines" >
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./aqualuna.svg`)" alt="AquaLuna" >
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
          <app-link path="mailto:contact@fiction.com">contact@fiction.com</app-link>— it’ll get to us either way.
        </p>

        <factor-form
          ref="form"
          class="contact-form"
          data-test="contact-form"
          :class="formStatus"
          @submit="send()"
        >
          <div v-if="sent" class="confirm" data-test="confirm">
            <div class="title">Got it!</div>
            <div class="description">
              We’ll get back to you as soon as possible
              at the email you provided.
            </div>
          </div>
          <div v-else class="inputs">
            <factor-input-wrap
              v-model="form.name"
              format="horizontal"
              data-test="form-name"
              input="factor-input-text"
              label="Your Name"
              required
            />
            <factor-input-wrap
              v-model="form.email"
              format="horizontal"
              data-test="form-email"
              input="factor-input-email"
              label="Email Address"
              required
            />
            <factor-input-wrap
              v-model="form.message"
              format="horizontal"
              input="factor-input-textarea"
              label="Message"
              placeholder="How can we help you succeed?"
              required
              data-test="form-message"
            />
            <factor-input-submit btn="primary" :loading="sending" data-test="form-submit">
              Contact
              <factor-icon icon="arrow-right" />
            </factor-input-submit>
          </div>
        </factor-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      sending: false,
      form: {},
      sent: false,
      formStatus: "unchecked"
    }
  },
  computed: {},
  mounted() {
    this.$user.init(() => {
      this.loading = false
    })

    this.$watch(
      "form",
      function() {
        const v = this.$refs.form.$el.checkValidity()

        this.formStatus = v ? "valid" : "invalid"
      },
      { deep: true }
    )
  },
  metatags() {
    return {
      title: this.$setting.get("home.meta.title"),
      description: this.$setting.get("home.meta.description")
    }
  },
  methods: {
    async send() {
      this.sending = true
      const { name, email, message } = this.form
      // this.$email.send({
      //   to: ["letters@fiction.com"],
      //   subject: `Contact Form: ${name} ${email}`,
      //   message: `A form was submitted by ${name}.`,
      //   meta: this.form
      // })

      if (!name || !email || !message) {
        this.$notify.error(
          "Please enter your contact information into the form."
        )

        return;
      }

      try {
        let _p = []

        _p.push(
          this.$notify.sendEmail({
            to: email,
            subject: `Got your message.`,
            message: `This is to confirm we've recieved a form you submitted. We'll take a look and be in touch as soon as possible.`,
            title: "Contact",
            table: this.form,
            btn: {
              link: "https://www.fiction.com",
              text: "View Fiction",
              class: "default"
            }
          })
        )

        _p.push(
          this.$db.update({
            collection: "admin",
            data: {
              ...this.form,
              source: "/contact",
              category: "General",
              type: "Contact"
            }
          })
        )

        await Promise.all(_p)

        this.sent = true
      } catch (error) {
        this.$events.$emit("error", "There was an issue sending your form.")
      }

      this.sending = false
    }
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
    max-width: 1000px;
    margin: 0 auto;
  }

  // feature
  .intro {
    position: relative;
    background: #1b223c url(./rectangles.svg) no-repeat center center;
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
      @media (max-width: 767px) {
        padding: 4em 0;
        grid-template-columns: 1fr;
      }
      .title {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin-bottom: 0.3em;
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.4em;
        font-weight: 400;
        line-height: 1.6em;
        color: var(--color-light);
      }
      .actions {
        margin-top: 1.5em;
      }
      img {
        max-width: 100%;
      }
    }
  }

  //Boxes
  .boxes {
    background-color: #f5f8fc;
    .boxes-inner {
      box-shadow: var(--panel-shadow);
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
          opacity: 0.5;
        }
        .box-title {
          font-size: 1.4em;
          font-weight: 600;
          letter-spacing: -0.03em;
          margin-bottom: 0.5em;
        }
        .box-description,
        a {
          font-size: 1.2em;
          line-height: 1.6em;
        }
        .box-description {
          opacity: 0.5;
        }
      }
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
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
    .title {
      text-align: center;
      font-size: 1.2em;
      line-height: 1.6em;
    }
    .clients-inner {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
    }
  }

  //Contact
  .contact {
    position: relative;
    background: #fff;
    margin-top: 7em;

    .contact-inner {
      padding: 4em 0 2em;
      position: relative;
      z-index: 1;
      max-width: 650px;
      .title,
      .subtitle {
        text-align: center;
      }
      .title {
        font-size: 3em;
        font-weight: var(--font-weight-bold);
        letter-spacing: -0.03em;
        margin-bottom: 0.3em;
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.2em;
        line-height: 1.6em;
        max-width: 650px;
        margin: 0 auto;
      }
      .contact-form {
        box-shadow: var(--panel-shadow);
        background: #fff;
        border-radius: 0.5em;
        padding: 2em;
        margin-top: 2em;
      }
    }
  }
}
</style>