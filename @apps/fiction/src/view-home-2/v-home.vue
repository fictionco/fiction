<template>
  <div class="view-home-version-2">
    <div class="header-wrapper">
      <section class="header content">
        <div class="content-pad">
          <div class="header-layout">
            <div class="header-content">
              <div class="header-tag">
                <div class="header-icon-text">For Front-End Professionals</div>
              </div>

              <h1 class="header-title">Ship the world's next great web and eCommerce apps</h1>
              <p class="header-text">
                Fiction helps professional front-end developers build Javascript apps that take things to the next level.
                Need to build scaleable, enterprise-grade applications? Get in touch for a free consultation.
              </p>

              <div class="header-actions">
                <app-btn btn="primary">Start Your App &rarr;</app-btn>
                <app-btn btn="default">Free VIP Consultation &rarr;</app-btn>
              </div>
            </div>
            <div class="header-figure">
              <figure>tbd</figure>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="benefits content">
      <div class="content-pad">
        <div v-for="(benefit, index) in benefits" :key="index" class="benefit">
          <figure class="benefit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 48">
              <g fill="none" fill-rule="evenodd">
                <path
                  fill="#ff0076"
                  fill-rule="nonzero"
                  d="M46 33.44v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98zm0-10v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98zm0-10v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98z"
                />
                <path
                  fill="#ff0076"
                  fill-rule="nonzero"
                  d="M46 3.44v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98z"
                />
              </g>
            </svg>
          </figure>

          <h3 class="title">{{ benefit.title }}</h3>

          <p class="text">{{ benefit.text }}</p>
          <div class="action">
            <a href="#">Go &rarr;</a>
          </div>
        </div>
      </div>
    </div>

    <!-- <section-customers /> -->

    <section-features />

    <section-testimonials />

    <section-integrate />

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-stripes": () => import("./el-stripes"),
    "el-header-graphic": () => import("./el-header-graphic"),
    "section-benefits": () => import("./section-benefits"),
    "section-customers": () => import("./section-customers"),
    "section-features": () => import("./section-features"),
    "section-testimonials": () => import("./section-testimonials"),
    "section-integrate": () => import("./section-integrate"),
    "el-cta": () => import("../el/cta")
  },
  data() {
    return {
      loading: true,
      benefits: [
        {
          title: "Front-End Focused",
          text: `Fiction focuses solely on the needs of front-end professionals. 
            We don't bloat your apps with unecessary features, and we help you build apps the way you actually want to.`
        },
        {
          title: "Coding, Just the Fun Parts",
          text: `The best apps are handcrafted with custom CSS and components. 
              Fiction helps you code where its fun and creative; but takes away the pitfalls, bugs and quirks common in JS apps.`
        },
        {
          title: "Professional Support",
          text:
            "Build your app along with with people that know design and can answer advanced coding questions. Fiction provides only top-tier support run by expert designers and application devs. "
        }
      ]
    }
  },
  metatags() {
    return {
      title: "Build the World's next great app.",
      description: "Terminal Page Description.",
      image: require("../img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.view-home-version-2 {
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2em;
    width: 100%;
  }

  // Header
  .header-wrapper {
    max-width: 100vw;
    overflow: visible;
    .header {
      position: relative;
      z-index: 0;
      padding: 70px 0 6rem;

      @media (max-width: 767px) {
        padding: 115px 0 60px;
      }
      @media (min-width: 670px) {
        padding-bottom: 10rem;
        margin-bottom: 6vw;
      }
      .header-content {
        flex: 1;
        min-width: 520px;
        margin: 0 60px 0 0;

        @media (max-width: 767px) {
          min-width: 320px;
          margin: 0 0 40px;
        }
      }
      .header-layout {
        display: flex;
        flex-direction: row;
        @media (max-width: 767px) {
          flex-direction: column;
        }
      }
    }
  }
  .header-title {
    font-size: 3.5em;
    line-height: 1.2;
    font-weight: 400;
    margin: 0 0 0.5em;
    letter-spacing: -0.01em;
  }

  .header-text {
    font-size: 24px;
    line-height: 36px;
    font-weight: 300;
    opacity: 0.8;
  }

  .header-actions {
    margin-top: 2em;
  }

  .header-tag {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 32px;

    .header-icon {
      margin-left: -20px;
      margin-right: 16px;
      width: 48px;
      height: 48px;
      @media (max-width: 767px) {
        margin-left: 0;
      }
    }
    .header-icon-text {
      opacity: 0.4;
      font-size: 1.3em;

      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
  }

  .header-figure {
    position: relative;
    perspective: 1500px;
    padding-top: 2em;
    figure {
      width: 800px;
      height: 500px;
      background: #fff;
      box-shadow: var(--box-shadow-panel);
    }
  }

  // BENEFITS

  .benefits {
    .content-pad {
      display: grid;
      grid-template-rows: repeat(3, auto);
      grid-gap: 2em 0;
      @media (min-width: 670px) {
        grid-gap: 0 2em;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(1, 1fr);
      }

      .benefit {
        .title {
          font-size: 1.3em;
        }
        .text {
          opacity: 0.7;
          margin: 1rem 0;
        }
      }
    }
  }

  .common-uppercase-text {
    font-size: 17px;
    line-height: 28px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  .common-PageTitle {
    font-size: 53px;
    line-height: 68px;
    font-weight: 400;
    margin: 0 0 20px;
    color: #32325d;
    letter-spacing: -0.01em;
  }
  .common-SectionTitle {
    font-weight: 400;
    font-size: 34px;
    line-height: 44px;
    color: #32325d;
    @media (min-width: 670px) {
      font-size: 42px;
      line-height: 52px;
    }
  }

  .common-Button {
    white-space: nowrap;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    background: #fff;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    color: #6772e5;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      color: #7795f8;
      transform: translateY(-1px);
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
        0 3px 6px rgba(0, 0, 0, 0.08);
    }

    &.common-Button--default {
      color: #fff;
      background: #6772e5;
      &:hover {
        color: #fff;
        background-color: #7795f8;
      }
    }
  }
  .common-body-title {
    font-weight: 500;
    font-size: 19px;
    line-height: 32px;
    color: #32325d;
  }
  .common-bodytext {
    font-weight: 400;
    font-size: 17px;
    line-height: 28px;
    color: #525f7f;
  }
  .common-MediumBodyText {
    font-weight: 400;
    font-size: 19px;
    line-height: 32px;
    color: #525f7f;
  }
  .common-link {
    color: #6772e5;
    font-weight: 500;
    transition: color 0.1s ease;
    cursor: pointer;
  }

  // Header
  .header-wrapper {
    // .header-layout {
    //   display: flex;
    //   flex-direction: row;
    //   @media (max-width: 767px) {
    //     flex-direction: column;
    //   }
    // }

    // .header {
    //   position: relative;
    //   z-index: 0;
    //   padding: 70px 0 130px;

    //   @media (max-width: 767px) {
    //     padding: 115px 0 60px;
    //   }
    //   @media (min-width: 670px) {
    //     padding-bottom: 250px;
    //     margin-bottom: 6vw;
    //   }

    //   .header-content {
    //     flex: 1;
    //     min-width: 520px;
    //     margin: 0 60px 0 0;

    //     @media (max-width: 767px) {
    //       min-width: 320px;
    //       margin: 0 0 40px;
    //     }

    //     .header-ctas {
    //       display: flex;
    //       flex-wrap: wrap;
    //       justify-content: flex-start;
    //       margin: 35px 0 0;
    //       li {
    //         margin: 0 16px 16px 0;
    //         position: relative;
    //         display: flex;
    //         flex-direction: column;
    //       }
    //     }
    //   }

    // .header-graphic {
    //   flex: 1;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   perspective: 1500px;
    //   transform: none;
    //   margin-top: 0;

    //   @media (max-width: 767px) {
    //     transform: scale(0.7);
    //   }

    //   .illustration {
    //     position: relative;
    //     margin: 0;
    //     padding: 0;
    //     .register {
    //       border-radius: 8px;
    //       transform: rotate3d(0.5, -0.866, 0, 15deg);
    //       box-shadow: 27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
    //         16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
    //       transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    //       transition-delay: 0.3s;
    //       will-change: transform;

    //       svg {
    //         width: 700px;
    //         vertical-align: top;
    //         border-radius: 8px;
    //       }
    //     }
    //     .reader {
    //       position: absolute;
    //       top: -48px;
    //       left: 48px;
    //       perspective: 1500px;
    //       transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    //       will-change: transform;
    //       &:before {
    //         content: "";
    //         position: absolute;
    //         top: 0;
    //         bottom: 8px;
    //         left: 1px;
    //         right: -2px;
    //         border-radius: 24px;
    //         transform: rotate3d(0.4, 1, 0, 24deg);
    //         box-shadow: 27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
    //           16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
    //       }
    //     }
    //   }
    // }
    // }
  }
}
</style>
