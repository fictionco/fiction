<template>
  <div>
    <section>
      <div>
        <h3>{{ introPretitle }}</h3>
        <h1>{{ introTitle }}</h1>
        <div v-formatted-text="introContent" />
      </div>
      <div>
        <figure>
          <img :src="introFigure" :alt="introPretitle" />
        </figure>
        <component :is="setting('contactForm.form')" />
      </div>
      <figure>
        <img :src="introFigure2" :alt="introPretitle" />
      </figure>
    </section>
  </div>
</template>

<script>
import { setting } from "@factor/tools"

export default {
  data() {
    return {
      loading: true,
      introPretitle: setting("contact.intro.pretitle"),
      introTitle: setting("contact.intro.title"),
      introContent: setting("contact.intro.content"),
      introFigure: setting("contact.intro.figure"),
      introFigure2: setting("contact.intro.figure2")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("contact.meta.title"),
      description: setting("contact.meta.description"),
      image: setting("contact.meta.image")
    }
  }
}
</script>
