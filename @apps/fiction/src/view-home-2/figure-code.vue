<template>
  <figure class="code-card">
    <div class="card">
      <div class="code-container">
        <plugin-highlight-code>
          <pre><code class="prism language-html">{{ code() }}</code></pre>
        </plugin-highlight-code>
      </div>
      <div class="shine" />
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
</template>`
    }
  }
}
</script>

<style lang="less">
figure.code-card {
  perspective: 1500px;
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;
  padding-bottom: 80px;
  transform: scale(0.7);
  margin: -80px 0;

  @media (min-width: 420px) {
    transform: none;
    margin: 0;
  }

  .card {
    flex-shrink: 0;
    border-radius: 8px;
    position: relative;
    width: 525px;
    height: 400px;
    transform: rotate3d(0.1, 0.866, 0, 15deg) rotateZ(-1deg);
    box-shadow: -27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
      -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
    background: var(--color-bg-contrast);
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
  .shine {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(
      to top right,
      hsla(0, 0%, 100%, 0) 20%,
      hsla(0, 0%, 100%, 0.5) 70%,
      #fff
    );
    opacity: 0.2;
  }
}
</style>
