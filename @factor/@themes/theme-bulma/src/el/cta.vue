<template>
  <section class="section is-primary has-text-centered hero call-to-action">
    <div class="container is-narrow">
      <div class="box has-text-white">
        <div class="columns level">
          <div class="column level-item">
            <h1 class="title">Made with Factor</h1>
          </div>
          <div class="column level-item">
            <p>Interested in using the factor framework with bulma? We should get started. I’ll setup bulma.</p>
          </div>
          <div class="column level-item">
            <app-link
              class="button is-primary is-outlined is-rounded is-medium has-text-white"
              path="https://www.fiction.com/"
              target="_blank"
            >
              Let's do this
              <factor-icon icon="arrow-right" class="ml-2" />
            </app-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="less">
.section.call-to-action {
  margin-top: 5.5em;

  .box {
    padding: var(--section-padding);
    margin-top: -9rem;
    background-color: var(--dark);
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px var(--dark);
  }
}
</style>