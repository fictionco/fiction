<template>
  <figure class="factor-figure">
    <div class="card">
      <div class="code-container">
        <plugin-highlight-code>
          <pre><code class="prism language-html">{{ code() }}</code></pre>
        </plugin-highlight-code>
      </div>
      <div class="shine" />
    </div>
    <div class="screenshots">
      <div class="screenshot factor">
        <img src="./img/screencast-poster.jpg" >
      </div>
      <div class="screenshot alpha">
        <img src="./img/theme-alpha.jpg" >
      </div>
    </div>
  </figure>
</template>

<script>
export default {
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
          <component :is="$setting.get('contactForm.form')" />
          <aside>
             We're looking forward to hearing from you...
          </aside>
        </div>
      </div>
  </div>
</template>`
    }
  }
}
</script>

<style lang="less">
#feature-factor {
  .feature-figure-container {
    align-self: center;
    height: auto;
  }
}
figure.factor-figure {
  perspective: 2000px;
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;

  transform: translateX(-3rem);

  .screenshots {
    .screenshot {
      z-index: 10;
      transform-origin: bottom center;
      position: absolute;

      bottom: 0;
      left: 0;
      box-shadow: -27.1px 42.5px 125px -25px rgba(50, 50, 93, 0.3),
        -16.2px 27.5px 55px -37.5px rgba(0, 0, 0, 0.6);
      border-radius: 6px;
      overflow: hidden;
      img {
        width: 100%;
      }
      &.factor {
        transform: translateZ(1px) rotateY(5deg) translateX(-2rem);
      }
      &.alpha {
        transform: translateZ(1px) scale(0.7) rotateY(5deg)
          translate(8rem, 2rem);
      }
    }
  }

  .card {
    flex-shrink: 0;
    border-radius: 8px;
    position: relative;
    width: 525px;

    transform: rotate3d(0.1, 0.866, 0, 15deg) rotateZ(-1deg)
      translate(-7rem, -2rem);
    // box-shadow: -27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
    //   -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
    background: #fff;
    opacity: 0.4;
    display: flex;
    flex-direction: column;
  }
  .code-container {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    font-size: 0.875em;
    line-height: normal;

    pre {
      position: relative;
      white-space: pre;
      code {
        font-family: monospace;
      }
    }
  }
}
</style>
