<template>
  <factor-form
    ref="form"
    class="contact-form"
    data-test="contact-form"
    :class="formStatus"
    @submit="send()"
  >
    <div v-if="sent" class="confirm" data-test="confirm">
      <div v-formatted-text="setting('contactForm.confirm.title')" class="title" />
      <div v-formatted-text="setting('contactForm.confirm.subTitle')" class="description" />
    </div>
    <div v-else class="inputs">
      <factor-input-wrap
        v-for="(c, i) in setting('contactForm.layout')"
        :key="i"
        v-model="form[c._id]"
        :data-test="`contact-form-${c._id}`"
        :input="`factor-input-${c.inputType}`"
        :input-classes="`${c.inputClasses}`"
        :required="!!c.required"
        :label="getLabel(c)"
        :label-classes="`${c.labelClasses}`"
        :placeholder="getPlaceholder(c)"
        :format="setting('contactForm.inputFormat', 'horizontal')"
      />
      <factor-input-submit
        :btn="setting('contactForm.submit.btn')"
        :size="setting('contactForm.submit.size')"
        :loading="sending"
        data-test="contact-form-submit"
      >{{ setting("contactForm.submit.text") }}</factor-input-submit>
    </div>
  </factor-form>
</template>

<script lang="ts">
import { factorInputWrap, factorForm, factorInputSubmit } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
import { saveContactForm } from "."

export default Vue.extend({
  components: { factorInputWrap, factorForm, factorInputSubmit },
  data() {
    return {
      sending: false,
      sent: false,
      form: {},
      formStatus: "unchecked"
    }
  },
  mounted() {
    this.$watch(
      "form",
      function(this: any) {
        const v = this.$refs.form.$el.checkValidity()

        this.formStatus = v ? "valid" : "invalid"
      },
      { deep: true }
    )
  },
  methods: {
    setting,
    async send(this: any) {
      this.sending = true

      await saveContactForm(this.form)

      this.sent = true
      this.sending = false
    },
    getLabel(c: any): string {
      const label = [c.label]
      if (c.required && c.label) {
        label.push("*")
      }
      return label.join(" ")
    },
    getPlaceholder(c: any): string {
      const placeholder = [c.placeholder]
      if (c.required && c.placeholder && !c.label) {
        placeholder.push("*")
      }
      return placeholder.join(" ")
    }
  }
})
</script>
