<template>
  <div id="contactPageContainerID" class="contact-page-container">
    <div class="contact-quote-container">
      <h4 class="contact-quote">{{ $setting.get('contact.quote') }}</h4>
      <h2 class="contact-title">{{ $setting.get('contact.title') }}</h2>
    </div>
    <div class="contact-container">
      <div class="contact-form-container">
        <h2 class="contact-form-title">{{ $setting.get('contact.form.title') }}</h2>
        <input
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
        </div>
      </div>
      <div class="contact-info-container">
        <h2 class="contact-info-title">{{ $setting.get('contact.info.title') }}</h2>
        <div v-for="(ele, i) in $setting.get('contact.info.contactInfo')" :key="i">
          <h3>{{ ele.title }}</h3>
          <p>{{ ele.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  height: 100%;
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
.contact-title {
  color: #f7f7f7;
  font-size: 2.2vw;
  font-weight: bold;
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
.contact-form-container {
  padding: 1vw;
  display: grid;
  grid-template-columns: 1fr;
}
.contact-form-title {
  color: #f7f7f7;
  align-self: center;
  margin: 0;
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
.contact-text-field::placeholder {
  color: #f7f7f7;
  font-size: 0.8vw;
  opacity: 0.8;
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
.contact-info-container {
  padding: 1.2vh 0 0 1vw;
  color: #f7f7f7;
  background: #bc4947;
  border-radius: 0 12px 12px 0;
}
</style>
