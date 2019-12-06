<template>
  <section id="contact" class="page-container contact-container">
    <h2 class="pretitle">{{ setting('contact.pretitle') }}</h2>
    <h1 class="title">{{ setting('contact.title') }}</h1>
    <div class="form-wrap">
      <div>
        <h2 class="heading">{{ setting('contact.form.title') }}</h2>
        <component :is="setting('contactForm.form')" />
      </div>
      <div>
        <h2 class="heading">{{ setting('contact.info.title') }}</h2>
        <div v-for="(item, i) in setting('contact.info.items')" :key="i" class="info-item">
          <h3 class="item-title">{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/tools/settings"
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      loading: true
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
    color: var(--color-text-light);
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
    border-radius: var(--border-radius);
    overflow: hidden;
    color: var(--color-text-light);
    background: var(--color-primary-dark);

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    > div {
      padding: 2rem;
      &:nth-child(2) {
        background: var(--color-primary-darker);
      }
      .heading {
        font-size: 1.4rem;
        font-weight: var(--font-weight-semibold);
        letter-spacing: -0.03em;
        line-height: 1.1;
        margin-bottom: 2rem;
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

    .info-item {
      margin-bottom: 1rem;
      font-size: 1.1rem;
      .item-title {
        font-weight: var(--font-weight-semibold);
      }
    }
  }
}
</style>
