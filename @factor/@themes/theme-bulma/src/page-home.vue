<template>
  <div class="home">
    <section class="section is-medium has-background-white">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-6 is-5-fullhd is-offset-1-fullhd">
            <h1 class="title is-1">Theme Bulma</h1>
            <p
              class="subtitle"
            >Based on the open source CSS framework that uses flexbox and is used by more than 150,000 developers. Theme Bulma makes using the CSS framework in Factor a breeze.</p>
            <div class="field is-group">
              <app-link class="button is-primary is-medium is-rounded" path="/">Get Started</app-link>
              <app-link
                class="button is-light is-medium is-rounded"
                path="/elements"
              >Elements Preview</app-link>
            </div>
          </div>
          <div class="column is-6 has-background-dark">
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

    <section class="section is-usp has-background is-medium">
      <div class="container">
        <div class="columns">
          <div class="column is-4">
            <div class="card is-usp">
              <img role="presentation" src="/assets/images/icons/family-c0f52dde.svg?1553506572">
              <hr class="spacer is-1">
              <h3 class="title is-4 is-spaced">Quality Family Time</h3>
              <p
                class="subtitle is-5"
              >Storytelling plays a vital role when growing up. Create lasting memories and embark on fantastic journeys with beloved characters.</p>
            </div>
          </div>
          <div class="column is-4">
            <div class="card is-usp">
              <img role="presentation" src="/assets/images/icons/bookshelf-b83dab6e.svg?1553506572">
              <hr class="spacer is-1">
              <h3 class="title is-4 is-spaced">Teach Valuable Life Lessons</h3>
              <p
                class="subtitle is-5"
              >We deeply care about diversity and empowerment - each Storyworld contains educational aspects and storytelling tips to teach valuable life lessons.</p>
            </div>
          </div>
          <div class="column is-4">
            <div class="card is-usp">
              <img role="presentation" src="/assets/images/icons/book-96ff6ee1.svg?1553506572">
              <hr class="spacer is-1">
              <h3 class="title is-4 is-spaced">A Safety Net for Storytelling</h3>
              <p
                class="subtitle is-5"
              >Each bedtime story includes an easy-to-remember summary of Storypoints and the interactive Storybuilder generates millions of exciting storylines.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hero is-medium is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered level">
            <div class="column is-5-desktop is-6-tablet is-12-mobile">
              <h2
                class="title is-3 is-size-4-mobile has-text-centered has-text-left-tablet"
              >We assist in resolving over 2.5 Million issues every month for 500+ companies.</h2>
              <app-link
                class="button button is-primary is-outlined is-inverted is-rounded is-medium"
                path="/"
              >Customer Stories</app-link>
            </div>
            <div class="column is-7-desktop is-offset-1">
              <img :src="require(`./img/logo-grid.png`)" alt="Logo Grid">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="box is-fullheight">
              <h3 class="title is-5 is-spaced">Generate Leads</h3>
              <p>Increase leads when you use high-grade templates in your next project. Free marketing comes from happy clients.</p>
            </div>
          </div>
          <div class="column">
            <div class="box is-fullheight">
              <h3 class="title is-5 is-spaced">Long Term Value</h3>
              <p>Increase your ROI and generate more value by investing in a month-to-month subscription plan.</p>
            </div>
          </div>
          <div class="column">
            <div class="box is-fullheight has-background-primary">
              <h3 class="title is-5 is-spaced has-text-white">Create Consistent Style</h3>
              <p
                class="has-text-white"
              >Never worry about your website’s performance or style when using well designed templates.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

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
                path="/"
              >Let's do this</app-link>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="is-block">
        <div class="container">
          <div class="columns is-mobile">
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
      </div>-->
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
