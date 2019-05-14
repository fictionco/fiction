<template>
  <section class="mast">
    <div class="cta">
      <div>
        <h3 class="title">Ready to Start Building?</h3>
        <p class="subtitle">Get in touch or create an account</p>
      </div>
      <div class="actions">
        <app-link path="/" btn="primary" size="large">
          Home
          <i class="fa fa-arrow-right" />
        </app-link>
        <app-link path="https://www.fiction.com/contact" btn="tertiary" size="large">Contact Us</app-link>
      </div>
    </div>
  </section>
</template>

<style lang="less">
.cta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 60px;
  padding: 4em 0;
  @media (max-width: 767px) {
    display: block;
  }
  .title {
    font-weight: 800;
    font-size: 2em;
    letter-spacing: -0.03em;
    line-height: 1.2em;
    margin-bottom: 0.2em;
  }
  .subtitle {
    opacity: 0.5;
    font-size: 1.2em;
    font-weight: 500;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: 767px) {
      display: block;
      margin-top: 1.5em;
    }
  }
}
</style>