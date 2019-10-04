<template>
  <div class="view-vip-version-2">
    <section class="intro content">
      <div class="header-bg"></div>
      <div class="content-pad wide">
        <div class="header-text">
          <div class="header-tag">
            <div class="header-icon-text">{{ intro.preheading }}</div>
          </div>

          <img class="title" :src="require(`./img/factor-vip-logo.svg`)" alt="Factor VIP" />

          <p class="text">{{ intro.text }}</p>

          <div v-if="intro.bullets" class="bullets">
            <div v-for="(bullet, index) in intro.bullets" :key="index" class="bullet">
              <span class="bullet-icon">
                <factor-icon icon="check" />
              </span>
              <span class="bullet-text">{{ bullet }}</span>
            </div>
          </div>
          <div class="action">
            <factor-link :path="intro.link.path" btn="primary" size="large">
              <span v-formatted-text="intro.link.text" />
            </factor-link>
          </div>
        </div>

        <figure-vip />
      </div>
    </section>

    <div class="benefits content">
      <div class="content-pad wide">
        <div v-for="(benefit, index) in benefits" :key="index" class="benefit">
          <icon-vip v-if="benefit.icon" class="feature-icon" :icon="benefit.icon" />

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

    <div class="process-wrap content">
      <div class="content-pad wide">
        <div class="process-sticky">
          <div class="super">{{ process.preheading }}</div>
          <p class="text">{{ process.text }}</p>
          <ol class="number-list">
            <li
              v-for="(step, index) in process.processList"
              :key="index"
              class="number-item active"
            >
              <factor-link :path="`#` + step.id">{{ step.title }}</factor-link>
            </li>
          </ol>
          <div class="action">
            <factor-link :path="process.link.path" btn="primary">
              <span v-formatted-text="process.link.text" />
            </factor-link>
          </div>
        </div>
        <div class="process-list">
          <div
            v-for="(step, index) in process.processList"
            :id="step.id"
            :key="index"
            :name="step.id"
            class="process"
          >
            <div v-if="step.figure" class="process-figure-container">
              <component :is="step.figure" />
            </div>
            <div class="process-content-container">
              <div class="process-content">
                <div class="title">{{ step.title }}</div>
                <div class="text">{{ step.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="manage content">
      <div class="manage-bg"></div>
      <div class="content-pad wide">
        <div class="manage-figure">
          <figure-manage />
        </div>
        <div class="manage-content">
          <div class="title">{{ manage.title }}</div>
          <div class="text">{{ manage.text }}</div>
          <div v-if="manage.bullets" class="bullets">
            <div v-for="(bullet, index) in manage.bullets" :key="index" class="bullet">
              <span class="bullet-icon">
                <factor-icon icon="check" />
              </span>
              <span class="bullet-text">{{ bullet }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="content-pad wide">
      <el-cta-vip />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "icon-vip": () => import("./icon-vip.vue"),
    "figure-vip": () => import("./figure-vip.vue"),
    "figure-manage": () => import("./figure-manage.vue"),
    "el-cta-vip": () => import("./cta-vip.vue")
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
          text: "Contact Sales &rarr;"
        },
        bullets: [
          "Design",
          "Development",
          "Managed Infrastructure",
          "SEO",
          "Dedicated Developers",
          "Guaranteed Satisfaction",
          "24/7 Support",
          "Phone Support"
        ]
      },
      benefits: [
        {
          icon: "enterprise",
          title: "Enterprise Factor Platform",
          text: `VIP is a fully managed Factor cloud platform for unparalleled scale, security, flexibility, and performance.`
        },
        {
          icon: "implementation",
          title: "Implementation & Support",
          text: `End-to-end guidance and hands-on support, from project consideration through launch and every day thereafter.`
        },
        {
          icon: "solution",
          title: "A Complete Solution",
          text: `Ready models, processes, and plugins to deliver your business goals. Deep, extensible capabilities.`
        }
      ],
      process: {
        preheading: "Why Factor?",
        text:
          "Your app built with a beautiful and professional foundation. Turn ideas into realities and improve your product as it evolves. The process",
        processList: [
          {
            id: "process-sketch",
            figure: () => import("./figure-sketch.vue"),
            title: "Sketch",
            text: `Sketching sets the tone for the rest of the design process. It makes us think and work faster. It’s key in crafting the user experience and communicating it to others.`
          },
          {
            id: "process-wireframe",
            figure: () => import("./figure-wireframe.vue"),
            title: "Wireframe",
            text: `Wireframes set the structure and define the interface items clearly. They make the design process iterative while saving time and effort.`
          },
          {
            id: "process-design",
            figure: () => import("./figure-design.vue"),
            title: "Design",
            text: `Layouts for complex web apps are a lot less daunting when taking a methodical approach like ours.  By using research information and all previous steps these layouts come together like magic.`
          },
          {
            id: "process-develop",
            figure: () => import("./figure-develop.vue"),
            title: "Develop",
            text: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.`
          }
        ],
        link: {
          path: "/contact",
          text: "Contact &rarr;"
        }
      },
      manage: {
        title: "Manage & Maintain",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        bullets: ["Build", "Test", "Deploy", "SEO", "Support", "Updates"]
      }
    }
  },
  routeClass() {
    return "nav-white"
  },
  metaInfo() {
    return {
      title: "Factor VIP - Premium Digital Experiences",
      description: `Web application development services powered by Factor designed to fit your custom workflow.`,
      image: require("../img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
// .content-layout {
//   display: contents;
// }
.view-vip-version-2 {
  --color-bg-splash: #1b223c;
  --color-bg-splash-contrast: #233575;
  --gutter-columns: 4;
  --content-columns: 12;
  --row-height: 64px;
  --content-column-width: minmax(0, calc(1200px / var(--content-columns)));
  --gutter-column-width: var(--content-column-width);
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    width: 100%;
    &.wide {
      max-width: 1200px;
    }
  }

  // Header
  .intro {
    position: relative;
    z-index: 0;
    padding: 9rem 0 15rem;
    color: #fff;
    background: linear-gradient(
      35deg,
      var(--color-bg-splash) 70%,
      var(--color-bg-splash-contrast)
    );

    .header-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      background: url("./img/dot.svg");
      transform: translateY(-4rem);
      perspective: 1000px;

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 150px;
        height: 100%;
        background: linear-gradient(
          90deg,
          var(--color-bg-splash) 0%,
          rgba(27, 34, 60, 0) 100%
        );
      }
    }

    .content-pad {
      z-index: 1;
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 4rem;
    }

    .header-text {
      flex: 1;
      min-width: 520px;
      text-shadow: 0 1px 1px rgba(20, 20, 25, 0.7);

      .header-tag {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 32px;
        opacity: 0.4;

        .icon {
          display: none;
        }

        .header-icon-text {
          font-size: 1.2em;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
      }
      .title {
        font-size: 3em;
        line-height: 1.1;
        margin: 0 0 0.5em;
        letter-spacing: -0.02em;
        font-weight: 600;
      }

      .text {
        font-size: 1.5em;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.6);

        a {
          color: inherit;
        }
      }
      .bullets {
        margin: 2rem 0;
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: 1fr 1fr;

        .bullet {
          font-weight: 600;
          display: flex;

          .bullet-icon {
            background: var(--color-primary);
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            display: inline-block;
            text-align: center;
            margin-right: 0.5rem;
          }

          .bullet-text {
            opacity: 0.7;
          }
        }
      }
    }

    @media (max-width: 900px) {
      padding: 5rem 0 9rem;

      .header-bg {
        width: 100%;
      }

      .content-pad {
        grid-template-columns: 1fr;
      }

      .header-text {
        font-size: 1em;
        min-width: 320px;
        margin: 0 0 40px;

        .header-tag {
          opacity: 0.4;
          .icon {
            display: none;
          }
        }

        .title {
          font-size: 2em;
          .alt {
            color: var(--color-primary);
            display: block;
          }
        }

        .text {
          font-size: 1.2em;
          line-height: 1.5;
          opacity: 0.8;
        }

        .bullets {
          grid-template-columns: 1fr;
        }
      }
    }
  }

  // BENEFITS

  .benefits {
    margin: -7rem 0 0;
    padding: 0 1rem 4rem;
    background: #f6f9fc url("./img/dot.svg");

    .content-pad {
      z-index: 100;
      position: relative;
      border-radius: 7px;
      box-shadow: var(--box-shadow-panel);
      background: #fff;
      padding: 2rem 2.5rem;
      display: grid;
      grid-gap: 0 2em;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(1, 1fr);

      .benefit {
        max-width: 500px;
        font-size: 1.1em;
        .feature-icon svg {
          width: 3rem;
          margin-bottom: 0.75rem;
        }
        .title {
          font-size: 1.1em;
        }
        .text {
          font-weight: 400;
          opacity: 0.7;
          margin: 1rem 0;
        }
      }
    }
    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, auto);
        grid-gap: 2em 0;
        padding: 1rem;
      }
    }
  }

  // PROCESS

  .process-wrap {
    &.content {
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
    }
    .content-pad {
      min-height: 90vh;
      display: grid;
      grid-column-gap: 4rem;
      grid-template-areas: "a" "b";
      grid-template-columns: repeat(2, minmax(100px, 1fr));

      .process-sticky {
        padding: 4rem 0;
        align-self: start;
        // Note: this won't work due to "display: flex;" in .content-layout div. Needs to be "display: contents;" or "display: initial;"
        // position: -webkit-sticky;
        // position: sticky;
        // top: 0;
        .super {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 1.3em;
          color: var(--color-primary);
          margin-bottom: 0.6em;
        }

        .number-list {
          margin: 2rem 0;
          list-style-type: decimal-leading-zero;
          padding-left: 30px;
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: 1fr;
          .number-item {
            &.active {
              color: var(--color-primary);
              font-weight: 600;
            }
            // .bullet-text {
            //   opacity: 0.7;
            // }
          }
        }
      }

      .process-list {
        .process {
          min-height: 90vh;
          background: url("./img/dot-gray.svg");
          position: relative;
          padding: 4rem 0;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 300px;
            background: linear-gradient(0deg, #fff 50%, rgba(255, 255, 255, 0) 100%);
          }
          .process-figure-container {
            position: relative;
            height: 100%;
          }
          .process-content-container {
            position: relative;
            padding: 2rem 0 0;
          }
        }
      }
    }
    .process-content {
      letter-spacing: -0.01em;
    }
    .super {
      text-transform: uppercase;
      font-weight: 600;

      font-size: 1.3em;
      color: var(--color-primary);
      margin-bottom: 0.6em;
    }
    .title {
      font-size: 2em;
      line-height: 1.3;
      margin-bottom: 1.5rem;
    }
    .text {
      font-weight: 400;
      font-size: 1.4em;
      line-height: 1.6;
      margin-bottom: 1rem;
      opacity: 0.8;
    }
    .action {
      margin-top: 2rem;
    }
    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
        .process-figure-container {
          justify-content: center;
        }
        .process-sticky {
          padding: 4rem 0 3rem;
        }
        .process-list .process {
          padding: 2rem 0 3rem;
          .process-content-container {
            padding: 4rem 0 1rem;
            .process-content {
              max-width: 100%;
            }
          }
        }
      }
    }
  }

  // MANAGE
  .manage {
    background: linear-gradient(
      -35deg,
      var(--color-bg-splash) 70%,
      var(--color-bg-splash-contrast)
    );
    position: relative;
    z-index: 0;
    padding: 5rem 0;
    min-height: 90vh;
    color: #fff;
    .content-pad {
      //z-index: 1;
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, minmax(100px, 1fr));
      grid-column-gap: 4rem;
    }
    .manage-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: url("./img/dot.svg");
      perspective: 1000px;
      &:before {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 150px;
        height: 100%;
        background: linear-gradient(
          -90deg,
          var(--color-bg-splash) 0%,
          rgba(27, 34, 60, 0) 100%
        );
      }
    }

    .manage-content {
      position: relative;
      .title {
        font-size: 2em;
        line-height: 1.3;
        margin-bottom: 1.5rem;
      }
      .text {
        font-weight: 400;
        font-size: 1.4em;
        line-height: 1.6;
        margin-bottom: 1rem;
        opacity: 0.8;
      }
      .bullets {
        margin: 2rem 0;
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: 1fr 1fr;
        .bullet {
          font-weight: 600;
          display: flex;
          .bullet-icon {
            background: var(--color-primary);
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            display: inline-block;
            text-align: center;
            margin-right: 0.5rem;
          }
          .bullet-text {
            opacity: 0.7;
          }
        }
      }
    }
    @media (max-width: 900px) {
      .content-pad {
        grid-template-columns: 1fr;
      }
      .manage-content {
        .bullets {
          grid-template-columns: 1fr;
        }
      }
      .manage-bg {
        width: 100%;
      }
    }
  }
}
</style>
