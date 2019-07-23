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
              <app-link path="#" btn="primary" size="large">
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
            <factor-link path="#">Learn more</factor-link>
          </div>
        </div>
        <div class="box">
          <factor-icon icon="arrow-circle-right" />
          <div>
            <h3 class="box-title">Implementation &amp; Support</h3>
            <p
              class="box-description"
            >End-to-end guidance and hands-on support, from project consideration through launch and every day thereafter.</p>
            <factor-link path="#">Our approach</factor-link>
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
        <div class="clients">
          <div class="client-image">
            <img :src="require(`./elasticbyte.svg`)" alt="Elastic Byte" >
          </div>
        </div>
        <div class="clients">
          <div class="client-image">
            <img :src="require(`./carbon-tech-pro.svg`)" alt="Carbon Tech Pro" >
          </div>
        </div>
        <div class="clients">
          <div class="client-image">
            <img :src="require(`./elasticbyte.svg`)" alt="Elastic Byte" >
          </div>
        </div>
        <div class="clients">
          <div class="client-image">
            <img :src="require(`./elasticbyte.svg`)" alt="Elastic Byte" >
          </div>
        </div>
      </div>
    </section>

    <section class="contact">
      <div class="mast contact-inner">
        <h3 class="title">Getting started is easy.</h3>
        <p class="subtitle">
          You can reach out via the form below, or send a message to
          <factor-link path="mailto:contact@fiction.com">contact@fiction.com</factor-link>— it’ll get to us either way.
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
            <div class="actions">
              <el-btn btn="default" path="/dashboard">
                View Dashboard
                <factor-icon icon="arrow-right" />
              </el-btn>
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
              required
              data-test="form-message"
            />
            <factor-input-submit btn="primary" :loading="sending" data-test="form-submit">Contact Us</factor-input-submit>
          </div>
        </factor-form>
      </div>
      <div class="hhh" />
    </section>

    <!-- <el-cta /> -->
  </div>
</template>

<script>
export default {
  // components: {
  //   "el-cta": () => import("./el/cta")
  // },
  // props: {
  //   post: { type: Object, default: () => {} }
  // },
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
    background: #f5f8fc;

    .hhh {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -120px;
      top: 50%;
      transform: skewY(-6deg);
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
      padding: 7em 0 4em;
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
        font-size: 1.2em;
        line-height: 1.6em;
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
    .boxes-inner {
      box-shadow: var(--panel-shadow);
      background: #fff;
      border-radius: 0.5em;
      padding: 2em;
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 60px 30px;

      .box {
        //padding: 0 3em;
        display: grid;
        grid-template-columns: 40px 1fr;
        .fa {
          font-size: 22px;
          opacity: .5;
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
    padding: 3em 0;
    .title {
      text-align: center;
      font-size: 1.2em;
      line-height: 1.6em;
    }
    .clients-inner {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      grid-gap: 20px 70px;
      align-items: center;
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
        grid-gap: 1em;
      }
    }
  }

  //Contact
  .contact {
    position: relative;
    background: #f5f8fc;
    margin-top: 7em;
    padding: 0 0 4rem;

    .hhh {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      top: -120px;
      bottom: 50%;
      transform: skewY(-6deg);
      background: #f5f8fc;
      transition: opacity 0.2s ease-out;
      will-change: transform;
    }

    .contact-inner {
      padding: 2em;
      position: relative;
      z-index: 1;
      max-width: 650px;
      .title,
      .subtitle {
        text-align: center;
      }
      .title {
        font-weight: 600;
        font-size: 3em;
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