<template>
  <div class="extension-single">
    <section class="splash">
      <div class="content-area header">
        <div class="overlay" />
        <div class="content-pad header-pad">
          <div class="content">
            <factor-link class="back" :path="`/themes`">
              <span>&larr; Back to {{ extensionType == 'theme' ? "Themes" : "Plugins" }}</span>
            </factor-link>
            <div class="text">
              <div class="title-wrap">
                <div class="icon-area">
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
            <div class="drawer">
              <transition-group tag="div" name="gallery">
                <div
                  v-for="(img, i) in screenshots"
                  :key="img"
                  class="screenshot"
                  :class="`sc-${i + 1}`"
                  :style="screenshotStyle(i)"
                  @click="nextScreenshot()"
                >
                  <div class="screenshot-image" :style="{ backgroundImage: `url('${img}')` }" />
                </div>
              </transition-group>
              <div class="arrow-wrap">
                <div class="arrow" @click="nextScreenshot()">&rarr;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="information">
      <div class="content-area blocks">
        <div class="content-pad">
          <div
            v-for="(block, i) in ['install', 'overview', 'meta']"
            :id="block"
            :key="i"
            class="block-grid"
          >
            <div class="title">{{ toLabel(block) }}</div>
            <div class="info">
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
                  <input ref="copyInput" v-model="copyText" type="text" class="invisible-copy" />
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
              <div v-else class="entry-wrap">
                <text-entry class="entry" :text="getContent(post.content)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <call-to-action />
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { renderMarkdown } from "@factor/api/markdown"
import { setting, stored, emitEvent, toLabel, standardDate } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLink,
    callToAction: () => import("./el/cta.vue"),
    textEntry: () => import("../el/entry.vue")
  },
  data() {
    return {
      getData: "",
      loading: true,
      viewScreenshot: 0,
      screenshots: [],
      copyText: "",
      isCopied: "Click to Copy",
      animationInterval: 5000
    }
  },

  computed: {
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
    // screenshots(this: any): string[] {
    //   const sc = this.post.screenshots.filter((_: string): boolean => _.includes("tall"))

    //   const p1 = sc.slice(0, this.viewScreenshot)
    //   const p2 = sc.slice(this.viewScreenshot)

    //   return [...p2, ...p1]
    // },

    extensionType(this: any) {
      return this.$route.path.includes("theme") ? "theme" : "plugin"
    },
    packageName(this: any) {
      return decodeURI(this.$route.query.package)
    }
  },

  created() {
    this.screenshots = this.post.screenshots.filter((_: string) => _.includes("tall"))
  },
  mounted() {
    this.runTimer()
  },
  methods: {
    setting,
    toLabel,
    standardDate,
    runTimer(this: any) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.nextScreenshot(), this.animationInterval)
    },
    scrollTo(sel: string) {
      const element = document.querySelector(sel)

      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    },

    beforeEnter: function(el: HTMLElement) {
      el.style.opacity = "0"
      el.style.height = "0"
    },
    nextScreenshot(this: any) {
      const removed = this.screenshots.splice(0, 1)

      setTimeout(() => {
        this.screenshots = [...this.screenshots, ...removed]
      }, 1000)
      this.runTimer()
    },

    getContent(value: any) {
      return value ? renderMarkdown(value, { variables: true }) : ""
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
  // .information {
  //
  // }
  .content-area {
    &.install {
      padding: 2rem;
      z-index: 10;
      position: relative;
    }
    &.readme {
      position: relative;
    }
  }
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
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
        font-size: 2.5em;
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: right;
      }
      .info {
        background: #fff;
        box-shadow: var(--panel-shadow);
        border-radius: 10px;
        padding: 3rem;
        min-width: 0;
      }
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 2rem;
      .title {
        font-weight: 700;
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
        .title {
          font-size: 2em;
          font-weight: 700;
        }
        .sub-title {
          opacity: 0.5;
          font-size: 1.2em;
        }
      }
      .move-to-project {
        .install-code,
        .project,
        .arrow {
          font-size: 1.5em;
          padding: 1rem 2rem;
        }
        .install-code,
        .project {
          letter-spacing: -0.03em;
          border-radius: 10px;

          font-weight: 700;
          box-shadow: var(--panel-shadow);
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
        .invisible-copy {
          position: absolute;
          left: -9999px;
        }
        .install-code {
          display: inline-block;
          &:hover {
            cursor: pointer;
            opacity: 0.8;
            .copy {
              opacity: 0.5;
            }
          }
          background: var(--color-primary);
          color: #fff;
          position: relative;

          .cmd {
            opacity: 0.4;
            margin-right: 0.5rem;
          }
        }
      }
    }

    .info-block {
      font-size: 1.2em;
      display: grid;
      grid-template-columns: 1fr 200px;
      grid-gap: 4rem;
      background: var(--color-bg-constrast);
      border-bottom: 1px solid var(--color-border);
      padding: 4rem 0;
      position: relative;
      // .block-title {
      //   .nav {
      //     display: inline-block;
      //     max-width: 150px;
      //   }
      //   text-align: right;
      //   .title {
      //     font-size: 1.5em;
      //     line-height: 1;
      //     font-weight: 700;
      //     letter-spacing: -0.03em;
      //   }
      //   .description {
      //     margin-top: 1rem;
      //     font-size: 0.9em;
      //     line-height: 1.5;
      //     opacity: 0.3;
      //   }
      // }

      .block-readme {
        min-width: 0;
        border-radius: 10px;
        background: #fff;
        box-shadow: var(--panel-shadow);
        padding: 3rem;
        .entry-wrap {
          border-radius: 10px;
          .entry {
            min-width: 400px;
          }
        }
      }
      .sidebar {
        position: sticky;
        top: 100px;
      }
      .box {
        .box-title {
          font-weight: 700;
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
    }
    .content {
      padding: 4rem 0;
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
      }
      .description {
        font-size: 1.6em;
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
    }
    .media {
      position: relative;
      height: 100%;
      display: grid;

      .thumbs {
        width: 100%;

        padding: 1rem;
        z-index: 1000;
        justify-content: center;
        flex-direction: column;
        display: flex;
        .thumb {
          box-shadow: var(--panel-shadow);
          width: 75px;
          height: 50px;
          border-radius: 10px;
          background-size: cover;
          margin: 0.5rem;

          &.selected {
            box-shadow: 0 0 0 4px var(--color-primary);
          }
          &:hover {
            box-shadow: 0 0 0 4px var(--color-text);
          }
        }
      }
      .drawer {
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

        position: relative;

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
