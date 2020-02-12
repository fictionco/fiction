<template>
  <section v-if="setting('home.intro')" class="intro">
    <div class="intro-inner">
      <h3 class="pretitle text-white">{{ section1Pretitle }}</h3>
      <h1 v-formatted-text="section1Title" class="title" />
      <div class="content">{{ section1Content }}</div>

      <div v-if="section1Buttons" class="buttons">
        <template v-for="(button, index) in section1Buttons">
          <factor-link
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
  background-color: var(--color-primary-dark, #1a49bd);
  color: #fff;
  position: relative;

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    -webkit-clip-path: polygon(0 0, 0 100%, 100% 100%);
    top: 0;
    left: 0;
  }

  .intro-inner {
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: column;
    max-width: 650px;
    margin: 0 auto;
    padding: 7em 0;
    z-index: 1;
    @media (max-width: 900px) {
      padding: 4em 0;
    }
    .pretitle {
      position: relative;
      padding-bottom: 2em;
      text-transform: uppercase;
      &:after {
        background-color: var(--color-tertiary);
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 24px;
        height: 7px;
        margin: -3.5px 0 0 -12px;
        transform: skewY(-16deg) scaleX(1);
        transform-origin: 0 100%;
      }
    }
    .title {
      font-weight: var(--font-weight-bold, 800);
      font-size: 3em;
      letter-spacing: -0.03em;
      margin: 0.5em;
      color: #fff;

      @media (max-width: 900px) {
        font-size: 2em;
      }
    }
    .content {
      opacity: 0.7;
      font-size: 1.2em;
      line-height: 1.6em;
    }
    .buttons {
      z-index: 2;
      margin-top: 1.5em;
      .btn + .btn {
        margin-left: 1em;
        i {
          padding-left: 1rem;
        }
      }
    }
  }
}
</style>
