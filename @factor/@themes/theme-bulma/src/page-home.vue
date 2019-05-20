<template>
  <div class="home">
    <section class="section is-large">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-6 is-5-fullhd is-offset-1-fullhd">
            <h1 class="title is-spaced is-1">Theme Bulma</h1>
            <p class="subtitle">
              <!-- <strong>Bulma</strong> is a free, open source CSS framework based on
              <strong>Flexbox</strong> and used by more than
              <strong>150,000</strong> developers.-->
              Based on the open source CSS framework that uses flexbox and is used by more than 150,000 developers. Theme Bulma makes using the CSS framework in Factor a breeze.
            </p>
            <div class="field is-group">
              <app-link class="button is-primary is-medium is-rounded" path="/">Get Started</app-link>
              <app-link class="button is-light is-medium is-rounded" path="/">Read the Docs</app-link>
            </div>
          </div>
          <div class="column is-6">
            <h2>Temporary Placeholder</h2>
            <app-link path="/">Just a link</app-link>
            <iframe
              src="https://player.vimeo.com/video/237608586?color=00d1b2"
              width="100%"
              height="338"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
              data-vimeo-tracked="true"
              data-ready="true"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="section call-to-action hero is-primary has-text-centered">
      <div class="container is-narrow">
        <div class="box">
          <div class="columns level">
            <div class="column level-item">
              <h1 class="title">Start a project</h1>
            </div>
            <div class="column level-item">
              <p>Interested in building with bulma in the factor framework? We should get started. I’ll setup bulma.</p>
            </div>
            <div class="column level-item">
              <a
                class="button is-primary is-outlined is-rounded is-medium"
                href="/project-planner"
              >Let's do this</a>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="columns level is-mobile">
          <div class="column has-text-centered">
            <div>
              <p class="heading">Tweets</p>
              <p class="title">3,456</p>
            </div>
          </div>
          <div class="column has-text-centered">
            <div>
              <p class="heading">Following</p>
              <p class="title">123</p>
            </div>
          </div>
          <div class="column has-text-centered">
            <div>
              <p class="heading">Followers</p>
              <p class="title">456K</p>
            </div>
          </div>
          <div class="column has-text-centered">
            <div>
              <p class="heading">Likes</p>
              <p class="title">789</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns level is-mobile notification">
          <div class="column has-text-centered">
            <div>
              <p class="heading">Tweets</p>
              <p class="title">3,456</p>
            </div>
          </div>
          <div class="column has-text-centered">
            <div>
              <p class="heading">Following</p>
              <p class="title">123</p>
            </div>
          </div>
          <div class="column has-text-centered">
            <div>
              <p class="heading">Followers</p>
              <p class="title">456K</p>
            </div>
          </div>
          <div class="column has-text-centered">
            <div>
              <p class="heading">Likes</p>
              <p class="title">789</p>
            </div>
          </div>
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
      title: "Theme Bulma",
      description:
        "Bulma is a free, open source CSS framework based on Flexbox and used by more than 150,000 developers.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.home {
  // .columns {
  //   background: rgb(186, 250, 255);
  // }
}
</style>
