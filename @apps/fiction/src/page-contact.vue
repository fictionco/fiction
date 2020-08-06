<template>
  <div class="view-contact">
    <div class="hhh">
      <div class="text">
        <h1 class="title">Contact</h1>
        <div class="sub-title">
          We're happy to answer your questions. Fill out the form and we’ll be in touch as
          soon as possible.
        </div>
      </div>
    </div>
    <div class="contact-wrap">
      <div class="contact-area">
        <div class="grid">
          <component :is="setting('contactForm.form')" />

          <div class="aside">
            <div class="title" />
            <div class="sub-title">We're looking forward to hearing from you...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
export default {
  data() {
    return {
      loading: true,
    }
  },
  metaInfo() {
    return {
      title: "Contact Sales or Support at Fiction",
      description: "Contact sales or support at Fiction.",
      image: require("./img/fiction.jpg"),
    }
  },
  methods: { setting },
}
</script>
<style lang="less">
.view-contact {
  padding-top: 4rem;
  .hhh {
    position: relative;
    text-align: center;
    line-height: 1.4;
    letter-spacing: -0.03em;
    padding: 5em 0;

    @media (max-width: 900px) {
      padding: 1em 0;
      text-align: left;
    }

    .text {
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
      padding: 0 1rem;
      letter-spacing: -0.03em;
    }
    .title {
      font-size: 3em;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1;

      @media (max-width: 900px) {
        font-size: 2em;
      }
    }

    .sub-title {
      font-size: 1.6rem;
      font-weight: 500;
      color: var(--color-text-secondary);

      @media (max-width: 900px) {
        font-size: 1.2em;
      }
    }
  }
  .contact-wrap {
    padding: 2em 0 4em;
  }
  .contact-area {
    position: relative;
    z-index: 10;
    .grid {
      padding: 0 1em;
      max-width: 700px;
      margin: 0 auto;
    }
    .aside {
      padding: 1.5em;
      font-size: 1.8em;
      line-height: 1.3;
      .title {
        font-size: 1.6em;
      }
      .sub-title {
        font-size: 1rem;
        font-weight: 500;
        text-align: center;
      }
    }
  }
  .contact-form {
    color: #000;
    padding: 1.5em;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 0 0.4px rgba(50, 50, 93, 0.05),
      0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3);

    .input-wrap .label {
      font-family: "Mark Pro", var(--font-family-primary);
      font-weight: var(--font-weight-bold);
    }

    input[type="email"],
    input[type="password"],
    input[type="search"],
    input[type="tel"],
    input[type="text"],
    select,
    textarea {
      color: #000;
      background: #fff;
    }
  }
  .confirm {
    padding: 8em 2em;
    text-align: center;
    .title {
      font-size: 1.7em;
    }

    .description {
      opacity: 0.5;
    }
    .actions {
      margin-top: 1em;
    }
  }
  .support {
    text-align: center;
    margin-top: 3em;
    font-weight: 500;
    .description {
      font-size: 0.85em;
      opacity: 0.6;
    }
  }
}
</style>
