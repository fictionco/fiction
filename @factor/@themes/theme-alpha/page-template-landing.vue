<template>
  <div class="landing-page">
    <div class="feature">
      <div class="feature-content">
        <h1>{{ post.pageHeading }}</h1>
        <div class="sub">{{ post.pageHeadingSub }}</div>
        <factor-btn size="large" btn="primary">Button</factor-btn>
      </div>
    </div>
    <div class="feature-boxes">
      <div v-for="(box, i) in post.boxes" :key="i" class="box">
        <div v-if="box.icon" class="box-icon">
          <img :src="box.icon[0].url">
        </div>
        <div class="box-heading">{{ box.heading }}</div>
        <div class="box-description">{{ box.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {},
  pageTemplate() {
    return {
      name: "Landing Page",
      description: "Minimalist landing page template.",
      inputs: [
        {
          input: "text",
          label: "Heading",
          description: "Primary page heading",
          key: "pageHeading"
        },
        {
          input: "text",
          label: "Sub Heading",
          key: "pageHeadingSub"
        },
        {
          key: "boxes",
          input: "sortable",
          label: "Feature Boxes",
          description: "Some feature boxes",
          inputs: [
            {
              input: "text",
              label: "Heading",
              key: "heading"
            },
            {
              input: "textarea",
              label: "Description",
              key: "description"
            },
            {
              input: "image-upload",
              label: "Icon",
              key: "icon"
            }
          ]
        }
      ]
    }
  },
  methods: {
    settings() {
      return ["test"]
    }
  }
}
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
      font-size: 3.5em;
      font-weight: 600;
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
    max-width: 960px;
    margin: 3em auto;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1.5em;
    margin: 2em auto;
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