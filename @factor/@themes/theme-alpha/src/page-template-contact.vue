<template>
  <div class="page-contact">
    <section class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
            <h1 class="title">{{ post.title }}</h1>
            <h2 class="heading">{{ post.pageHeading }}</h2>
            <div v-formatted-text="$markdown.render(post.content)" class="content entry-content" />

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
                  format="vertical"
                  data-test="form-name"
                  input="factor-input-text"
                  placeholder="Name"
                  required
                />
                <factor-input-wrap
                  v-model="form.email"
                  format="vertical"
                  data-test="form-email"
                  input="factor-input-email"
                  placeholder="Email Address"
                  required
                />
                <factor-input-wrap
                  v-model="form.message"
                  format="vertical"
                  input="factor-input-textarea"
                  placeholder="Message"
                  required
                  data-test="form-message"
                />
                <factor-input-submit
                  btn="default"
                  :loading="sending"
                  size="large"
                  data-test="form-submit"
                >
                  Contact
                  <i class="fa fa-angle-right" />
                </factor-input-submit>
              </div>
            </factor-form>
          </div>
          <div>
            <div
              v-if="post.heroImage"
              :style="{'background-image': `url(`+ post.heroImage[0].url + `)` }"
              class="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: true,
      sending: false,
      form: {},
      sent: false,
      formStatus: "unchecked"
    }
  },
  watch: {},
  mounted() {
    this.$watch(
      "form",
      function() {
        const v = this.$refs.form.$el.checkValidity()

        this.formStatus = v ? "valid" : "invalid"
      },
      { deep: true }
    )
  },
  pageTemplate() {
    return {
      name: "Contact Page",
      inputs: [
        {
          input: "text",
          label: "Heading",
          key: "pageHeading"
        },
        {
          input: "image-upload",
          label: "Image",
          key: "heroImage"
        }
      ]
    }
  },
  methods: {
    settings() {
      return ["test"]
    },
    async send() {
      this.sending = true
      const { name, email, message } = this.form
      // this.$email.send({
      //   to: ["raylopezaleman@gmail.com"],
      //   subject: `Contact Form: ${name} ${email}`,
      //   message: `A form was submitted by ${name}.`,
      //   meta: this.form
      // })

      if (!name || !email || !message) {
        this.$notify.error(
          "Please enter your contact information into the form."
        )
        //return;
      }

      try {
        let _p = []

        _p.push(
          this.$email.send({
            to: email,
            subject: `Got your message.`,
            message: `This is to confirm we've recieved a form you submitted. We'll take a look and be in touch as soon as possible.`,
            title: "Contact",
            table: this.form
          })
        )

        _p.push(
          this.$sheets.saveForm({
            ...this.form,
            source: "/contact",
            category: "General",
            type: "Contact"
          })
        )

        await Promise.all(_p)

        this.sent = true
      } catch (error) {
        this.$notify.error("There was an issue sending your form.")
      }

      this.sending = false
    }
  }
}
</script>

<style lang="less">
.page-contact {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .factor-btn.default {
    color: @color-primary;
    letter-spacing: -0.03em;
  }
  // Hero
  .hero {
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      width: 70%;
      height: 100%;
      top: 0;
      right: auto;
      bottom: 0;
      background-color: @color-bg;
      @media (max-width: 1024px) {
        width: 100%;
      }
    }

    .hero-inner {
      position: relative;
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 60px;
      align-items: center;
      padding: 7em 0;
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      @media (max-width: 767px) {
        padding: 4em 0;
      }
      .title {
        font-size: 1.1em;
        text-transform: uppercase;
      }
      .heading {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em 0;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .content {
        font-size: 1.2em;
        line-height: 1.6em;
        p {
          opacity: 0.5;
        }
      }
      .hero-image {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 450px;
        max-width: 300px;
        box-shadow: 20px 60px 120px 0 rgba(0, 0, 0, 0.33);
        border-top-left-radius: 40px;
        @media (max-width: 767px) {
          margin: 0 auto;
          max-width: 100%;
        }
      }
    }

    .contact-form {
      input[type="text"],
      input[type="email"] {
        width: 100%;
      }
      input[type="text"],
      input[type="email"],
      textarea.standard-textarea {
        background: @color-white;
        border: 1px solid rgba(48, 48, 48, 0.1);
        border-radius: 4px;
      }
      .form-submit {
        margin: 1em 0;
      }
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
  }
}
</style>