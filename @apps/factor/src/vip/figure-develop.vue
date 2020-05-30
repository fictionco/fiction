<template>
  <figure ref="wrapper" class="factor-figure figure-develop">
    <div class="`stage-wrap`">
      <div class="screenshots">
        <div class="code-container">
          <factor-highlight-code>
            <pre><code class="prism language-vue">{{ code() }}</code></pre>
          </factor-highlight-code>
        </div>
        <div
          v-for="(screenshot, index) in screenshots"
          :key="index"
          class="screenshot"
          :class="screenshot.class"
        >
          <div class="img-wrap">
            <img :src="screenshot.image" :alt="screenshot.alt" />
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
import { factorHighlightCode } from "@factor/plugin-highlight-code"

export default {
  components: { factorHighlightCode },
  data() {
    return {
      screenshots: [
        {
          class: `develop-desktop`,
          image: require("./img/develop-desktop.svg"),
          alt: `Develop - Factor VIP Desktop`,
        },
        {
          class: `develop-mobile`,
          image: require("./img/develop-mobile.svg"),
          alt: `Develop - Factor VIP Mobile`,
        },
      ],
    }
  },
  methods: {
    code() {
      return `export default Factor => {
  return {
    site: {
      logo: () => import("./el/logo"),
      nav: [
        {
          path: "/",
          name: "Factor JS"
        },
        {
          path: "/vip",
          name: "VIP"
        }
      ]
    }
  }
}`
    },
  },
}
</script>

<style lang="less">
figure.figure-develop {
  position: relative;

  .code-container {
    margin: 0 auto;
    background: #fff;
    position: relative;
    font-weight: normal;
    line-height: normal;
    border: 1px solid rgba(80, 102, 119, 0.2);
    border-radius: 6px;
    width: fit-content;
    max-width: 300;

    .code-toolbar {
      padding: 1.2rem;
    }

    pre {
      overflow: hidden;
      position: relative;
      white-space: pre;
      margin: 0;
      max-width: 300px;
      word-wrap: break-word;
      text-overflow: ellipsis;
      code {
        font-family: "Roboto Mono", monospace;
      }
    }
  }

  .screenshots {
    padding: 0 0 10rem;
    .screenshot {
      z-index: 10;
      background: #fff;
      box-shadow: 0px 5px 15px rgba(27, 34, 60, 0.1), 0px 15px 35px rgba(27, 34, 60, 0.1),
        0px 50px 100px rgba(27, 34, 60, 0.1);
      overflow: hidden;
      img {
        width: 100%;
      }
      &.develop-desktop {
        position: absolute;
        top: 11.5rem;
        left: -2rem;
        border-radius: 6px;
        width: 400px;
      }
      &.develop-mobile {
        position: absolute;
        top: 9rem;
        right: -2rem;
        border-radius: 15px;
        width: 200px;
        .img-wrap {
          margin: 6px;
          border-radius: 10px;
          background: linear-gradient(35deg, #1b223c 70%, #233575);
        }
      }
    }
  }

  @media (max-width: 900px) {
    .code-container {
      transform: scale(0.8);
    }
    .screenshots {
      padding: 0 0 2rem;
      .screenshot {
        &.develop-desktop {
          width: 100%;
          max-width: 400px;
          left: 0;
          top: 6rem;
        }
        &.develop-mobile {
          width: 110px;
          right: 1rem;
          top: 14rem;
          border-radius: 6px;
          .img-wrap {
            border-radius: 4px;
            margin: 3px;
          }
        }
      }
    }
  }
}
</style>
