<template>
  <div class="landing-page">
    <div class="feature">
      <div class="feature-content">
        <h1>{{ post.settings.pageHeading }}</h1>
        <div class="sub">{{ post.settings.pageHeadingSub }}</div>
        <factor-btn size="large" btn="primary">Button</factor-btn>
      </div>
    </div>
    <div class="feature-boxes">
      <div v-for="(box, i) in post.settings.boxes" :key="i" class="box">
        <div v-if="box.icon" class="box-icon">
          <img :src="image(box.icon)" />
        </div>
        <div class="box-heading">{{ box.heading }}</div>
        <div class="box-description">{{ box.description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { stored } from "@factor/api"
import { factorBtn } from "@factor/ui"
export default Vue.extend({
  components: { factorBtn },
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {},
  watch: {},
  templateSettings() {
    return [
      {
        input: "text",
        label: "Heading",
        description: "Primary page heading",
        _id: "pageHeading",
        default: "Landing Page Template"
      },
      {
        input: "text",
        label: "Sub Heading",
        _id: "pageHeadingSub",
        default: "This is a landing page template."
      },
      {
        _id: "boxes",
        input: "sortable",
        label: "Feature Boxes",
        description: "Some feature boxes",
        default: [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }],
        settings: [
          {
            input: "text",
            label: "Heading",
            _id: "heading",
            default: "Box"
          },
          {
            input: "textarea",
            label: "Description",
            _id: "description",
            default: "Box Description"
          },
          {
            input: "image-upload",
            label: "Icon",
            _id: "icon"
          }
        ]
      }
    ]
  },
  methods: {
    stored,
    settings() {
      return ["test"]
    },
    image(attachment: string[]) {
      const aPost = stored(attachment[0])

      return aPost.url || ""
    }
  }
})
</script>

<style lang="less">
.landing-page {
  .feature {
    min-height: 50vh;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .feature-content {
      max-width: 700px;
      padding: 2em;
    }
    h1 {
      font-size: 2.5em;
      font-weight: var(--font-weight-bold);
      line-height: 1;
      margin-bottom: 1rem;
    }
    .sub {
      font-size: 1.6em;
      opacity: 0.6;
      margin-bottom: 2rem;
    }
  }
  .feature-boxes {
    padding: 0 2em;
    max-width: 900px;

    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1.5em;
    margin: 2em auto 5em;
    .box {
      min-width: 0;
    }
    .box-heading {
      font-size: 1.3em;
      font-weight: 600;
      margin-bottom: 0.5em;
    }
    .box-description {
      opacity: 0.7;
      line-height: 1.4;
    }
    .box-icon {
      max-width: 100%;
      margin-bottom: 1.5em;
      img {
        max-width: 100%;
        display: block;
      }
    }
  }
}
</style>
