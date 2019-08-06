<template>
  <factor-form
    ref="form"
    class="contact-form"
    data-test="contact-form"
    :class="formStatus"
    @submit="send()"
  >
    <div v-if="sent" class="confirm" data-test="confirm">
      <div class="title">{{ $setting.get('contactForm.confirm.title') }}</div>
      <div class="description">{{ $setting.get('contactForm.confirm.subTitle') }}</div>
    </div>
    <div v-else class="inputs">
      <factor-input-wrap
        v-for="(c, i) in $setting.get('contactForm.layout')"
        :key="i"
        v-model="form[c._id]"
        :data-test="`contact-form-${c._id}`"
        :input="`factor-input-${c.inputType}`"
        :required="!!c.required"
        :label="getLabel(c)"
        :format="$setting.get('contactForm.inputFormat', 'horizontal')"
      />
      <factor-input-submit
        el="app-btn"
        btn="primary"
        :loading="sending"
        data-test="contact-form-submit"
      >{{ $setting.get('contactForm.submitText') }}</factor-input-submit>
    </div>
  </factor-form>
</template>

<script>
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
    async send() {
      this.sending = true
      await this.$contactForm.save(this.form)

      this.sent = true
      this.sending = false
    },
    getLabel(c) {
      const label = [c.label]
      if (c.required) {
        label.push("*")
      }
      return label.join(" ")
    }
  }
}
</script>