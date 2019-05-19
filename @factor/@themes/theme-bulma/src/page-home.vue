<template>
  <div class="home">
    <section class="section">
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

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control">
                <input class="input is-small" type="text" placeholder="Small input">
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="Normal input">
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input class="input is-medium" type="text" placeholder="Medium input">
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input class="input is-large" type="text" placeholder="Large input">
              </div>
            </div>
            <textarea class="textarea" placeholder="e.g. Hello world" />
            <div class="control">
              <textarea class="textarea" placeholder="Disabled textarea" disabled />
            </div>
            <div class="select is-primary is-multiple">
              <select class="multi-select" multiple size="8">
                <option value="Argentina">Argentina</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Brazil">Brazil</option>
                <option value="Chile">Chile</option>
                <option value="Colombia">Colombia</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Guyana">Guyana</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Suriname">Suriname</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Venezuela">Venezuela</option>
              </select>
            </div>
            <div class="field">
              <div class="control">
                <div class="select is-small">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select is-medium">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select is-large">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>
            <label class="checkbox">
              <input type="checkbox">
              I agree to the
              <a href="#">terms and conditions</a>
            </label>
            <div class="control">
              <label class="radio">
                <input type="radio" name="rsvp">
                Going
              </label>
              <label class="radio">
                <input type="radio" name="rsvp">
                Not going
              </label>
              <label class="radio" disabled>
                <input type="radio" name="rsvp" disabled>
                Maybe
              </label>
            </div>
            <div class="file is-boxed">
              <label class="file-label">
                <input class="file-input" type="file" name="resume">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload" />
                  </span>
                  <span class="file-label">Choose a file…</span>
                </span>
              </label>
            </div>
          </div>
        </div>
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
  // .columns {
  //   background: rgb(186, 250, 255);
  // }
}
</style>
