<template>
  <section id="contact" class="page-container contact-container text-gray-100">
    <h2 v-if="contactPretitle" v-formatted-text="contactPretitle" class="pretitle" />
    <h1 v-if="contactTitle" v-formatted-text="contactTitle" class="title" />
    <div class="form-wrap text-gray-100 bg-red-600 rounded-lg">
      <div class="fields">
        <h2 v-if="contactFormTitle" v-formatted-text="contactFormTitle" class="heading" />
        <component :is="setting('contactForm.form')" />
      </div>
      <div class="info">
        <h2 v-if="contactInfoTitle" v-formatted-text="contactInfoTitle" class="heading" />
        <div v-for="(item, i) in contactInfoItems" :key="i" class="info-item">
          <h3 class="item-title">{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      loading: true,
      contactPretitle: setting("contact.pretitle"),
      contactTitle: setting("contact.title"),
      contactFormTitle: setting("contact.form.title"),
      contactInfoTitle: setting("contact.info.title"),
      contactInfoItems: setting("contact.info.items")
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.contact-container {
  background: var(--color-primary);
  justify-items: center;
  @media (max-width: 900px) {
    justify-items: initial;
  }

  .pretitle,
  .title {
    max-width: 800px;
    text-align: center;
  }

  .pretitle {
    font-size: 1.4em;
    @media (max-width: 900px) {
      font-size: 1.2rem;
    }
  }
  .title {
    font-size: 3.2em;
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.03em;
    line-height: 1.1;
    @media (max-width: 900px) {
      font-size: 2.2rem;
    }
  }
  .form-wrap {
    display: grid;
    grid-template-columns: 2fr 1fr;
    max-width: 800px;
    margin-top: 2rem;
    margin-bottom: 2rem;
    overflow: hidden;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .fields,
    .info {
      padding: 2rem;
      .heading {
        font-size: 1.4rem;
        font-weight: var(--font-weight-semibold);
        letter-spacing: -0.03em;
        line-height: 1.1;
        margin-bottom: 2rem;
      }
    }

    .info {
      background: var(--color-primary-darker);
      .info-item {
        margin-bottom: 1rem;
        font-size: 1.1rem;
        .item-title {
          font-weight: var(--font-weight-semibold);
        }
      }
    }

    .contact-form {
      .input-wrap .input-area .the-input {
        display: grid;
        grid-template-columns: 1fr;
        min-height: 2.2rem;
        input,
        textarea {
          border: none;
          border-radius: 5px;
          padding: 0.6rem 0.8rem;
          font-size: 1.1rem;
          font-family: inherit;
          color: var(--text-color);
          background: var(--color-primary-darker);
          &:focus {
            outline: none;
            box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          &::placeholder {
            color: var(--text-color);
            opacity: 0.75;
          }
        }
      }
      .form-submit {
        text-align: left;
        margin: 2em 0 0;
      }
    }
  }
}
</style>
