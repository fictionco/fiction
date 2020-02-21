<template>
  <section v-if="section1" class="intro">
    <div class="intro-inner">
      <h3 v-if="section1Pretitle" class="pretitle text-bluegray-600">{{ section1Pretitle }}</h3>
      <h1 v-if="section1Title" v-formatted-text="section1Title" class="title" />
      <div v-if="section1Content" class="content text-bluegray-600">{{ section1Content }}</div>

      <div v-if="section1Buttons" class="buttons">
        <template v-for="(button, index) in section1Buttons">
          <factor-link
            v-if="button.link"
            :key="index"
            v-formatted-text="button.text"
            :path="button.link"
            :btn="button.btn"
            :class="button.classes"
          />
        </template>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink
  },
  data() {
    return {
      loading: true,
      section1: setting("home.intro"),
      section1Pretitle: setting("home.intro.pretitle"),
      section1Title: setting("home.intro.title"),
      section1Content: setting("home.intro.content"),
      section1Buttons: setting("home.intro.buttons")
    }
  },
  methods: {
    setting
  }
})
</script>
<style lang="less">
.intro {
  background-color: var(--color-bg-dark);
  color: #fff;
  position: relative;

  .intro-inner {
    display: flex;
    flex-direction: column;
    max-width: 850px;
    margin: 0 auto;
    padding: 7em 2em;
    z-index: 1;
    @media (max-width: 900px) {
      padding: 4em 2em;
    }
    .pretitle {
      position: relative;
      text-transform: uppercase;
    }
    .title {
      font-weight: var(--font-weight-bold);
      font-size: 3.6em;
      letter-spacing: -0.03em;
      margin: 10px 0;
      color: #fff;

      @media (max-width: 900px) {
        font-size: 2em;
      }
    }
    .content {
      max-width: 600px;
      font-size: 1.4em;
      line-height: 1.6em;
    }
    .buttons {
      z-index: 2;
      margin-top: 2em;
      .btn + .btn {
        margin-left: 1em;

        @media (max-width: 900px) {
          margin-left: 0;
          margin-top: 1.4em;
        }
        i {
          padding-left: 1rem;
        }
      }
    }
  }
}
</style>
