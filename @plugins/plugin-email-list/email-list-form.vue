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
<script lang="ts">
import { getSetting, getListSettings, addEmail } from "@factor/plugin-email-list"
import { factorBtn } from "@factor/ui"
export default {
  components: { factorBtn },
  props: {
    listId: { type: String, default: "default" },
  },
  data(this: any) {
    return {
      email: "",
      sending: false,
      added: "",
      validation: "",
      confirmModal: this.setting(`success.modal`),
    }
  },
  computed: {
    settings(this: any) {
      return getListSettings(this.listId)
    },
    tags(this: any) {
      return this.setting("tags") || []
    },
  },
  methods: {
    setting(this: any, key: string) {
      return getSetting({
        key,
        listId: this.listId,
      })
    },
    async add(this: any) {
      this.sending = true

      const validated = this.validate()

      if (validated) {
        try {
          await addEmail({
            email: this.email,
            listId: this.listId,
            tags: this.tags,
          })

          this.added = this.email
          this.email = ""
        } catch (error) {
          this.validate(this.setting("validation.error"))
        }
      }

      this.sending = false
    },
    validate(this: any, validationMessage = "") {
      this.validation = validationMessage

      if (!this.email) {
        this.validation = this.setting("validation.empty")
      } else if (!this.regex().test(this.email)) {
        this.validation = this.setting("validation.notEmail")
      }

      const SECOND = 1000

      setTimeout(() => {
        this.validation = ""
      }, SECOND * 8)

      return !this.validation ? true : false
    },
    regex() {
      return /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\d-AZa-z-]+\.)+[A-Za-z]{2,}))$/
    },
  },
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
