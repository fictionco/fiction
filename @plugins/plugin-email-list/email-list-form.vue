<template>
  <div class="email-list-form">
    <div v-if="validation" class="messages">
      <div v-if="validation" class="validation">{{ validation }}</div>
    </div>

    <div class="add-email" :class="added ? 'disabled' : ''">
      <input
        v-model="email"
        type="email"
        :placeholder="setting('form.placeholder')"
        @keyup.enter="add()"
      />
      <factor-btn btn="primary" :loading="sending" @click="add()">
        <span v-formatted-text="setting('form.buttonText')" />
      </factor-btn>
    </div>
    <component :is="confirmModal" v-if="confirmModal" :added="added" :list-id="listId" />
  </div>
</template>
<script>
import { getSetting, getListSettings, addEmail } from "@factor/plugin-email-list"
import { factorBtn } from "@factor/ui"
export default {
  components: { factorBtn },
  props: {
    listId: { type: String, default: "default" }
  },
  data() {
    return {
      email: "",
      sending: false,
      added: false,
      validation: "",
      confirmModal: this.setting(`success.modal`)
    }
  },
  computed: {
    settings() {
      return getListSettings(this.listId)
    },
    tags() {
      return this.setting("tags") || []
    }
  },
  methods: {
    setting(key) {
      return getSetting({
        key,
        listId: this.listId
      })
    },
    async add() {
      this.sending = true

      const validated = this.validate()

      if (validated) {
        const result = await addEmail({
          email: this.email,
          listId: this.listId,
          tags: this.tags
        })

        if (result) {
          this.added = true
          this.email = ""
        } else {
          this.validate(this.setting("validation.error"))
        }
      }

      this.sending = false
    },
    validate(validationMessage = "") {
      this.validation = validationMessage

      if (!this.email) {
        this.validation = this.setting("validation.empty")
      } else if (!this.regex().test(this.email)) {
        this.validation = this.setting("validation.notEmail")
      }

      setTimeout(() => {
        this.validation = ""
      }, 5000)

      return !this.validation ? true : false
    },
    regex() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
  }
}
</script>

<style lang="less">
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
