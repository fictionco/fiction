<template>
  <div class="view-vip">
    <section class="vip-splash">
      <div class="header-bg" />
      <div class="content-pad vip-splash-inner">
        <div class="content">
          <h3 class="page-sup">{{ intro.preheading }}</h3>

          <!-- <h2 class="page-title">
            Factor
            <span class="alt">VIP</span>
          </h2>-->

          <img
            class="title page-title"
            :src="require(`./img/factor-vip-logo.svg`)"
            alt="Factor VIP"
          />

          <h3 class="page-title-sub text">{{ intro.text }}</h3>

          <ul v-if="intro.bullets" class="list-icons">
            <li v-for="(bullet, index) in intro.bullets" :key="index" class="list-item">
              <span class="icon">
                <factor-icon icon="fas fa-check" />
              </span>
              <span class="content">{{ bullet }}</span>
            </li>
          </ul>
          <div class="action">
            <factor-link :path="intro.link.path" btn="primary" size="large">
              <span v-formatted-text="intro.link.text" />
            </factor-link>
          </div>
        </div>

        <figure-vip />
      </div>
    </section>

    <div class="benefits-wrap content-pad">
      <div class="benefits">
        <div v-for="(benefit, index) in benefits" :key="index" class="benefit">
          <vip-icon v-if="benefit.icon" class="benefit-icon" :icon="benefit.icon" />

          <h3 class="title">{{ benefit.title }}</h3>

          <p class="text">{{ benefit.text }}</p>
          <div v-if="benefit.link" class="action">
            <factor-link :path="benefit.link.path">
              <span v-formatted-text="benefit.link.text" />
            </factor-link>
          </div>
        </div>
      </div>
    </div>

    <div class="content-pad">
      <div class="process-wrap">
        <div class="sticky-container">
          <div class="process-sticky">
            <div class="title">{{ process.preheading }}</div>
            <p class="text">{{ process.text }}</p>

            <ul class="list-numbers">
              <li v-for="(step, index) in process.processList" :key="index" class="list-item">
                <span class="icon">{{ index + 1 }}.</span>
                <factor-link class="content" :path="`#` + step.id">{{ step.title }}</factor-link>
              </li>
            </ul>

            <div class="actions">
              <factor-link :path="process.link.path" btn="primary">
                <span v-formatted-text="process.link.text" />
              </factor-link>
            </div>
          </div>
        </div>
        <div class="process-list">
          <div
            v-for="(step, index) in process.processList"
            :id="step.id"
            :key="index"
            :name="step.id"
            class="process-item"
          >
            <component :is="step.figure" v-if="step.figure" />

            <div class="process-content">
              <div class="title">{{ step.title }}</div>
              <div class="text">{{ step.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="manage-wrap content-pad">
      <div class="manage">
        <div class="manage-figure">
          <figure-manage />
        </div>
        <div class="manage-content">
          <div class="title">{{ manage.title }}</div>
          <div class="text">{{ manage.text }}</div>

          <ul v-if="manage.bullets" class="list-icons">
            <li v-for="(bullet, index) in manage.bullets" :key="index" class="list-item">
              <span class="icon">
                <factor-icon icon="fas fa-check" />
              </span>
              <span class="content">{{ bullet }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="content-pad">
      <el-cta />
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
export default {
  components: {
    factorLink,
    factorIcon,
    vipIcon: () => import("./icon.vue"),
    figureVip: () => import("./figure-vip.vue"),
    figureManage: () => import("./figure-manage.vue"),
    elCta: () => import("./el-cta.vue"),
  },
  data() {
    return {
      loading: true,
      intro: {
        preheading: "Premium Digital Experiences",
        text:
          "Web application development services powered by Factor designed to fit your custom workflow.",
        link: {
          path: "/contact",
          text: "Contact Sales &rarr;",
        },
        bullets: [
          "Design",
          "Development",
          "Managed Infrastructure",
          "SEO",
          "Dedicated Developers",
          "Guaranteed Satisfaction",
          "24/7 Support",
          "Phone Support",
        ],
      },
      benefits: [
        {
          icon: "settings",
          title: "Enterprise Factor Platform",
          text: `VIP is a fully managed Factor cloud platform for unparalleled scale, security, flexibility, and performance.`,
        },
        {
          icon: "support",
          title: "Implementation & Support",
          text: `End-to-end guidance and hands-on support, from project consideration through launch and every day thereafter.`,
        },
        {
          icon: "satisfaction",
          title: "A Complete Solution",
          text: `Ready models, processes, and plugins to deliver your business goals. Deep, extensible capabilities.`,
        },
      ],
      process: {
        preheading: "The design process",
        text:
          "Your app built with a beautiful and professional foundation. Turn ideas into realities and improve your product as it evolves.",
        processList: [
          {
            id: "process-sketch",
            figure: () => import("./figure-sketch.vue"),
            title: "Sketch",
            text: `Sketching sets the tone for the rest of the design process. It makes us think and work faster. It’s key in crafting the user experience and communicating it to others.`,
          },
          {
            id: "process-wireframe",
            figure: () => import("./figure-wireframe.vue"),
            title: "Wireframe",
            text: `Wireframes set the structure and define the interface items clearly. They make the design process iterative while saving time and effort.`,
          },
          {
            id: "process-design",
            figure: () => import("./figure-design.vue"),
            title: "Design",
            text: `Layouts for complex web apps are a lot less daunting when taking a methodical approach like ours.  By using research information and all previous steps these layouts come together like magic.`,
          },
          {
            id: "process-develop",
            figure: () => import("./figure-develop.vue"),
            title: "Develop",
            text: `Everything built with the Factor CMS platform, powered by modern tools like VueJS, MongoDB and TypeScript. Your app will include a dashboard and post management system.`,
          },
        ],
        link: {
          path: "/contact",
          text: "Contact Sales &rarr;",
        },
      },
      manage: {
        title: "Manage & Maintain",
        text:
          "Get chat access to the Factor community, experience immediate content updates when managing your app and the latest updates of the Factor platform.",
        bullets: ["Build", "Test", "Deploy", "SEO", "Support", "Updates"],
      },
    }
  },
  metaInfo() {
    return {
      title: "Factor VIP - Professional App Development Service",
      description: `Web application development services powered by Factor designed to fit your custom workflow.`,
      //image: require("../img/fiction.jpg"),
    }
  },
}
</script>
<style lang="less">
.view-vip {
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    width: 100%;
    align-items: center;
  }

  .list-icons {
    margin: 2rem 0;
    display: grid;
    grid-gap: 1rem 2rem;
    grid-template-columns: 1fr 1fr;
    list-style: none;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .list-item {
      display: grid;
      grid-template-columns: 2rem 1fr;
      .icon {
        color: var(--color-primary);
        opacity: 0.5;
      }
      .content {
        font-weight: 700;
        font-size: 1.1em;
        line-height: 1.5em;
      }
    }
  }

  .list-numbers {
    margin: 2rem 0;
    display: grid;
    grid-gap: 1rem 2rem;
    grid-template-columns: 1fr;

    .list-item {
      display: grid;
      grid-template-columns: 2rem 1fr;
      font-weight: 700;
      font-size: 1.1em;
      line-height: 1.5em;
      .icon {
        color: var(--color-primary);
        opacity: 0.5;
      }
      .content {
        color: var(--color-text);
        &:hover {
          color: var(--color-primary);
        }
      }
    }
  }

  // splash
  .vip-splash {
    position: relative;
    z-index: 0;
    padding: 6rem 0 4rem;

    .vip-splash-inner {
      z-index: 1;
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 4rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .content {
      .page-sup {
        text-transform: uppercase;
        font-weight: 700;
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
      }

      .page-title {
        font-size: 5em;
        letter-spacing: -0.045em;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 1rem;
        .alt {
          color: var(--color-text-secondary);
        }
      }

      .page-title-sub {
        font-weight: 400;
        font-size: 1.4em;
        line-height: 1.6;
        margin-bottom: 1rem;
        color: var(--color-text-secondary);
      }
    }
  }

  // BENEFITS

  .benefits-wrap {
    padding-top: 4rem;
    padding-bottom: 4rem;

    .benefits {
      font-size: 1.1em;
      list-style: none;
      display: grid;
      grid-gap: 2em;
      grid-template-columns: 1fr 1fr 1fr;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }

      .benefit {
        max-width: 500px;

        .benefit-icon {
          width: 48px;
          height: 48px;
          margin: 10px 0 20px;
          border-radius: 0.5rem;
          box-shadow: 0 2px 3px rgba(50, 50, 93, 0.13), 0 2px 5px rgba(50, 50, 93, 0.11),
            0 5px 15px rgba(0, 0, 0, 0.07);
          overflow: hidden;
        }
        .title {
          font-weight: 700;
          font-size: 1.2em;
          line-height: 1.5em;
          margin-bottom: 10px;
        }
        .text {
          font-size: 0.94em;
          line-height: 1.7em;
          opacity: 0.85;
        }
      }
    }
  }

  // PROCESS

  .process-wrap {
    display: grid;
    grid-column-gap: 4rem;
    grid-template-areas: "a" "b";
    grid-template-columns: repeat(2, 1fr);
    padding-top: 6rem;
    padding-bottom: 10rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      padding-bottom: 2rem;
    }

    .title {
      font-weight: 700;
      font-size: 2em;
      line-height: 1.1;
      margin-bottom: 1rem;
    }
    .text {
      font-weight: 400;
      font-size: 1.4em;
      letter-spacing: -0.025em;
      line-height: 1.6;
      margin-bottom: 1rem;
      color: var(--color-text-secondary);
    }
    .actions {
      margin-top: 2rem;
    }

    .sticky-container {
      height: 100%;
    }
    .process-sticky {
      position: sticky;
      top: 1em;
      padding-top: 4rem;

      .title {
        font-size: 3em;
        margin-bottom: 1.5rem;
      }
    }

    .process-item {
      background: radial-gradient(rgba(255, 255, 255, 0), #fff), url("./img/dot-gray.svg");
      padding: 4rem 0;

      .title {
        margin-top: 4rem;
      }
    }
  }

  // MANAGE
  .manage-wrap {
    padding-top: 3rem;
    padding-bottom: 3rem;

    .manage {
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 3rem;
      align-items: center;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 2rem;
      }
    }

    .manage-content {
      position: relative;
      .title {
        font-weight: 700;
        font-size: 3em;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
      }
      .text {
        font-weight: 400;
        font-size: 1.4em;
        line-height: 1.6;
        margin-bottom: 1rem;
        color: var(--color-text-secondary);
      }
    }
  }
}
</style>
