<template>
  <div class="example wrap">
    <div class="inputs">
      <p>
        <label>Text</label>
        <factor-input-text v-model="form.text" />
      </p>
      <p>
        <label>Textarea</label>
        <factor-input-textarea v-model="form.textarea" />
      </p>
      <p>
        <label>Password</label>
        <factor-input-password v-model="form.password" />
      </p>
      <p>
        <label>Email</label>
        <factor-input-email v-model="form.email" />
      </p>
      <p>
        <label>Phone</label>
        <factor-input-phone v-model="form.phone" />
      </p>
    </div>
    <div class="drawer">
      <h3>Value</h3>
      <div class="value">{{ form }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  factorInputText,
  factorInputTextarea,
  factorInputPassword,
  factorInputEmail,
  factorInputPhone,
} from "@factor/ui"

export default {
  components: {
    factorInputText,
    factorInputTextarea,
    factorInputPassword,
    factorInputEmail,
    factorInputPhone,
  },
  data() {
    return {
      form: {
        text: "",
        textarea: "",
        phone: "",
        password: "",
        email: "",
      },
    }
  },
}
</script>

<style lang="less" scoped>
.wrap {
  align-items: center;

  display: flex;
  flex-wrap: wrap;
  p {
    margin: 1rem;
  }
  .drawer {
    margin-top: 1.5rem;
    .value {
      opacity: 0.6;
      font-weight: 600;
      font-family: "Courier New", Courier, monospace;
      font-size: 0.8em;
    }
  }
}
</style>
