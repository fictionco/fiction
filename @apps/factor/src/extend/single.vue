<template>
  <div class="extension-single">
    <section class="splash">
      <div class="ext-content-area header">
        <div class="overlay" />
        <div class="ext-content-pad header-pad">
          <div class="content">
            <factor-link class="back" :path="`/${extensionType}s`">
              <span>&larr; Back to {{ extensionType == 'theme' ? "Themes" : "Plugins" }}</span>
            </factor-link>
            <div class="text">
              <div class="title-wrap">
                <div v-if="headerFormat != 'icon'" class="icon-area">
                  <img :src="post.icon" alt="Theme logo" class="extension-icon" />
                </div>
                <h1 class="title">{{ post.title }}</h1>
                <h3 class="description">{{ post.synopsis }}</h3>
                <div class="actions">
                  <factor-link btn="primary" @click="scrollTo(`#install`)">Add to Project &darr;</factor-link>
                  <factor-link
                    v-if="post.demo"
                    btn="default"
                    :path="post.demo"
                    target="_blank"
                  >View Demo &rarr;</factor-link>
                </div>
              </div>
            </div>
          </div>
          <div class="media">
            <div v-if="headerFormat == 'icon'" class="icon-splash">
              <div
                class="icon-image"
                :style="{ backgroundImage: `url('${headerScreenshots[0]}')` }"
              />
            </div>
            <div v-else class="drawer" :class="headerFormat">
              <transition-group tag="div" name="gallery">
                <div
                  v-for="(img, i) in headerScreenshots"
                  :key="img"
                  class="screenshot"
                  :class="`sc-${i + 1}`"
                  :style="screenshotStyle(i)"
                  @click="nextScreenshot()"
                >
                  <div class="screenshot-image" :style="{ backgroundImage: `url('${img}')` }" />
                </div>
              </transition-group>
              <div v-if="headerScreenshots.length > 1" class="arrow-wrap">
                <div class="arrow" @click="nextScreenshot()">&rarr;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="information">
      <div class="ext-content-area lightshots">
        <div class="ext-content-pad" />
      </div>
      <div class="ext-content-area blocks">
        <div class="ext-content-pad">
          <div v-for="(block, i) in infoItems" :id="block" :key="i" class="block-grid">
            <div class="title">{{ toLabel(block) }}</div>
            <div class="info" :class="block">
              <div v-if="block == 'install'" class="install-extension">
                <div class="title-header">
                  <div class="sub-title">Add this package to your Factor enabled project:</div>
                </div>
                <div class="move-to-project">
                  <div class="install-code" @click="copyPackageName(post.packageName)">
                    <span class="cmd">npm add</span>
                    <span class="pkg">{{ post.packageName }}</span>
                  </div>
                  <div class="copy">{{ isCopied }}</div>
                </div>
              </div>
              <div v-else-if="block == 'meta'" class="meta">
                <div class="meta-grid">
                  <div v-for="(meta, ii) in metaItems" :key="ii" class="meta-item">
                    <div class="title">{{ meta.name }}</div>
                    <factor-link v-if="meta.link" class="link" :path="meta.value">{{ meta.link }}</factor-link>
                    <div v-else class="value">{{ meta.value }}</div>
                  </div>
                </div>
              </div>
              <div v-else-if="block == 'screenshots'" class="lightshots-wrap">
                <div
                  v-for="(screenshot, iii) in post.screenshots"
                  :key="iii"
                  class="lightshot"
                  :style="bgImage(screenshot)"
                  @click="lightboxShow = true; lightboxIndex = i"
                />
              </div>
              <div v-else class="entry-wrap">
                <text-entry class="entry" :text="getContent(post.content)" />
              </div>
            </div>
          </div>
        </div>
        <input ref="copyInput" v-model="copyText" type="text" class="invisible-copy" />
      </div>
    </section>

    <call-to-action />
    <factor-lightbox :visible.sync="lightboxShow" :imgs="post.screenshots" :index="lightboxIndex" />
  </div>
</template>
<script lang="ts">
import { factorLink, factorLightbox } from "@factor/ui"
import { renderMarkdown } from "@factor/api/markdown"
import { setting, stored, emitEvent, toLabel, standardDate } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLink,
    callToAction: () => import("./el/cta.vue"),
    textEntry: () => import("../el/entry.vue"),
    factorLightbox
  },
  data() {
    return {
      getData: "",
      loading: true,
      viewScreenshot: 0,
      headerScreenshots: [],
      headerFormat: "tall",
      copyText: "",
      isCopied: "Click to Copy",
      animationInterval: 5000,
      lightboxIndex: 0,
      lightboxShow: false
    }
  },

  computed: {
    infoItems(this: any) {
      const items: string[] = []

      if (this.post.screenshots && this.post.screenshots.length > 0) {
        items.push("screenshots")
      }
      return [...items, "install", "overview", "meta"]
    },
    post() {
      return stored("post") || {}
    },
    metaItems(this: any) {
      return [
        {
          name: "Latest Version",
          value: this.post.version
        },
        {
          name: "Downloads",
          value: this.post.downloads
        },
        {
          name: "Updated",
          value: standardDate(this.post.updatedAt)
        },
        {
          name: "Created",
          value: standardDate(this.post.createdAt)
        },
        {
          name: "Tags",
          value: this.post.tag ? this.post.tag.join(", ") : ""
        },
        {
          name: "License",
          value: this.post.license
        },
        {
          name: "Author",
          value: this.post.extensionAuthor
        },
        {
          name: "Repository",
          value: this.post.repositoryUrl,
          link: "View"
        }
      ].filter(_ => _.value)
    },

    extensionType(this: any) {
      return this.$route.path.includes("theme") ? "theme" : "plugin"
    },
    packageName(this: any) {
      return decodeURI(this.$route.query.package)
    }
  },

  created() {
    this.headerScreenshots = this.post.screenshots.filter((_: string) =>
      _.includes("tall")
    )

    if (this.headerScreenshots.length == 0) {
      this.headerScreenshots = this.post.screenshots.filter((_: string) =>
        _.includes("wide")
      )
      this.headerFormat = "wide"
    }

    if (this.headerScreenshots.length == 0) {
      this.headerScreenshots = [this.post.icon]
      this.headerFormat = "icon"
    }
  },
  mounted() {
    this.runTimer()
  },
  methods: {
    setting,
    toLabel,
    standardDate,
    runTimer(this: any) {
      if (this.headerScreenshots.length <= 1) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.nextScreenshot(), this.animationInterval)
    },
    scrollTo(sel: string) {
      const element = document.querySelector(sel)

      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    },

    nextScreenshot(this: any) {
      if (this.headerScreenshots.length <= 1) return

      const removed = this.headerScreenshots.splice(0, 1)

      setTimeout(() => {
        this.headerScreenshots = [...this.headerScreenshots, ...removed]
      }, 1000)
      this.runTimer()
    },

    getContent(value: any) {
      return value ? renderMarkdown(value, { variables: true }) : ""
    },
    bgImage(url: string) {
      return { backgroundImage: `url(${url})` }
    },
    screenshotStyle(index: number) {
      const style = {
        transform: `translate(${index * 15}%, ${index}%) scale(${1 - index * 0.1})`,
        zIndex: 50 - index
      }

      return style
    },

    copyPackageName(this: any, text: string): void {
      this.copyText = text

      this.$nextTick(() => {
        this.$refs.copyInput.select()

        document.execCommand("copy")

        this.isCopied = "Copied"
        emitEvent("notify", `Copied "${this.post.packageName}" to clipboard`)

        setTimeout(() => {
          this.isCopied = "Click to Copy"
        }, 3000)
      })
    }
  },
  metaInfo() {
    return {
      title: this.post.title,
      description: this.post.synopsis
    }
  }
})
</script>

<style lang="less">
.extension-single {
  .invisible-copy {
    position: absolute;
    left: -9999px;
  }
  .ext-content-area {
    &.install {
      padding: 2rem;
      z-index: 10;
      position: relative;
    }
    &.readme {
      position: relative;
    }
  }
  .ext-content-pad {
    max-width: 1100px;
    margin: 0 auto;
  }
  .lightshots {
    margin-bottom: 2rem;
  }
  .lightshots-wrap {
    display: flex;

    flex-wrap: wrap;
    .lightshot {
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      border-radius: 8px;
      width: 80px;
      height: 80px;
      margin: 0 0.5rem 0.5rem 0;
      background-size: cover;
      box-shadow: var(--panel-shadow);
    }
  }
  .information {
    padding: 3rem;
    background-image: url("./img/dot.svg");
    .block-grid {
      margin-bottom: 3rem;
      &.last-child {
        margin-bottom: 0;
      }
      display: grid;
      grid-template-columns: 250px 1fr;
      grid-gap: 3rem;
      > .title {
        font-size: 2em;
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: right;
      }
      .info {
        border-radius: 10px;

        min-width: 0;
        &.install,
        &.overview,
        &.meta {
          background: #fff;
          box-shadow: var(--panel-shadow);
          padding: 3rem;
        }
      }
    }
    @media (max-width: 900px) {
      padding: 0.5rem;
      .block-grid {
        grid-template-columns: 1fr;
        grid-gap: 1rem;
        margin-bottom: 1rem;
        > .title {
          text-align: left;
          margin-top: 3rem;
          padding: 0 0.5rem;
        }
        .info {
          padding: 1.5rem;
          &.install,
          &.overview,
          &.meta {
            padding: 1rem;
          }
        }
      }
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 2rem;
      .title {
        font-weight: 700;
      }
      @media (max-width: 600px) {
        grid-template-columns: 1fr 1fr;
      }
    }
    .install-extension {
      text-align: center;

      margin: 0 auto;
      background: #fff;

      border-radius: 10px;

      z-index: 900;
      position: relative;
      padding: 2rem 0 3rem;
      .title-header {
        margin-bottom: 2rem;
        line-height: 1.2;

        .sub-title {
          opacity: 0.5;
          font-size: 1.2em;
          line-height: 1.5;
        }
      }
      .move-to-project {
        .install-code {
          font-size: 1.5em;
          padding: 1rem 2rem;
          letter-spacing: -0.03em;
          border-radius: 10px;
          overflow: hidden;
          max-width: 100%;
          text-overflow: ellipsis;
          font-weight: 700;
          box-shadow: var(--panel-shadow);
          display: inline-block;
          background: var(--color-primary);
          color: #fff;
          position: relative;
          &:hover {
            cursor: pointer;
            opacity: 0.8;
            .copy {
              opacity: 0.5;
            }
          }

          .pkg {
            white-space: nowrap;
          }
          .cmd {
            opacity: 0.4;
            margin-right: 0.5rem;
          }

          @media (max-width: 900px) {
            font-size: 1.2em;
          }
        }

        .copy {
          color: var(--color-text);
          opacity: 0.2;
          font-size: 1rem;
          text-transform: uppercase;
          text-align: center;
          margin-top: 0.5rem;
          width: 100%;
          letter-spacing: 1px;
        }
      }
    }
  }
  .back {
    color: inherit;
    text-transform: uppercase;
    font-weight: 700;
    opacity: 0.2;
    letter-spacing: 1px;
    font-size: 0.9em;
    &:hover {
      opacity: 1;
    }
  }
  .header {
    position: relative;
    overflow: hidden;
    .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      box-shadow: var(--panel-shadow-inset);
      z-index: 100;
      user-select: none;
      pointer-events: none;
    }

    .header-pad {
      display: grid;
      grid-gap: 8rem;
      grid-template-columns: 4fr 4fr;

      padding: 5rem 0 0;

      @media (max-width: 900px) {
        grid-gap: 1rem;
        grid-template-columns: 1fr;
        padding-top: 3rem;
        .content {
          padding: 1rem;
          .text {
            padding: 3rem 0 1rem;
            .description {
              font-size: 1.2em;
            }
            .btn-link + .btn-link {
              margin-top: 1rem;
            }
          }
        }
        .media {
          height: 400px;
          width: 300px;
          justify-self: center;
          .drawer {
            left: 0rem;
            right: 2rem;
            .arrow-wrap {
              display: none;
            }
          }
        }
      }
    }
    .content {
      padding: 4rem 2rem;
      .icon-area {
        margin-bottom: 1rem;
        .extension-icon {
          max-width: 100px;
          border-radius: 10px;
        }
      }

      .title {
        font-size: 3.5em;
        letter-spacing: -0.03em;
        font-weight: 700;
        line-height: 1.1;
        margin-bottom: 1rem;
      }
      .description {
        font-size: 1.4em;
        opacity: 0.6;
      }
      .actions {
        margin-top: 2rem;
        font-size: 1.2em;
        .factor-btn {
          padding: 1rem 2rem;
          margin-right: 1rem;
        }
      }
      .text {
        padding: 5rem 0;
      }
      @media (max-width: 900px) {
        .title {
          font-size: 2em;
        }
      }
    }
    .media {
      position: relative;
      height: 100%;
      display: grid;

      .icon-splash {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-image {
          width: 300px;
          height: 300px;
          border-radius: 1rem;
          box-shadow: var(--panel-shadow);
          background-size: cover;
          background-position: 50%;
          @media (max-width: 700px) {
            width: 200px;
            height: 200px;
          }
        }
      }

      .drawer {
        height: 100%;
        position: relative;
        .arrow-wrap {
          z-index: 100;
          position: absolute;
          bottom: 0;
          text-align: center;
          left: -5rem;
        }
        .arrow {
          font-size: 4em;

          width: 100%;
          text-align: center;
          cursor: pointer;

          transition: opacity 0.2s;
          opacity: 0.1;
          &:hover {
            opacity: 0.3;
          }
        }

        .gallery-enter,
        .gallery-leave-to {
          opacity: 0;
        }

        .screenshot {
          transform-origin: bottom right;
          transition: all 0.5s var(--panel-movement);
          cursor: pointer;
          box-shadow: var(--panel-shadow), 15px 2px 30px rgba(58, 55, 148, 0.15);
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: -30px;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;

          .screenshot-image {
            background-position: 50% 0%;
            background-size: cover;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
