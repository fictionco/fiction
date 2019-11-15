<template>
  <div>
    <section>
      <h3>{{ introPretitle }}</h3>
      <h1>{{ introTitle }}</h1>
      <div v-formatted-text="introContent" />
    </section>

    <section>
      <template v-for="(item, index) in pricingPackages">
        <div :key="index">
          <h1>{{ item.name }}</h1>
          <p>{{ item.description }}</p>
          <ul :class="item.classes">
            <template v-for="(listItem, i) in item.list">
              <li :key="i" v-formatted-text="listItem.content"></li>
            </template>
          </ul>
          <factor-link :key="index" :path="item.buttonLink" :class="item.buttonClasses">
            {{ item.buttonText }}
            <factor-icon icon="arrow-right" />
          </factor-link>
        </div>
      </template>
      <p>{{ packagesFooter }}</p>
    </section>

    <section>
      <h3>{{ faqTitle }}</h3>
      <template v-for="(question, ind) in questions">
        <el-accordion :key="ind" :title="question.title">
          <div v-formatted-text="question.content" />
        </el-accordion>
      </template>
    </section>
  </div>
</template>

<script>
import { setting } from "@factor/tools"

export default {
  components: {
    "el-accordion": () => import("./el/accordion.vue")
  },
  data() {
    return {
      loading: true,
      introPretitle: setting("pricing.intro.pretitle"),
      introTitle: setting("pricing.intro.title"),
      introContent: setting("pricing.intro.content"),
      pricingPackages: setting("pricing.packages"),
      packagesFooter: setting("pricing.packagesFooter"),
      faqTitle: setting("pricing.faq.title"),
      questions: setting("pricing.faq.questions")
    }
  },
  methods: {
    setting
  },
  metaInfo() {
    return {
      title: setting("pricing.meta.title"),
      description: setting("pricing.meta.description"),
      image: setting("pricing.meta.image")
    }
  }
}
</script>
