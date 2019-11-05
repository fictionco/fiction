<template>
  <factor-form
    ref="form"
    class="contact-form"
    data-test="contact-form"
    :class="formStatus"
    @submit="send()"
  >
    <div v-if="sent" class="confirm" data-test="confirm">
      <div class="title">{{ setting('contactForm.confirm.title') }}</div>
      <div class="description">{{ setting('contactForm.confirm.subTitle') }}</div>
    </div>
    <div v-else class="inputs">
      <factor-input-wrap
        v-for="(c, i) in setting('contactForm.layout')"
        :key="i"
        v-model="form[c._id]"
        :data-test="`contact-form-${c._id}`"
        :input="`factor-input-${c.inputType}`"
        :required="!!c.required"
        :label="getLabel(c)"
        :placeholder="getPlaceholder(c)"
        :format="setting('contactForm.inputFormat', 'horizontal')"
      />
      <factor-input-submit
        :btn="setting('contactForm.submit.btn')"
        :size="setting('contactForm.submit.size')"
        :loading="sending"
        data-test="contact-form-submit"
      >{{ setting('contactForm.submit.text') }}</factor-input-submit>
    </div>
  </factor-form>
</template>

<script>
import { setting } from "@factor/tools"
export default {
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
      function() {
        const v = this.$refs.form.$el.checkValidity()

        this.formStatus = v ? "valid" : "invalid"
      },
      { deep: true }
    )
  },
  methods: {
    setting,
    async send() {
      this.sending = true
      await this.$contactForm.save(this.form)

      this.sent = true
      this.sending = false
    },
    getLabel(c) {
      const label = [c.label]
      if (c.required && c.label) {
        label.push("*")
      }
      return label.join(" ")
    },
    getPlaceholder(c) {
      const placeholder = [c.placeholder]
      if (c.required && c.placeholder && !c.label) {
        placeholder.push("*")
      }
      return placeholder.join(" ")
    }
  }
}
</script>