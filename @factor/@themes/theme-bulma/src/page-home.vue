<template>
  <div class="home">
    <section class="section is-medium">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-5 has-text-centered has-text-left-tablet">
            <h1 class="title is-1">{{ $setting.get('home.headline') }}</h1>
            <p class="subtitle">{{ $setting.get('home.subheadline') }}</p>
            <div class="field buttons">
              <factor-link
                v-for="(action ,i) in $setting.get('home.actions')"
                :key="i"
                :path="action.path"
                :class="action.class"
                size="medium"
              >{{ action.text }}</factor-link>
            </div>
          </div>
          <div class="column is-6 is-offset-1">
            <component :is="$setting.get(`home.graphic`)" />
          </div>
        </div>
      </div>
    </section>

    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered is-mobile level is-variable is-8 logos">
            <div
              v-for="(logo ,i) in $setting.get('home.logos')"
              :key="i"
              class="column is-one-third-mobile"
            >
              <figure class="image">
                <img :src="logo.imageURL" :alt="logo.imageAlt" >
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section is-medium">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-three-fifths mb-4 has-text-centered">
            <h1 class="title is-3">{{ $setting.get('home.boxesHeadline') }}</h1>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="columns is-multiline">
          <div v-for="(box ,i) in $setting.get('home.boxes')" :key="i" class="column is-half">
            <div class="box is-fullheight">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48 is-4by3">
                    <img :src="box.imageURL" :alt="box.title" >
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    {{ box.logo }}
                    <h3 class="title is-4 mb-2">{{ box.title }}</h3>
                    <p>{{ box.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true
    }
  },
  metatags() {
    return {
      title: this.$setting.get("home.meta.title"),
      description: this.$setting.get("home.meta.description")
    }
  }
}
</script>
<style lang="less">
.home {
  .hero-graphic {
    filter: drop-shadow(15px 15px 10px rgba(0, 0, 0, 0.1));
  }
  .subtitle {
    opacity: 0.5;
  }
  .logos {
    flex-wrap: wrap;
    .image img {
      max-height: 80px;
    }
  }
  @media (max-width: 767px) {
    .buttons {
      justify-content: center;
    }
    .logos .image img {
      max-height: 32px;
    }
  }
}
</style>
