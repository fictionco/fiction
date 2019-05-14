<template>
  <div class="home">
    <section class="hero">
      <div class="hero-body">
        <div class="container hero-splash">
          <div class="columns is-vcentered">
            <div class="column is-6 is-5-fullhd is-offset-1-fullhd">
              <h1 class="title is-spaced">Theme Bulma</h1>
              <p class="subtitle">
                <strong>Bulma</strong> is a free, open source CSS framework based on
                <strong>Flexbox</strong> and used by more than
                <strong>150,000</strong> developers.
              </p>
              <div class="field is-group">
                <app-link class="button is-primary is-medium" path="/">Get Started</app-link>
                <app-link class="button is-light is-medium" path="/">Read the Docs</app-link>
              </div>
            </div>
            <div class="column is-6">
              <h2>Temporary Placeholder</h2>
              <iframe
                src="https://player.vimeo.com/video/237608586?color=00d1b2"
                width="640"
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
      </div>
    </section>

    <section class="section">
      <div class="container">
        <nav class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Tweets</p>
              <p class="title">3,456</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Following</p>
              <p class="title">123</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Followers</p>
              <p class="title">456K</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Likes</p>
              <p class="title">789</p>
            </div>
          </div>
        </nav>
      </div>
    </section>

    <section class="boxes-wrap">
      <div class="mast">
        <div class="boxes">
          <div class="box">
            <h2>Static Hosting</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div class="box">
            <h2>100% JavaScript</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div class="box">
            <h2>NPM Plugins</h2>
            <p>Factor plugins are NPM packages that you can install to any project. This is a growing library.</p>
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
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1024px;
    margin: 0 auto;
  }

  // .hero-splash {
  //   max-width: 700px;
  //   .subtitle {
  //     font-size: 1.6rem;
  //   }
  // }

  // .splash-wrap {
  //   .splash {
  //     display: grid;
  //     grid-template-columns: 1fr;
  //     grid-column-gap: 60px;
  //     align-items: center;
  //     text-align: center;

  //     padding: 6em 2em;
  //     .actions {
  //       margin-top: 1.5em;
  //       @media (max-width: 767px) {
  //         margin-bottom: 1.5em;
  //         a {
  //           display: inline-block;
  //           margin-bottom: 10px;
  //         }
  //       }
  //     }
  //   }
  // }

  .boxes-wrap {
    padding: 4em 0;
    .boxes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 40px;
      @media (max-width: 767px) {
        display: block;
      }
      .box {
        margin: 2em 0;
        text-align: center;
        @media (max-width: 767px) {
          margin: 1em 0 2em;
        }
        h2 {
          font-size: 1.4em;
          line-height: 1.4em;
          font-weight: 800;
          margin: 0;
        }
        p {
          font-weight: 500;
          line-height: 1.4em;
          margin-top: 0.5em;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
