<template>
  <div class="view-terminal">
    <div class="header-wrapper">
      <section id="header" class="header">
        <div class="container-lg">
          <div class="header-layout">
            <div class="header-content">
              <div class="product-title">
                <figure class="product-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                  >
                    <title>48-light-bg</title>
                    <path d="M38,8H10L.19,27a24,24,0,0,0,47.62,0Z" fill="#87bbfd"></path>
                    <path
                      d="M10,24V39.48A3,3,0,0,0,11.29,42a22,22,0,0,0,25.42,0A3,3,0,0,0,38,39.48V24Z"
                      fill="#fff"
                    ></path>
                    <path
                      d="M24,0A24,24,0,0,0,.19,27H47.81A24,24,0,0,0,24,0ZM38,21H10V14a4,4,0,0,1,4-4H34a4,4,0,0,1,4,4Z"
                      fill="#555abf"
                    ></path>
                  </svg>
                </figure>
                <div class="product-title-text">
                  <span class="common-UppercaseTitle">Terminal</span>
                </div>
              </div>

              <h1 class="common-PageTitle">
                Extend Fiction payments to your point of sale
              </h1>
              <p class="common-IntroText">
                Fiction Terminal extends your online presence into the physical world,
                enabling you to build your own in-person checkout. Built with modern
                retailers and platforms in mind, Terminal helps you unify your online and
                offline channels with flexible developer tools, pre-certified card
                readers, and cloud-based hardware management.
              </p>

              <ul class="header-ctas" role="presentation">
                <li>
                  <a
                    href="#"
                    data-analytics-action="start_now"
                    data-analytics-source="header_cta"
                    class="common-Button common-Button--default"
                  >
                    Start now
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    data-analytics-action="contact_sales"
                    data-analytics-source="header_cta"
                    class="common-Button"
                  >
                    Contact sales
                  </a>
                </li>
              </ul>
            </div>
            <el-header-graphic />
          </div>
        </div>

        <div class="common-StripeGrid anchorBottom">
          <!-- Background -->
          <div class="backgroundContainer">
            <div class="grid">
              <div class="background"></div>
            </div>
          </div>
          <!-- Stripes -->
          <div class="stripeContainer">
            <div class="grid">
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
              <div class="stripe"></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section-benefits />

    <section-customers />

    <section-features />

    <section-testimonials />
  </div>
</template>

<script>
export default {
  components: {
    "el-header-graphic": () => import("./el-header-graphic"),
    "section-benefits": () => import("./section-benefits"),
    "section-customers": () => import("./section-customers"),
    "section-features": () => import("./section-features"),
    "section-testimonials": () => import("./section-testimonials")
  },
  data() {
    return {
      loading: true
    }
  },
  metatags() {
    return {
      title: "Copy Terminal",
      description: "Terminal Page Description.",
      image: require("../img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.view-terminal {
  // Common
  .common-UppercaseTitle {
    font-size: 21px;
    line-height: 32px;
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
  .common-IntroText {
    font-size: 24px;
    line-height: 36px;
    font-weight: 300;
    color: #424770;
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
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
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
  .common-BodyTitle {
    font-weight: 500;
    font-size: 19px;
    line-height: 32px;
    color: #32325d;
  }
  .common-BodyText {
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
  .common-Link {
    color: #6772e5;
    font-weight: 500;
    -webkit-transition: color 0.1s ease;
    transition: color 0.1s ease;
    cursor: pointer;
  }
  .common-StripeGrid {
    --stripe-height: 48px;
    --content-columns: 12;
    --gutter-columns: 4;
    @media (min-width: 670px) {
      --stripe-height: 64px;
    }
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: -1;
    pointer-events: none;

    .grid {
      --content-column-width: minmax(0, calc(1040px / var(--content-columns)));
      --gutter-column-width: 1fr;

      position: absolute;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: repeat(auto-fill, var(--stripe-height));
      grid-template-columns:
        [viewport-start] 1fr [left-gutter-start] repeat(
          var(--gutter-columns),
          var(--gutter-column-width)
        )
        [left-gutter-end content-start] repeat(
          var(--content-columns),
          var(--content-column-width)
        )
        [content-end right-gutter-start] repeat(
          var(--gutter-columns),
          var(--gutter-column-width)
        )
        [right-gutter-end] 1fr [viewport-end];

      @media (min-width: 1040px) {
        --gutter-column-width: var(--content-column-width);
        min-width: calc(
          1040px / var(--content-columns) *
            (var(--gutter-columns) * 2 + var(--content-columns))
        );
      }
    }

    .backgroundContainer,
    .stripeContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 100%;
      transform: skewY(-12deg);
    }
    .backgroundContainer {
      .grid {
        grid-template-columns: 1fr;
        min-width: 0;
      }
      .background {
        grid-row: e("1 / -1");
        grid-column: e("1 / -1");
        z-index: -1;
      }
    }
    .stripeContainer {
      overflow: visible;
    }

    &.anchorBottom {
      .backgroundContainer,
      .stripeContainer {
        justify-content: flex-end;
      }
      .grid {
        height: 200%;
        align-content: end;
      }
    }
  }

  .container-lg {
    max-width: 1040px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
  }

  // Header Stripes
  .header {
    .common-StripeGrid {
      .background {
        background-color: #f6f9fc;
        grid-row-end: -4;
      }
      .stripeContainer {
        overflow: visible;
      }
      .stripe {
        &:first-child {
          box-shadow: inset 0 0 0 2px #e6ebf1;
          grid-column: e("16 / 19");
          grid-row: e("19 / 20");
        }
        &:nth-child(2) {
          box-shadow: inset 0 0 0 2px #e6ebf1;
          grid-column: 4 / left-gutter-end;
          grid-row: e("-5 / -6");
          transform: translateY(2px);
        }
        &:nth-child(3) {
          background-color: #32325d;
          grid-column: left-gutter-start / span 4;
          grid-row: e("-4 / -5");
          z-index: 1;
        }
        &:nth-child(4) {
          background-color: #e6ebf1;
          grid-column: content-start / 9;
          grid-row: e("-4 / -5");
        }
        &:nth-child(5) {
          background-color: #32325d;
          grid-column: 14 / right-gutter-end;
          grid-row: e("-4 / -5");
        }
        &:nth-child(6) {
          background-color: #fcd669;
          grid-column: viewport-start / 5;
          grid-row: e("-3 / -4");
        }
        &:nth-child(7) {
          background-color: #87bbfd;
          grid-column: e("15 / 18");
          grid-row: e("-3 / -4");
        }
        &:nth-child(8) {
          background-color: #6772e5;
          grid-column: 18 / viewport-end;
          grid-row: e("-3 / -4");
        }
        &:nth-child(9) {
          background-color: #fcd669;
          grid-column: e("17 / 20");
          grid-row: e("-2 / -3");
          z-index: 1;
        }
        &:nth-child(10) {
          box-shadow: inset 0 0 0 2px #e6ebf1;
          grid-column: e("16 / 19");
          grid-row: e("-1 / -2");
          transform: translateY(-2px);
        }
      }
    }
  }
  // Feature Stripes
  // .features {
  //   position: relative;
  //   z-index: 0;
  //   .common-StripeGrid {
  //     .background {
  //       background-color: #f6f9fc;
  //       grid-row: e("3 / -2");
  //     }

  //     .stripe {
  //       &:first-child {
  //         box-shadow: inset 0 0 0 2px #e6ebf1;
  //         grid-column: e("5 / 8");
  //         grid-row: e("1 / 2");
  //         transform: translateY(2px);
  //       }
  //       &:nth-child(2) {
  //         background-color: #e6ebf1;
  //         grid-column: left-gutter-start / 7;
  //         grid-row: e("2 / 3");
  //       }
  //       &:nth-child(3) {
  //         background-color: #87bbfd;
  //         grid-column: viewport-start / 8;
  //         grid-row: e("3 / 4");
  //       }
  //     }
  //   }
  // }

  // Header
  .header-wrapper {
    max-width: 100vw;
    overflow: visible;

    .header-layout {
      display: flex;
      flex-direction: row;
      @media (max-width: 767px) {
        flex-direction: column;
      }
    }

    .header {
      position: relative;
      z-index: 0;
      padding: 130px 0;

      @media (max-width: 767px) {
        padding: 115px 0 60px;
      }
      @media (min-width: 670px) {
        padding-bottom: 250px;
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

        .product-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 32px;
          color: #6772e5;
          .product-icon {
            margin-left: -20px;
            margin-right: 16px;
            width: 48px;
            height: 48px;
            @media (max-width: 767px) {
              margin-left: 0;
            }
          }
          .product-title-text {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 0;
          }
        }
        .header-ctas {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin: 35px 0 0;
          li {
            margin: 0 16px 16px 0;
            position: relative;
            display: flex;
            flex-direction: column;
          }
        }
      }

      .header-graphic {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        perspective: 1500px;
        transform: none;
        margin-top: 0;

        @media (max-width: 767px) {
          transform: scale(0.7);
        }

        .illustration {
          position: relative;
          margin: 0;
          padding: 0;
          .register {
            border-radius: 8px;
            transform: rotate3d(0.5, -0.866, 0, 15deg);
            box-shadow: 27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
              16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
            transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-delay: 0.3s;
            will-change: transform;

            svg {
              width: 700px;
              vertical-align: top;
              border-radius: 8px;
            }
          }
          .reader {
            position: absolute;
            top: -48px;
            left: 48px;
            perspective: 1500px;
            transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
            &:before {
              content: "";
              position: absolute;
              top: 0;
              bottom: 8px;
              left: 1px;
              right: -2px;
              border-radius: 24px;
              transform: rotate3d(0.4, 1, 0, 24deg);
              box-shadow: 27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
                16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
  }
}
</style>
