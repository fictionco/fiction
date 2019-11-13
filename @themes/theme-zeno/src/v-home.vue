<template>
  <div>
    <section>
      <div>
        <h3
          class="font-sans text-lg text-uppercase text-gray-400"
        >Grow Your Business, Not Infrastructure.</h3>
        <h1
          class="font-sans text-xl text-gray-800"
        >We build, optimize, secure, and support your cloud with no long-term contract.</h1>
      </div>
      <p
        class="mt-2 text-gray-600"
      >Experts that architect and manage clouds with dedicated and obsessive 24/7/365 support.</p>
      <div class="mt-4 mr-4">
        <a
          href="#"
          class="inline-block bg-green-300 text-indigo-600 text-sm px-5 py-3 rounded shadow uppercase tracking-wider font-semibold"
        >Contact Us</a>
      </div>
      <div class="mt-4">
        <a
          href="#"
          class="inline-block bg-gray-100 text-indigo-600 text-sm px-5 py-3 rounded shadow uppercase tracking-wider font-semibold"
        >Pricing</a>
      </div>
    </section>
    <section>
      <h1 class="mb-6">Working with the following clouds:</h1>

      <template v-for="(item, index) in setting('home.clients')">
        <factor-link :key="index" :path="item.link">
          <img :src="item.image" :alt="item.alt" />
        </factor-link>
      </template>
    </section>
  </div>
</template>

<script>
import { setting } from "@factor/tools"
export default {
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description")
    }
  },
  methods: { setting }
}
</script>

<style lang="less">
.feature {
  text-align: center;
}
</style>
