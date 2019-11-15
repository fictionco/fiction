<template>
  <div>
    <section>
      <div>
        <h3 class="font-sans text-lg text-uppercase text-gray-400">
          {{ introPretitle }}
        </h3>
        <h1 class="font-sans text-xl text-gray-800">{{ introTitle }}</h1>
      </div>
      <p class="mt-2 text-gray-600">{{ introContent }}</p>
      <div class="mt-4">
        <template v-for="(button, index) in introButtons">
          <factor-link :key="index" :path="button.link" :class="button.classes">
            {{ button.text }}
            <factor-icon icon="arrow-right" />
          </factor-link>
        </template>
      </div>
    </section>

    <section>
      <h1>{{ clientsTitle }}</h1>
      <template v-for="(item, index) in clientsList">
        <factor-link :key="index" :path="item.link">
          <img :src="item.image" :alt="item.alt" />
        </factor-link>
      </template>
    </section>

    <section>
      <h1>{{ solutionsTitle }}</h1>
      <template v-for="(item, index) in solutionsItems">
        <div :key="index">
          <img :src="item.icon" :alt="item.title" />
          <h2>{{ item.title }}</h2>
          <ul>
            <template v-for="(listItem, i) in item.list">
              <li :key="i">{{ listItem.content }}</li>
            </template>
          </ul>
        </div>
      </template>
    </section>

    <section>
      <div>
        <component :is="devopsFigure" />
      </div>
      <div>
        <h3>{{ devopsPretitle }}</h3>
        <h1>{{ devopsTitle }}</h1>
        <div v-formatted-text="devopsContent" />
        <div>
          <template v-for="(button, index) in devopsButtons">
            <factor-link :key="index" :path="button.link" :class="button.classes">
              {{ button.text }}
              <factor-icon icon="arrow-right" />
            </factor-link>
          </template>
        </div>
      </div>
    </section>

    <section>
      <div>
        <h3>{{ infrPretitle }}</h3>
        <div>
          <h1>{{ infrTitle }}</h1>
          <img :src="infrTitleIcon" :alt="infrTitle" />
        </div>
        <template v-for="(item, index) in infrItems">
          <div :key="index">
            <img :src="item.image" :alt="item.alt" />
            <div v-formatted-text="item.content" />
          </div>
        </template>
      </div>
      <div>
        <component :is="infrSyntax" />
      </div>
    </section>

    <section>
      <h3>{{ testimonialsPretitle }}</h3>
      <h1>{{ testimonialsTitle }}</h1>

      <div>
        <template v-for="(item, index) in testimonialsItems">
          <figure :key="index">
            <blockquote>
              &ldquo;
              <div v-formatted-text="item.content" />
              &rdquo;
            </blockquote>
            <footer>
              <img :src="item.image" :alt="item.author + ' - ' + item.info" />
              <p>
                <cite>{{ item.author }}</cite>
              </p>
              <p>
                <cite>{{ item.info }}</cite>
              </p>
            </footer>
          </figure>
        </template>
      </div>
    </section>

    <site-cta />
  </div>
</template>

<script>
import { setting } from "@factor/tools"
import { factorLink } from "@factor/ui"
export default {
  components: {
    factorLink,
    "site-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true,
      introPretitle: setting("home.intro.pretitle"),
      introTitle: setting("home.intro.title"),
      introContent: setting("home.intro.content"),
      introButtons: setting("home.intro.buttons"),
      clientsTitle: setting("home.clients.title"),
      clientsList: setting("home.clients.list"),
      solutionsTitle: setting("home.solutions.title"),
      solutionsItems: setting("home.solutions.items"),
      devopsFigure: setting("home.devops.figure"),
      devopsPretitle: setting("home.devops.pretitle"),
      devopsTitle: setting("home.devops.title"),
      devopsContent: setting("home.devops.content"),
      devopsButtons: setting("home.devops.buttons"),
      infrPretitle: setting("home.infrastructure.pretitle"),
      infrTitle: setting("home.infrastructure.title"),
      infrTitleIcon: setting("home.infrastructure.titleIcon"),
      infrItems: setting("home.infrastructure.items"),
      infrSyntax: setting("home.infrastructure.syntax"),
      testimonialsPretitle: setting("home.testimonials.pretitle"),
      testimonialsTitle: setting("home.testimonials.title"),
      testimonialsItems: setting("home.testimonials.items")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description")
    }
  }
}
</script>
