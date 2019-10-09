<template>
  <div class="view-contact">
    <div class="hhh">
      <div class="stripes">
        <div class="wedge" />
      </div>
      <div class="text">
        <h1 class="title">
          Contact
          <span class="arrow">&darr;</span>
        </h1>
        <div
          class="sub-title"
        >We're happy to answer your questions. Fill out the form and we’ll be in touch as soon as possible.</div>
      </div>
    </div>
    <div class="contact-wrap">
      <div class="contact-area">
        <div class="grid">
          <component :is="$setting.get('contactForm.form')" />

          <div class="aside">
            <div class="title" />
            <div class="sub-title">We're looking forward to hearing from you...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: "Contact Sales or Support at Fiction",
      description: "Contact sales or support at Fiction.",
      image: require("./img/fiction.jpg")
    }
  }
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
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
      padding: 0 1rem;
      letter-spacing: -0.03em;

      .arrow {
        color: var(--color-primary);
      }
    }
    .title {
      font-size: 3em;
      margin-bottom: 1rem;
      line-height: 1;
      @media (max-width: 900px) {
        font-size: 2em;
      }
    }

    .sub-title {
      font-size: 1.3em;
      font-weight: 500;
      opacity: 0.6;
      @media (max-width: 900px) {
        font-size: 1.2em;
      }
    }

    .stripes {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -72px;
      top: 50%;
      transform: skewY(-6deg);
      transition: opacity 0.2s ease-out;
      will-change: transform;
      .wedge {
        position: absolute;
        height: 5000px;
        bottom: 0;
        background: #fff;
        left: 0;
        right: 0;
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
      max-width: 960px;
      margin: 0 auto;
      align-items: center;
      display: grid;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .aside {
      padding: 1.5em;
      font-size: 1.8em;
      line-height: 1.3;
      .title {
        font-size: 1.5em;
      }
      .sub-title {
        font-weight: 500;
        opacity: 0.5;
      }
    }
  }
  .contact-form {
    padding: 1.5em;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 0 0.4px rgba(50, 50, 93, 0.05),
      0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3);
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