<template>
  <div class="page-contact">
    <el-hero :pretitle="contactPretitle" :title="contactTitle" :image="contactHeroImage">
      <template v-slot:hero-content>
        <div v-if="contactContent" v-formatted-text="contactContent" class="content text-gray-600" />
        <!-- Contact Form Plugin -->
        <component :is="setting('contactForm.form')" />
      </template>
    </el-hero>

    <section class="resources">
      <div class="mast">
        <div>
          <h3
            v-if="contactResourcesPretitle"
            v-formatted-text="contactResourcesPretitle"
            class="pretitle"
          />
          <h1 v-if="contactResourcesTitle" v-formatted-text="contactResourcesTitle" class="title" />
        </div>
        <div v-if="contactResourcesItems" class="resources-items">
          <div v-for="(item, i) in contactResourcesItems" :key="i" class="item">
            <h2 class="item-title">{{ item.title }}</h2>
            <p v-formatted-text="item.content" class="item-description text-gray-600" />
          </div>
        </div>
      </div>
    </section>

    <section class="location">
      <div class="mast">
        <div class="location-items">
          <div v-if="contactLocationMap" v-formatted-text="contactLocationMap" class="map-wrap" />
          <div>
            <div class="location-content-wrap">
              <h3
                v-if="contactLocationPretitle"
                v-formatted-text="contactLocationPretitle"
                class="pretitle"
              />
              <h1
                v-if="contactLocationTitle"
                v-formatted-text="contactLocationTitle"
                class="title"
              />
              <div
                v-if="contactLocationContent"
                v-formatted-text="contactLocationContent"
                class="location-content text-gray-600"
              />
              <factor-link
                v-if="contactLocationButton"
                v-formatted-text="setting('contact.location.button.text')"
                :path="setting('contact.location.button.link')"
                :class="setting('contact.location.button.classes')"
                :target="setting('contact.location.button.target')"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon,
    factorLink,
    "el-hero": () => import("./el/hero.vue")
  },
  data() {
    return {
      loading: true,
      contactPretitle: setting("contact.pretitle"),
      contactTitle: setting("contact.title"),
      contactContent: setting("contact.content"),
      contactHeroImage: setting("contact.heroImage"),
      contactResourcesPretitle: setting("contact.resources.pretitle"),
      contactResourcesTitle: setting("contact.resources.title"),
      contactResourcesItems: setting("contact.resources.items"),
      contactLocationMap: setting("contact.location.map"),
      contactLocationPretitle: setting("contact.location.pretitle"),
      contactLocationTitle: setting("contact.location.title"),
      contactLocationContent: setting("contact.location.content"),
      contactLocationButton: setting("contact.location.button")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("contact.metatags.title"),
      description: setting("contact.metatags.description"),
      image: setting("contact.metatags.image")
    }
  }
})
</script>

<style lang="less">
.page-contact {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  .hero {
    .hero-inner {
      padding: 5em 0;
    }
  }

  .pretitle {
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .title {
    font-weight: var(--font-weight-bold);
    font-size: 3em;
    letter-spacing: -0.03em;
    color: var(--color-text);
    margin-bottom: 2rem;

    @media (max-width: 900px) {
      font-size: 2em;
    }
  }

  //Overwrite contact form plugin styles
  .contact-form {
    margin-top: 2rem;
    .input-wrap .label {
      font-weight: var(--font-weight-bold);
      font-size: 1.2rem;
      letter-spacing: -0.03em;
      margin-bottom: 0.5rem;
    }
    input,
    textarea {
      background: #ffffff;
      border: 1px solid rgba(48, 48, 48, 0.1);
      border-radius: 4px;
      &:focus {
        outline: var(--color-primary) auto 5px;
      }
    }
    .form-submit {
      button {
        display: inline-block;
        line-height: 1;
        font-weight: var(--font-weight-bold);
        font-size: 1em;
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      }
    }
  }
  .confirm {
    padding: 3em 2em;
    text-align: center;
    .description {
      font-size: 1.2em;
      line-height: 1.6em;
      color: #718096;
    }
  }
  .resources {
    padding: 4em 0;
    .resources-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2rem;
      .item {
        .item-title {
          font-weight: var(--font-weight-bold);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;

          @media (max-width: 900px) {
            font-size: 1.2rem;
          }
        }
        .item-description {
          line-height: 1.6rem;
        }
      }

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
  }
  .location {
    padding: 4em 0;
    background: var(--color-bg-alt);

    .location-items {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 0;
      align-items: center;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 3em;
      }

      .location-content-wrap {
        width: 120%;
        margin-left: -20%;
        position: relative;
        z-index: 1;
        padding: 2rem;
        border-radius: 0.5rem;
        background: #fff;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);

        @media (max-width: 900px) {
          width: 100%;
          margin-left: 0;
          padding: 0;
          background: transparent;
          box-shadow: none;
        }
      }

      .location-content {
        font-size: 1.2em;
        line-height: 1.6em;
        margin-bottom: 1rem;
      }

      .map-wrap iframe {
        max-width: 100%;
        border-radius: 0.5rem;
      }
    }
  }
}
</style>
