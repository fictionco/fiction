<template>
  <div class="email-list-form">
    <div v-if="validation" class="messages">
      <div v-if="validation" class="validation">{{ validation }}</div>
    </div>

    <div class="add-email" :class="added? 'disabled' : ''">
      <input
        v-model="email"
        type="email"
        :placeholder="$setting.get('emailList.form.placeholder')"
        @keyup.enter="add()"
      >
      <factor-app-btn btn="primary" :loading="sending" @click="add()">
        <span v-formatted-text="$setting.get('emailList.form.buttonText')" />
      </factor-app-btn>
    </div>
    <component :is="confirmModal" v-if="confirmModal" :added="added" />
  </div>
</template>
<script>
export default {
  props: {
    listId: { type: String, default: "emailList" }
  },
  data() {
    return {
      email: "",
      sending: false,
      added: false,
      validation: "",
      confirmModal: this.$setting.get(`emailList.success.modal`)
    }
  },
  methods: {
    async add() {
      this.sending = true

      const validated = this.validate()

      if (validated) {
        const result = await this.$emailList.addEmail({
          email: this.email,
          listId: this.listId
        })

        if (result) {
          this.added = true
          this.email = ""
        } else {
          this.validate("Whoops.. There was an issue adding your email.")
        }
      }

      this.sending = false
    },
    validate(validationMessage = "") {
      this.validation = validationMessage

      if (!this.email) {
        this.validation = `Please enter an email address. ${this.email}`
      } else if (!this.regex().test(this.email)) {
        this.validation = `Please enter a valid email address`
      }

      setTimeout(() => {
        this.validation = ""
      }, 5000)

      return !this.validation ? true : false
    },
    regex() {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
  }
}
</script>

<style lang="less">
// .added-modal {
//   .added-title {
//     font-size: 2em;
//   }
//   .confirm-icon {
//     svg {
//       height: 64px;
//       width: 64px;
//     }
//   }
// }
.email-list-form {
  .add-email {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr minmax(min-content, auto);
    @media (max-width: 580px) {
      grid-template-columns: 1fr;
    }
    &.disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  }

  .messages {
    margin: 1rem 0;
  }
}
</style>
