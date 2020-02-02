<template>
  <div class="start-container">
    <nav class="nav">
      <factor-link
        v-for="(video, index) in videos"
        :key="video.id"
        :class="video.id == 'install' ? 'active': ''"
        :path="`#${video.id}`"
      >{{ index + 1 }}. {{ toLabel(video.id) }}</factor-link>
    </nav>
    <section v-for="(video) in videos" :id="video.id" :key="video.id" class="video-entry">
      <div class="header">
        <h1 class="title">{{ toLabel(video.id) }}</h1>
        <div class="subtitle">
          <span class="time">{{ video.duration }}</span>
          <p class="synopsis">{{ video.synopsis }}</p>
        </div>
      </div>
      <div class="video-wrap">
        <div class="video">
          <iframe :src="video.url" frameborder="0" allowfullscreen />
        </div>
        <div v-formatted-text="video.context" class="video-content" />
      </div>
    </section>

    <join-program />
  </div>
</template>

<script lang="ts">
import { toLabel } from "@factor/api"
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    joinProgram: () => import("./el-join.vue")
  },
  data() {
    return {
      loading: true,
      videos: [
        {
          id: "install",
          url: "https://www.youtube.com/embed/m0tckSo1KUg?rel=0",
          duration: "1 Minute",
          synopsis: "Get Factor running locally with a theme in 60 seconds",
          context:
            "In this video you'll use <p><code>npx create-factor-app</code></p> to download and scaffold your first app."
        },
        {
          id: "customize",
          url: "https://www.youtube.com/embed/8CwXEsZ0PHU?rel=0",
          duration: "3 Minutes",
          synopsis: "Simple customization with 'factor-settings'",
          context:
            "Factor merges settings files together taking your app's as the highest priority. "
        },
        {
          id: "manage",
          url: "https://www.youtube.com/embed/SHmjfTMrhkM?rel=0",
          duration: "4 Minutes",
          synopsis: "Add your own DB and run the dashboard",
          context:
            "Setting up your own DB takes seconds and only requires a MongoDb style connection string."
        },
        {
          id: "deploy",
          url: "https://www.youtube.com/embed/dCtGNqpuDxs?rel=0",
          duration: "3 Minutes",
          synopsis: "Create a repo and continuously deploy to Heroku",
          context:
            "Deploying a Factor app is simple and takes two steps: <ol><li>Build</li><li>Serve</li></ol>"
        }
      ]
    }
  },
  metaInfo() {
    return {
      title: "Factor Themes Built and Curated by the Factor Team.",
      description:
        "Factor Themes is a collection of the best templates and themes curated by Factor's creators. Our collection of templates include themes to build a landing page, a static site, an application, and more."
    }
  },
  methods: { toLabel }
})
</script>
<style lang="less">
.start-container {
  padding-top: 7em;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 767px) {
    padding: 0 1rem;
  }

  .nav {
    background: #fff;
    padding: 0.5rem 1rem;
    top: 45px;
    position: sticky;
    display: flex;
    justify-content: center;
    z-index: 1000;
    a {
      color: inherit;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2em 1em;
      border-radius: 6px;
      margin: 0 1rem;
      &.active,
      &:hover {
        background: var(--color-bg-contrast-more);
        color: var(--color-primary);
        opacity: 1;
      }
    }
  }
  .start {
    padding-bottom: 6em;
  }
  .customize {
    padding: 0 0 3em;
  }
  .deploy {
    padding: 3em 0;
  }

  .cta {
    margin: 0 0 2em;
    button.app-btn.link {
      color: #fff;
      background: rgba(0, 0, 0, 0.1);

      &:hover {
        background: #0c1647; //rgba(0, 0, 0, 0.15);
      }
    }
  }
}
.video-entry {
  margin: 0 1.8em;
  padding: 3em 0;

  .header {
    .time {
      background: var(--color-primary);
      color: #fff;
      border-radius: 8px;
    }
    .title {
      font-size: 4em;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      display: flex;
      max-width: 800px;
      align-items: center;
      .time {
        padding: 0 1rem;
        margin-right: 2rem;
      }
      .synopsis {
        opacity: 0.5;
        font-size: 1.5em;
      }

      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }

  .video-wrap {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-gap: 4rem;
    padding-top: 3em;
    align-items: center;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .video {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      width: 100%;

      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);

      iframe,
      object,
      embed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .video-content {
      font-size: 1.2em;
      font-weight: 500;
      line-height: 1.5;

      code {
        display: block;
        font-size: 0.9em;
        margin: 0.25em 0;
        padding: 0 1rem;
        background: var(--color-bg-contrast-more);
        color: var(--color-secondary);
        border-radius: 6px;
      }
      ol {
        list-style-position: inside;
      }
      @media (max-width: 767px) {
        font-size: 1.2em;
      }
    }
  }
}
</style>
