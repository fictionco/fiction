<template>
  <section id="contactPageContainerID" class="contact-container page-container">
    <h2 class="pretitle">{{ $setting.get('contact.pretitle') }}</h2>
    <h1 class="title">{{ $setting.get('contact.title') }}</h1>
    <div class="form-wrap">
      <div>
        <h2 class="heading">{{ $setting.get('contact.form.title') }}</h2>

        <component :is="$setting.get('contactForm.form')" />
        <!-- <factor-form
          ref="form"
          class="contact-form"
          data-test="contact-form"
          :class="formStatus"
          @submit="send()"
        >
          <div v-if="sent" class="confirm" data-test="confirm">
            <div class="title">{{ $setting.get('contact.form.confirmation.title') }}</div>
            <div class="description">{{ $setting.get('contact.form.confirmation.content') }}</div>
          </div>
          <div v-else class="inputs">
            <factor-input-wrap
              v-model="form.name"
              format="vertical"
              data-test="form-name"
              input="factor-input-text"
              :placeholder="$setting.get('contact.form.placeholders.name')"
              required
            />
            <factor-input-wrap
              v-model="form.email"
              format="vertical"
              data-test="form-email"
              input="factor-input-email"
              :placeholder="$setting.get('contact.form.placeholders.email')"
              required
            />
            <factor-input-wrap
              v-model="form.message"
              format="vertical"
              input="factor-input-textarea"
              :placeholder="$setting.get('contact.form.placeholders.message')"
              required
              data-test="form-message"
            />

            <factor-input-submit
              btn="secondary"
              size="large"
              :loading="sending"
              data-test="form-submit"
            >
              {{ $setting.get("contact.form.buttonText") }}
              <factor-icon icon="angle-right" />
            </factor-input-submit>
          </div>
        </factor-form>-->
        <!-- <input
          v-model="formData.name"
          class="contact-name-field contact-text-field"
          type="text"
          :placeholder="$setting.get('contact.form.placeholders.name')"
        >
        <input
          v-model="formData.email"
          class="contact-email-field contact-text-field"
          type="text"
          :placeholder="$setting.get('contact.form.placeholders.email')"
        >
        <textarea
          v-model="formData.message"
          class="contact-text-field contact-textarea"
          name="contact-form-textarea"
          :placeholder="$setting.get('contact.form.placeholders.text')"
          cols="30"
          rows="10"
        />
        <div class="contact-submit-button-container">
          <button
            class="contact-form-submit-button"
            @click="handlerSubmit()"
          >{{ $setting.get('contact.form.buttonText') }}</button>
        </div>-->
      </div>
      <div>
        <h2 class="heading">{{ $setting.get('contact.info.title') }}</h2>
        <div v-for="(item, i) in $setting.get('contact.info.items')" :key="i" class="info-item">
          <h3 class="item-title">{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
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
      // formData: {
      //   name: null,
      //   email: null,
      //   message: null
      // },
      // url: null
    }
  },
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
  methods: {
    async send() {
      this.sending = true
      const { name, email, message } = this.form
      // this.$email.send({
      //   to: ["raylopezaleman@gmail.com"],
      //   subject: `Contact Form: ${name} ${email}`,
      //   message: `A form was submitted by ${name}.`,
      //   meta: this.form
      // })

      // if (!name || !email || !message) {
      //   this.$notify.error(
      //     "Please enter your contact information into the form."
      //   )
      //   return;
      // }

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
    // handlerSubmit() {
    //   if (this.url) {
    //     fetch(this.url, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify(this.formData)
    //     })
    //       .then(res => res.json())
    //       .then(res => {
    //         console.log(res)
    //         this.formData.name = null
    //         this.formData.email = null
    //         this.formData.message = null
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
    //   }
    //   console.log("Not url, formData :", this.formData)
    // }
  }
}
</script>

<style lang="less">
.contact-container {
  background: var(--color-primary);

  .pretitle {
    color: var(--color-text);
    font-size: 1.4em;
    text-align: center;
  }
  .title {
    color: var(--color-text);
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.1;
    text-align: center;
  }
  .form-wrap {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin: 2rem auto;
    max-width: 650px;
    border-radius: var(--border-radius);
    overflow: hidden;
    background: var(--color-primary-dark);

    > div {
      padding: 2rem;
      &:nth-child(2) {
        background: var(--color-primary-darker);
      }
      .heading {
        font-size: 1.4rem;
        font-weight: var(--font-weight-semibold);
        letter-spacing: -0.03em;
        line-height: 1.1;
        margin-bottom: 1rem;
      }
    }
    .info-item {
      margin-bottom: 1rem;
      .item-title {
        font-weight: var(--font-weight-semibold);
      }
    }

    .contact-form {
      .input-wrap .input-area .the-input {
        display: grid;
        grid-template-columns: 1fr;
        &::placeholder {
          color: var(--color-text);
          font-size: 0.8vw;
          opacity: 0.8;
        }
      }
    }
  }
}
// .contact-container {
//   margin: 2rem auto;
//   width: 52vw;
//   height: 60vh;
//   border-radius: var(--border-radius);
//   background: #da524f;
//   display: grid;
//   grid-template-columns: 2fr 1fr;
//   grid-template-rows: 1fr;
// }
// .contact-form-container {
//   padding: 1vw;
//   display: grid;
//   grid-template-columns: 1fr;
// }
// .contact-form-title {
//   color: #f7f7f7;
//   align-self: center;
//   margin: 0;
// }
// .contact-text-field {
//   margin-bottom: 1vh;
//   padding-left: 1vw;
//   background: #bc4947;
//   border: 1px solid #bc4947;
//   color: #f7f7f7;
//   border-radius: 3px;
//   outline: none;
//   font-size: 0.8vw;
// }
// .contact-text-field::placeholder {
//   color: #f7f7f7;
//   font-size: 0.8vw;
//   opacity: 0.8;
// }
// .contact-text-field-mobile::placeholder {
//   font-size: 12px;
//   z-index: 1;
// }
// .contact-textarea {
//   padding: 1vw;
//   resize: none;
// }
// .contact-submit-button-container {
//   margin-top: 1vh;
//   height: 1vh;
// }
// .contact-form-submit-button {
//   background: #f7f7f7;
//   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
//   border-radius: 4px;
//   color: #fa5855;
//   font-size: 1.2vw;
//   font-weight: bold;
//   width: 17vw;
//   height: 5vh;
//   outline: none;
// }
// .contact-info-container {
//   padding: 1.2vh 0 0 1vw;
//   color: #f7f7f7;
//   background: #bc4947;
//   border-radius: 0 12px 12px 0;
// }
</style>
