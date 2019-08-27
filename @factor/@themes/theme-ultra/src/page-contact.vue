<template>
  <div id="contactPageContainerID" class="contact-page-container">
    <div class="contact-quote-container">
      <h4
        class="contact-quote"
        :class="[mobile ? 'contact-quote-mobile' : '', (mobile && orientationH) ? 'contact-quote-horizontal' : '']"
      >{{ $setting.get('contact.quote') }}</h4>
      <h2
        class="contact-title"
        :class="[mobile ? 'contact-title-mobile' : '', (mobile && orientationH) ? 'contact-title-horizontal' : '']"
      >{{ $setting.get('contact.title') }}</h2>
    </div>
    <div
      class="contact-container"
      :class="[mobile ? 'contact-container-mobile' : '', (mobile && orientationH) ? 'contact-container-horizontal' : '']"
    >
      <div
        class="contact-form-container"
        :class="[mobile ? 'contact-form-container-mobile' : '', (mobile && orientationH) ? 'contact-form-container-horizontal' : '']"
      >
        <h2
          class="contact-form-title"
          :class="[mobile ? 'contact-form-title-mobile' : '', (mobile && orientationH) ? 'contact-form-title-horizontal' : '']"
        >{{ $setting.get('contact.form.title') }}</h2>
        <input
          v-model="formData.name"
          class="contact-name-field contact-text-field"
          :class="[mobile ? 'contact-text-field-mobile' : '', (mobile && orientationH) ? 'contact-text-field-horizontal' : '']"
          type="text"
          :placeholder="$setting.get('contact.form.placeholders.name')"
        >
        <input
          v-model="formData.email"
          class="contact-email-field contact-text-field"
          :class="[mobile ? 'contact-text-field-mobile' : '', (mobile && orientationH) ? 'contact-text-field-horizontal' : '']"
          type="text"
          :placeholder="$setting.get('contact.form.placeholders.email')"
        >
        <textarea
          v-model="formData.message"
          class="contact-text-field contact-textarea"
          :class="[mobile ? 'contact-text-field-mobile' : '', (mobile && orientationH) ? 'contact-text-field-horizontal' : '']"
          name="contact-form-textarea"
          :placeholder="$setting.get('contact.form.placeholders.text')"
          cols="30"
          rows="10"
        />
        <div class="contact-submit-button-container">
          <button
            class="contact-form-submit-button"
            :class="[mobile ? 'contact-form-submit-mobile' : '', (mobile && orientationH) ? 'contact-form-submit-horizontal' : '']"
            @click="handlerSubmit()"
          >{{ $setting.get('contact.form.buttonText') }}</button>
        </div>
      </div>
      <div
        class="contact-info-container"
        :class="[mobile ? 'contact-info-container-mobile' : '', (mobile && orientationH) ? 'contact-info-container-horizontal' : '']"
      >
        <h2
          class="contact-info-title"
          :class="[mobile ? 'contact-info-title-mobile' : '', (mobile && orientationH) ? 'contact-info-title-horizontal' : '']"
        >{{ $setting.get('contact.info.title') }}</h2>
        <div v-for="(ele, i) in $setting.get('contact.info.contactInfo')" :key="i">
          <h3
            :class="[mobile ? 'contact-info-subtitle-mobile' : '', (mobile && orientationH) ? 'contact-info-subtitle-horizontal' : '']"
          >{{ ele.title }}</h3>
          <p
            :class="[mobile ? 'contact-info-text-mobile' : '', (mobile && orientationH) ? 'contact-info-text-horizontal' : '']"
          >{{ ele.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mobile", "orientationH"],
  data() {
    return {
      formData: {
        name: null,
        email: null,
        message: null
      },
      url: null
    }
  },
  methods: {
    handlerSubmit() {
      if (this.url) {
        fetch(this.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.formData)
        })
          .then(res => res.json())
          .then(res => {
            console.log(res)
            this.formData.name = null
            this.formData.email = null
            this.formData.message = null
          })
          .catch(error => {
            console.log(error)
          })
      }
      console.log("Not url, formData :", this.formData)
    }
  }
}
</script>

<style>
.contact-page-container {
  background: #fa5855;
  font-family: Work Sans;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 160px 60px;
  height: 100vh;
}
.contact-quote-container {
  margin: 1.2vw 0 0 1.2vw;
  text-align: center;
}
.contact-quote {
  color: #f7ecea;
  font-size: 1.4vw;
  font-weight: bold;
}
.contact-quote-mobile {
  font-size: 25px;
  margin: 10px 0;
}
.contact-quote-horizontal {
  margin: 10px 0 0 0;
}
.contact-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
}
.contact-title-mobile {
  font-size: 20px;
  font-weight: 550;
  margin: 0 0 0 26px;
}
.contact-container {
  margin: auto;
  margin-top: 28vh;
  width: 52vw;
  height: 60vh;
  border-radius: 12px;
  background: #da524f;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
}
.contact-container-mobile {
  grid-template-columns: 1fr;
  margin: 62px 0 0 37px;
  width: 88vw;
  height: 70vh;
  border-radius: 5px;
}
.contact-container-horizontal {
  grid-template-columns: 2fr 1fr;
  margin: 21px 0 0 37px;
  width: 94.5vw;
  height: 75vh;
}
.contact-form-container {
  padding: 1vw;
  display: grid;
  grid-template-columns: 1fr;
}
.contact-form-container-mobile {
  grid-template-rows: 60px 50px 50px 180px 50px;
}
.contact-form-container-horizontal {
  grid-template-rows: 40px 45px 45px 100px 50px;
}
.contact-form-title {
  color: #f7f7f7;
  align-self: center;
  margin: 0;
}
.contact-form-title-mobile {
  font-size: 18.5px;
  text-align: center;
}
.contact-text-field {
  margin-bottom: 1vh;
  padding-left: 1vw;
  background: #bc4947;
  border: 1px solid #bc4947;
  color: #f7f7f7;
  border-radius: 3px;
  outline: none;
  font-size: 0.8vw;
}
.contact-text-field-mobile {
  font-size: 12px;
}
.contact-text-field::placeholder {
  color: #f7f7f7;
  font-size: 0.8vw;
  opacity: 0.8;
}
.contact-text-field-mobile::placeholder {
  font-size: 12px;
  z-index: 1;
}
.contact-textarea {
  padding: 1vw;
  resize: none;
}
.contact-submit-button-container {
  margin-top: 1vh;
  height: 1vh;
}
.contact-form-submit-button {
  background: #f7f7f7;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  color: #fa5855;
  font-size: 1.2vw;
  font-weight: bold;
  width: 17vw;
  height: 5vh;
  outline: none;
}
.contact-form-submit-mobile {
  font-size: 14px;
  width: 120px;
  height: 35px;
  margin: 0 0 0 100px;
}
.contact-form-submit-horizontal {
  font-size: 13px;
  height: 28px;
  margin: 0 0 0 200px;
}
.contact-info-container {
  padding: 1.2vh 0 0 1vw;
  color: #f7f7f7;
  background: #bc4947;
  border-radius: 0 12px 12px 0;
}
.contact-info-container-mobile {
  border-radius: 0 0 5px 5px;
  height: 270px;
}
.contact-info-container-horizontal {
  height: 276px;
}
.contact-info-title-mobile {
  font-size: 18.5px;
  margin: 15px 0 0 0;
  text-align: center;
}
.contact-info-title-horizontal {
  margin: 18px 0 0;
}
.contact-info-subtitle-mobile {
  font-size: 18.5px;
  margin: 22px 0 0 8px;
}
.contact-info-subtitle-horizontal {
  margin: 20px 0 0 12px;
}
.contact-info-text-mobile {
  margin: 9.5px 0 0 8px;
  font-size: 14px;
}
.contact-info-text-horizontal {
  margin: 9.5px 0 0 12px;
  font-size: 13px;
}
</style>
