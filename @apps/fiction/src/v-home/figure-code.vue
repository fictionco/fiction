<template>
  <figure ref="wrapper" class="factor-figure figure-code">
    <!-- <div class="stage-wrap" :style="{transform: `scale(${scale})`}"> -->
    <div class="stage-wrap">
      <div class="card">
        <div class="code-container">
          <factor-highlight-code>
            <pre><code class="prism language-html">{{ code() }}</code></pre>
          </factor-highlight-code>
        </div>
        <div class="shine" />
      </div>
      <div class="screenshots">
        <div class="screenshot factor">
          <img src="./img/screencast-poster.jpg" />
        </div>
        <div class="screenshot alpha">
          <img src="./img/theme-alpha.jpg" />
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import { factorHighlightCode } from "@factor/plugin-highlight-code"
import Vue from "vue"

export default Vue.extend({
  components: { factorHighlightCode },
  //mixins: [pageUtils().figureMixin({ ref: "wrapper", width: 500 })],
  methods: {
    code() {
      return `<template>
  <div class="view-contact">
      <div class="text">
        <h1 class="title">Contact Us</h1>
        <div
          class="sub-title"
        >We're happy to answer your questions. Fill out the form and we’ll be in touch as soon as possible.</div>
      </div>
      <div class="contact-form">
        <div class="grid">
          <component :is="setting('contactForm.form')" />
          <aside>
             We're looking forward to hearing from you...
          </aside>
        </div>
      </div>
  </div>
</template>`
    }
  }
})
</script>

<style lang="less">
#feature-factor {
  .feature-figure-container {
    align-self: center;
    height: auto;
    min-width: 0;
  }
  @media (max-width: 900px) {
    .feature-figure-container {
      transform-origin: center center;

      // figure {
      //   transform: translateX(0) translateY(2rem);
      // }
      figure {
        transform: none;
      }
    }
  }
}
.figure-code.factor-figure {
  perspective: 2000px;
  position: relative;
  transform: translateX(-3rem);

  .screenshots {
    .screenshot {
      max-width: 500px;
      z-index: 10;
      transform-origin: top center;
      // position: absolute;
      // bottom: 0;
      // left: 0;
      box-shadow: -20px 0px 125px -25px rgba(50, 50, 93, 0.3),
        -15px -16px 20px rgba(0, 0, 0, 0.1), 0px -18px 36px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      overflow: hidden;
      img {
        width: 100%;
      }
      &.factor {
        //transform: translateZ(-10px) rotateY(5deg) translateX(-2rem);
        transform: translateZ(-10px) rotateY(5deg) translateX(-2rem) translateY(-10rem);
      }
      &.alpha {
        position: absolute;
        bottom: 6em;
        right: -4em;
        transform: translateZ(10px) scale(0.9) rotateY(5deg);
      }
    }
    @media (max-width: 900px) {
      min-height: 250px;
      margin: 3em 0;
      .screenshot {
        &.factor {
          transform: scale(0.85) translateX(-2em);
          top: -2em;
          right: auto;
          bottom: auto;
          left: 0;
          box-shadow: 0 4px 35px 0 rgba(23, 55, 87, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.07);
        }
        &.alpha {
          transform: scale(0.85) translateX(2em);
          top: 3em;
          right: 0;
          bottom: auto;
          left: auto;
        }
      }
    }
  }

  .card {
    flex-shrink: 0;
    border-radius: 8px;
    position: relative;
    width: 525px;
    transform: rotate(-1deg) translateZ(-25px) translate(-7rem, 5rem);
    //transform: rotate(-1deg) translateZ(-25px) translate(-7rem, -2rem);
    // box-shadow: -27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
    //   -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
    background: #fff;
    opacity: 0.4;
    display: flex;
    flex-direction: column;
    @media (max-width: 900px) {
      display: none;
    }
  }
  .code-container {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    font-size: 0.875em;
    line-height: normal;

    pre {
      overflow: auto;
      position: relative;
      white-space: pre;
      code {
        font-family: monospace;
      }
    }
  }
}
</style>
