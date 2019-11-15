<template>
  <div>
    <section>
      <h3>{{ introPretitle }}</h3>
      <h1>{{ introTitle }}</h1>
      <figure>
        <img :src="introImage" :alt="introPretitle" />
      </figure>
    </section>

    <section>
      <h1>{{ teamTitle }}</h1>
      <template v-for="(member, index) in teamMembers">
        <div :key="index">
          <img :src="member.photo" :alt="member.name" />
          <template v-for="(social, i) in member.social">
            <factor-link :key="i" :path="social.link">
              <factor-icon :icon="social.icon" />
            </factor-link>
          </template>
          <h2>{{ member.title }}</h2>
          <h1>{{ member.name }}</h1>
          <p>{{ member.content }}</p>
        </div>
      </template>
    </section>

    <section>
      <h1>{{ locationTitle }}</h1>
      <component :is="locationFigure" />
    </section>

    <site-cta />
  </div>
</template>

<script>
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/tools"

import Vue from "vue"
export default Vue.extend({
  components: {
    factorIcon,
    factorLink,
    "site-cta": () => import("./el/cta.vue")
  },
  data() {
    return {
      loading: true,
      introPretitle: setting("about.intro.pretitle"),
      introTitle: setting("about.intro.title"),
      introImage: setting("about.intro.image"),
      teamTitle: setting("about.team.title"),
      teamMembers: setting("about.team.members"),
      locationTitle: setting("about.location.title"),
      locationFigure: setting("about.location.figure")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("about.meta.title"),
      description: setting("about.meta.description")
    }
  }
})
</script>
