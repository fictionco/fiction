<template>
  <div class="start-container pt-20">
    <nav
      class="nav z-50 items-center justify-center bg-white px-4 py-2 lg:sticky lg:top-0 lg:flex"
    >
      <a
        v-for="(video, index) in videos"
        :key="video.id"
        class="mx-0 block rounded-md px-4 py-1 font-bold uppercase text-slate-500 hover:bg-color-50 hover:text-primary-500 lg:mx-4"
        :class="video.id == selected ? 'active bg-primary-500 text-white' : ''"
        :href="`#${video.id}`"
      >
        {{ index + 1 }}. {{ toLabel(video.id) }}
      </a>
    </nav>
    <div class="start-content">
      <section
        v-for="video in videos"
        :id="video.id"
        :key="video.id"
        class="video-entry"
      >
        <div class="header">
          <h1 class="mb-1 text-2xl font-bold lg:text-5xl">
            {{ toLabel(video.id) }}
          </h1>
          <div class="mt-3 flex items-center">
            <div class="time">
              <span
                class="mr-6 rounded-md bg-primary-500 px-2 py-1 text-white"
                >{{ video.duration }}</span
              >
            </div>
            <div class="text-2xl text-color-500">{{ video.synopsis }}</div>
          </div>
        </div>
        <div class="video-wrap">
          <div class="video">
            <iframe :src="video.url" frameborder="0" allowfullscreen />
          </div>
          <div class="font-semibold" v-html="video.content" />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toLabel } from "@factor/api"
import { onMounted, ref } from "vue"

const selected = ref("install")
const videos = ref([
  {
    id: "install",
    url: "https://www.youtube.com/embed/m0tckSo1KUg?rel=0",
    duration: "1 Minute",
    synopsis: "Get Factor running locally with a theme in 60 seconds",
    content: "Set up a basic FactorJS app from scratch in around a minute.",
  },
  {
    id: "customize",
    url: "https://www.youtube.com/embed/8CwXEsZ0PHU?rel=0",
    duration: "3 Minutes",
    synopsis: "Additional customization of your app",
    content:
      "Learn how to work with your FactorJS app. Learn how to add endpoints, sitemaps, and additional tricks.",
  },

  {
    id: "deploy",
    url: "https://www.youtube.com/embed/dCtGNqpuDxs?rel=0",
    duration: "3 Minutes",
    synopsis: "Create a repo and continuously deploy to Heroku",
    content: `Deploying a Factor app is simple and takes two steps: <ul class="list-inside list-decimal"><li>Build</li><li>Serve</li></ul>`,
  },
])

onMounted(() => {
  /**
   * Scrolling changes, sometimes IntersectionObserver isn't available
   */
  if (IntersectionObserver) {
    videos.value.forEach((video: { id: string }) => {
      const selector = `#${video.id}`
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            selected.value = entries[0].target.id
          }
        },
        { threshold: [0.7] },
      )

      const el = document.querySelector(selector)
      if (el) {
        observer.observe(el)
      }
    })
  }
})
</script>
<style lang="less">
.start-container {
  .start-content {
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
  }
  @media (max-width: 900px) {
    padding-top: 5em;
    .start-content {
      padding: 0 1rem;
    }
  }
}
.video-entry {
  margin: 0 1.8em;
  padding: 6rem 0 3em;

  @media (max-width: 900px) {
    margin: 0;
  }

  .header {
    .time .tag {
      display: inline-block;
      background: var(--color-primary);
      color: #fff;
      border-radius: 8px;
      padding: 0 1rem;
      margin-right: 2rem;
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

      .synopsis {
        opacity: 0.5;
        font-size: 1.5em;
      }

      @media (max-width: 900px) {
        display: block;
        .synopsis {
          margin: 1rem 0 0;
        }
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
      grid-gap: 2rem;
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
        background: var(--color-bg-highlight);
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
