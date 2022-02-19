<template>
  <div class="extend-container">
    <div class="extend-index-head">
      <div class="content-pad">
        <h1
          class="text-center text-3xl tracking-tight font-bold text-slate-500 sm:text-5xl"
        >
          {{ describe.title }}
        </h1>
        <h3 class="text-color-500 text-2xl mt-4">
          {{ describe.description }}
        </h3>
      </div>
    </div>
    <div
      v-if="extensionType == 'plugin'"
      class="extensions-wrap plugins-wrap max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 grid grid-cols-5 gap-16"
    >
      <SliderPlugin
        :title="`Featured`"
        :extensions="plugins"
        class="grid-featured featured-plugins"
      />
      <div class="grid-sidebar">
        <ExtendSidebar :extensions="plugins" />
      </div>
      <div class="grid-boxes">
        <GridPlugin :title="`All Plugins`" :extensions="plugins" />
      </div>
    </div>
    <div v-else class="extensions-wrap themes-wrap content-pad">
      <GridTheme :extensions="themes" />
    </div>

    <ElemCta
      title="Have A Factor Plugin or Theme?"
      subtitle="Submit Your Extension"
    >
      <a href="mailto:hello@fiction.com">
        <ElButton btn="primary" class="font-bold"> Submit &rarr; </ElButton>
      </a>
    </ElemCta>
  </div>
</template>

<script lang="ts" setup>
import { isLoggedIn, stored } from "@factor/api"
import ElButton from "@factor/ui/ElButton.vue"
import ElemCta from "../el/ElCta.vue"
import IconPlaceholder from "../img/icon-plugin-blog.svg"
import ScreenshotPlaceholder from "../img/screenshot-wide.jpg"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import {
  extensionImage,
  extensionPermalink,
  formatDownloads,
  getAuthors,
  postType,
  titleFromPackage,
} from "./helpers"
const route = useRoute()

const loading = ref(false)
const getData = ref("")
const plugins = ref([
  {
    path: "sitemap-xml",
    screenshots: [ScreenshotPlaceholder],
    icon: IconPlaceholder,
    title: "Sitemap",
    description:
      "Advanced automatically generated sitemaps for your Factor app",
  },
  {
    path: "syntax-highlight",
    icon: IconPlaceholder,
    title: "Syntax Highlight",
    description: "Add a syntax highlighting component to your Factor app.",
  },
  {
    path: "seo-metatags",
    icon: IconPlaceholder,
    title: "SEO Metatags",
    description: "This plugin makes it easy to implement and edit your SEO.",
  },
  {
    path: "contact-form",
    icon: IconPlaceholder,
    title: "Contact Form",
    description: "This plugin makes it easy to add a contact form to your app.",
  },
  {
    path: "bugsnag",
    icon: IconPlaceholder,
    title: "Bugsnag",
    description: "This plugin implements Bugsnag in your Factor app.",
  },
  {
    path: "email-list",
    icon: IconPlaceholder,
    title: "Email List",
    description:
      "Plugin to collect email addresses for invite list, launch list or newsletter.",
  },
  {
    path: "standard-blog",
    icon: IconPlaceholder,
    title: "Standard Blog",
    description:
      "A standard blog plugin that can be easily customized to meet any blogging need in your Factor app.",
  },
  {
    path: "forum",
    icon: IconPlaceholder,
    title: "Forum",
    description:
      "Factor forum is a powerful forum solution for your factor app. This plugin comes with essential elements to run an efficient and professional community.",
  },
  {
    path: "google-tag-manager",
    icon: IconPlaceholder,
    title: "Google Tag Manager",
    description: "This plugin adds Google Tag Manager to your Factor app.",
  },
  {
    path: "job-board",
    icon: IconPlaceholder,
    title: "Job Board",
    description:
      "This plugin makes it easy to create and manage a job board in your Factor app.",
  },
])

const getPosts = async () => {
  loading.value = true

  //await requestIndex({ extensionType: this.extensionType })

  loading.value = false
}

const describe = computed(() => {
  return extensionType.value == "plugin"
    ? {
        title: "Example Plugins",
        description: "Add new features to your app in seconds",
      }
    : {
        title: "Example Themes",
        description: "Sample themes to build beautiful apps in minutes",
      }
})

const extensionType = computed(() => {
  return route.path.includes("theme") ? "theme" : "plugin"
})
</script>
<style lang="less">
.extend-container {
  font-weight: 400;
  overflow: hidden;
  .coming-soon {
    box-shadow: var(--panel-shadow);
    border-radius: 10px;
    line-height: 1.4;
    text-align: center;
    padding: 6rem 2em 6rem;
    .title {
      font-size: 2rem;
      font-weight: 700;
    }
    .sub-title {
      font-size: 1.5em;
    }
    .actions {
      margin-top: 2rem;
      .cta-tag {
        display: block;
        margin-top: 0.5rem;
        font-weight: 600;
      }
    }
  }

  .extend-index-head {
    padding: 6em 0;
    text-align: center;
    .title {
      font-size: 2.5em;
      line-height: 1.1;
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: -0.03em;
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }
    .sub-title {
      font-size: 1.5em;
      color: var(--color-text-secondary);
    }
    @media (max-width: 900px) {
      text-align: left;
      .title {
        font-size: 2em;
      }
      .sub-title {
        font-size: 1.3em;
      }
    }
  }

  .spinner-wrap {
    min-height: 400px;
  }

  .content-pad {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  @media (max-width: 900px) {
    padding-top: 0;
    .extend-index-head {
      padding: 4em 0;
    }
  }

  .extensions-wrap {
    &.plugins-wrap {
      display: grid;
      grid-gap: 4rem;
      grid-template-columns: 250px 2fr;
      grid-template-areas: "grid-featured grid-featured" "grid-sidebar grid-boxes";
      .grid-featured {
        grid-area: grid-featured;
      }
      .grid-boxes {
        grid-area: grid-boxes;
      }
      .grid-sidebar {
        grid-area: grid-sidebar;
      }
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-template-areas: "grid-featured" "grid-boxes" "grid-sidebar";
        grid-gap: 2rem;
      }
    }
  }
}
</style>
