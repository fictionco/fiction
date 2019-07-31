<template>
  <div class="view-contact">
    <div class="hhh">
      <div class="stripes">
        <div class="wedge" />
      </div>
      <div class="text">
        <h1 class="title">Contact Us</h1>
        <div
          class="sub-title"
        >We're happy to answer your questions. Fill out the form and we’ll be in touch as soon as possible.</div>
      </div>
    </div>
    <div class="contact-wrap">
      <div class="contact-area">
        <div class="grid">
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
                <app-btn btn="default" path="/dashboard">
                  View Dashboard
                  <factor-icon icon="arrow-right" />
                </app-btn>
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
                v-model="form.website"
                format="horizontal"
                input="factor-input-text"
                label="Website"
                placeholder="www.fiction.com"
              />
              <factor-input-wrap
                v-model="form.phone"
                format="horizontal"
                input="factor-input-phone"
                label="Phone"
              />
              <factor-input-wrap
                v-model="form.location"
                format="horizontal"
                input="factor-input-text"
                label="Location"
                placeholder="Miami, FL"
              />
              <factor-input-wrap
                v-model="form.message"
                format="horizontal"
                input="factor-input-textarea"
                label="Message"
                required
                data-test="form-message"
              />
              <factor-input-submit
                el="app-btn"
                btn="secondary"
                :loading="sending"
                data-test="form-submit"
              >Contact Us</factor-input-submit>
            </div>
          </factor-form>
          <div class="aside">
            <div class="title" />
            <div class="sub-title">We're looking forward to hearing from you...</div>
          </div>
        </div>
      </div>
      <!-- <div class="support">
        <span class="name">Need help?</span>
        <span class="description">Check out the Fiction
          <factor-link path="/support">support page</factor-link>.
        </span>
      </div>-->
    </div>
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
      title: "Contact Sales or Support at Fiction",
      description: "Contact sales or support at Fiction.",
      image: require("./img/fiction.jpg")
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
.view-contact {
  margin-top: 3em;
  background-size: cover;
  // background: #f7f9ff;
  //background: linear-gradient(90deg, #0496ff, #68d4f8 200%);

  .hhh {
    text-align: center;
    .text {
      max-width: 500px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }

    padding: 5em 0;
    @media (max-width: 767px) {
      padding: 1em 0;
    }
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-size: 3em;
      font-weight: 800;
      @media (max-width: 767px) {
        font-size: 2.5em;
      }
    }
    .sub-title {
      font-size: 1.3em;
      font-weight: 500;
      opacity: 0.6;
      @media (max-width: 767px) {
        font-size: 1.2em;
        padding: 0 5%;
      }
    }
    position: relative;
    .stripes {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -72px;
      top: 50%;
      transform: skewY(-6deg);
      transition: opacity 0.2s ease-out;
      will-change: transform;
      .wedge {
        position: absolute;
        height: 5000px;
        bottom: 0;
        background: #fff;
        left: 0;
        right: 0;
      }
    }
  }
  .contact-wrap {
    padding: 2em 0 4em;
  }
  .contact-area {
    position: relative;
    z-index: 10;
    .grid {
      padding: 0 1em;
      max-width: 960px;
      margin: 0 auto;
      align-items: center;
      display: grid;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
    }
    .aside {
      //color: #fff;
      padding: 1.5em;
      font-size: 1.8em;
      line-height: 1.3;
      .title {
        font-size: 1.5em;
      }
      .sub-title {
        font-weight: 500;
        opacity: 0.5;
      }
    }
  }
  .contact-form {
    padding: 1.5em;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 0 0.4px rgba(50, 50, 93, 0.05),
      0 50px 100px -20px rgba(50, 50, 93, 0.25),
      0 30px 60px -30px rgba(0, 0, 0, 0.3);
  }
  .confirm {
    padding: 8em 2em;
    text-align: center;
    .title {
      font-size: 1.7em;
    }

    .description {
      opacity: 0.5;
    }
    .actions {
      margin-top: 1em;
    }
  }
  .support {
    text-align: center;
    margin-top: 3em;
    font-weight: 500;
    .name {
    }
    .description {
      font-size: 0.85em;
      opacity: 0.6;
    }
  }
}
</style>