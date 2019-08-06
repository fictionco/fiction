<template>
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
</template>