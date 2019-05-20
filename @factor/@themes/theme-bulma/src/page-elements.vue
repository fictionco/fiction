<template>
  <div class="elements">
    <section class="hero is-light is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Elements</h1>
          <h2 class="subtitle">Bulma Elements and styles preview</h2>
        </div>
      </div>
    </section>
    <section class="hero is-dark is-fullheight">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Dark title</h1>
          <h2 class="subtitle">Dark subtitle</h2>
        </div>
      </div>
    </section>
    <section class="hero is-primary is-large">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Primary title</h1>
          <h2 class="subtitle">Primary subtitle</h2>
        </div>
      </div>
    </section>
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Info title</h1>
          <h2 class="subtitle">Info subtitle</h2>
        </div>
      </div>
    </section>
    <section class="hero is-success">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Success title</h1>
          <h2 class="subtitle">Success subtitle</h2>
        </div>
      </div>
    </section>
    <section class="hero is-warning">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Warning title</h1>
          <h2 class="subtitle">Warning subtitle</h2>
        </div>
      </div>
    </section>
    <section class="hero is-danger">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Danger title</h1>
          <h2 class="subtitle">Danger subtitle</h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "Bulma Elements",
      description:
        "Bulma is a free, open source CSS framework based on Flexbox and used by more than 150,000 developers.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.elements {
  // .columns {
  //   background: rgb(186, 250, 255);
  // }
}
</style>
