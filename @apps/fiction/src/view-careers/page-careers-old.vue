<template>
  <div class="view-about">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="label label-pink">Careers</div>
        <h1 class="title">Let's Create Something Beautiful Together</h1>
        <p
          class="subtitle"
        >Fiction is on a mission to help frontend developers create better Javascript apps.</p>
        <app-link btn="quaternary" size="large" path="#">
          Check Our Current Openings
          <factor-icon icon="arrow-down" />
        </app-link>
      </div>
    </section>

    <section class="boxes-wrap">
      <div class="mast">
        <div class="boxes-inner">
          <h2 class="title">Values</h2>
          <div class="boxes">
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">Enterprise Factor Platform</h3>
                <p
                  class="box-description"
                >VIP is a fully managed Factor cloud platform for unparalleled scale, security, flexibility, and performance.</p>
              </div>
            </div>
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">Implementation &amp; Support</h3>
                <p
                  class="box-description"
                >End-to-end guidance and hands-on support, from project consideration through launch and every day thereafter.</p>
              </div>
            </div>
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">Build Your Digital Experiences</h3>
                <p
                  class="box-description"
                >Solutions at the ready. Factor powers mission critical enterprise media and marketing systems.</p>
              </div>
            </div>
            <div class="box">
              <factor-icon icon="arrow-circle-right" />
              <div>
                <h3 class="box-title">A Complete Solution</h3>
                <p
                  class="box-description"
                >Ready models, processes, and plugins to deliver your business goals. Deep, extensible capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <section class="clients">
      <div class="title">Trusted by:</div>
      <div class="mast clients-inner">
        <div class="client">
          <div class="client-image">
            <img :src="require(`./elasticbyte.svg`)" alt="Elastic Byte" >
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./carbontechpro.svg`)" alt="Carbon Tech Pro" >
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./pagelines.svg`)" alt="PageLines" >
          </div>
        </div>
        <div class="client">
          <div class="client-image">
            <img :src="require(`./aqualuna.svg`)" alt="AquaLuna" >
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>-->

    <section class="careers">
      <div class="mast careers-inner">
        <h1 class="title">Current Job Openings</h1>

        <ul class="careers-list">
          <li>
            <div>
              <img :src="require(`./icon-developer.svg`)" alt="Factor Developer" >
            </div>
            <div>
              <h3>
                Full-Stack Developer
                <span>Salt Lake City</span>
              </h3>
              <p>We’re looking for a full-stack developer to join our talented engineering team. You will work with us on our internal application platform. The responsibilities of this job include designing extensions, components, and...</p>
              <app-link path="/careers/full-stack-developer">
                Learn More
                <factor-icon icon="arrow-right" />
              </app-link>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- <section class="member-wrap">
      <div class="mast">
        <h1 class="title">Leadership at Fiction</h1>
        <div class="member">
          <figure>
            <img :src="require(`./andrew.jpg`)" alt="Andrew Powers" >
    </figure>
    <div class="content">
      <h3 class="title">Andrew Powers</h3>
      <h4 class="sub-title">Founder &amp; CEO</h4>
      <p class="desc">
        Andrew is a serial entrepreneur who has founded several successful companies in different industries. Prior to founding Fiction, Andrew bootstrapped
        <a
          href="https://www.pagelines.com"
        >PageLines.com</a> to over 30k paying customers.
      </p>
    </div>
  </div>
  <div class="member">
    <figure>
      <img :src="require(`./raymond.jpg`)" alt="Raymond Aleman">
    </figure>
    <div class="content">
      <h3 class="title">Raymond Aleman</h3>
      <h4 class="sub-title">Founder / VP Design</h4>
      <p
        class="desc"
      >Ray is a designer and UX specialist and has previously led design at several successful startups throughout the United States, including Omni Studio, Wearable World and PageLines.</p>
    </div>
  </div>
  </div>
    </section>-->

    <!-- <section class="cta">
      <div class="mast">
        <div class="cta-inner">
          <h1 class="title">Have a project to discuss?</h1>
          <app-link btn="primary" size="large" path="/contact">
            Let's Talk
            <factor-icon icon="arrow-right" />
          </app-link>
        </div>
      </div>
    </section>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.$user.init(() => {
      this.loading = false
    })
  },
  metatags() {
    return {
      title: "About Fiction",
      description:
        "Fiction was created to help you live a better life by seeing more of it. We’re focused on making software and services that solve the unique problems of long-term travelers."
    }
  }
}
</script>
<style lang="less">
.view-about {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    &.label-blue {
      color: var(--color-primary);
    }
    &.label-pink {
      color: var(--color-secondary);
    }
  }

  .splash-wrap {
    background-image: url(./world-left.svg), url(./world-right.svg);
    background-color: #1b223c;
    background-position: left -100px center, right -500px center;
    background-repeat: no-repeat;
    background-size: contain;
    @media (max-width: 767px) {
      background-position: left -240px center, right -440px center;
      button.app-btn.large {
        font-size: 1em;
      }
    }
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: center;
      max-width: 550px;
      padding: 6em 0 12em;
      @media (max-width: 767px) {
        padding: 6em 2em 8em;
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 1;
        margin: 0.3em 0;
        color: #f9f9f9;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        font-weight: 400;
        margin-bottom: 1.5em;
        color: #fff;

        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
    }
  }

  // Values
  .boxes-wrap {
    background-color: #f5f8fc;
    .boxes-inner {
      box-shadow: var(--panel-shadow);
      background: var(--color-light);
      border-radius: 0.5em;
      padding: 3em;
      position: relative;
      transform: translateY(-80px);

      @media (max-width: 767px) {
        padding: 1em;
      }

      .title {
        font-size: 2.5em;
        font-weight: var(--font-weight-bold);
        padding-bottom: 1em;
      }

      .boxes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 60px 30px;

        .box {
          display: grid;
          grid-template-columns: 40px 1fr;
          .fa {
            font-size: 22px;
            opacity: 0.5;
          }
          .box-title {
            font-size: 1.4em;
            font-weight: var(--font-weight-bold);
            letter-spacing: -0.03em;
            margin-bottom: 0.5em;
          }
          .box-description,
          a {
            font-size: 1.2em;
            line-height: 1.6em;
          }
          .box-description {
            font-weight: var(--font-weight-normal);
            opacity: 0.7;
          }
        }
        @media (max-width: 767px) {
          grid-template-columns: 1fr;
          transform: translateY(0);
          .box {
            padding: 0;
          }
        }
      }
    }
  }

  // Clients
  // .clients {
  //   position: relative;
  //   background-color: #f5f8fc;
  //   padding: 3em 0;
  //   .title {
  //     text-align: center;
  //     font-size: 1.2em;
  //     line-height: 1.6em;
  //   }
  //   .clients-inner {
  //     position: relative;
  //     z-index: 2;
  //     display: grid;
  //     grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  //     grid-gap: 2em;
  //     align-items: center;
  //     margin: 3em auto;
  //     .client-image {
  //       max-width: 100%;
  //       img {
  //         max-width: 100%;
  //         display: block;
  //         margin: 0 auto;
  //       }
  //     }
  //     @media (max-width: 767px) {
  //       grid-template-columns: 1fr 1fr;
  //       grid-gap: 2em;
  //     }
  //   }
  //   .hhh {
  //     pointer-events: none;
  //     position: absolute;
  //     z-index: 1;
  //     left: 0;
  //     right: 0;
  //     bottom: -40%;
  //     top: 50%;
  //     transform: skewY(-4deg);
  //     background: #f5f8fc;
  //     transition: opacity 0.2s ease-out;
  //     will-change: transform;
  //     @media (max-width: 767px) {
  //       bottom: -20%;
  //     }
  //   }
  // }

  // Careers
  .careers {
    position: relative;
    background-color: #fff;
    padding: 3em 0;
    .careers-inner {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: left;
      max-width: 650px;

      ul.careers-list {
        list-style: none;
        margin-top: 3em;

        li {
          display: grid;
          grid-template-columns: 80px 1fr;
          border-bottom: 1px solid rgba(80, 102, 119, 0.1);
          padding-bottom: 2em;
          margin-bottom: 2em;
          @media (max-width: 767px) {
            grid-template-columns: 1fr;
          }
          &:last-child {
            margin-bottom: 0;
          }
          h3 {
            font-weight: var(--font-weight-bold);
            font-size: 1.2em;
            letter-spacing: -0.03em;
            margin-bottom: 1em;
            span {
              float: right;
              font-size: 0.9em;
              font-weight: 300;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              text-align: right;

              @media (max-width: 767px) {
                display: block;
                clear: both;
                float: initial;
                text-align: left;
                margin: 0.5em 0;
              }
            }
          }
          p {
            font-size: 1.2em;
            font-weight: var(--font-weight-normal);
            line-height: 1.6em;
            margin-bottom: 1em;
            opacity: 0.7;
            @media (max-width: 767px) {
              clear: both;
            }
          }
        }
      }
    }
    .title {
      font-size: 2.5em;
      font-weight: var(--font-weight-bold);
    }
  }

  // Member
  // .member-wrap {
  //   padding: 0 2px;
  //   line-height: 1.2;
  //   max-width: 1000px;
  //   margin: 2em auto;
  //   padding-top: 3em;
  //   h1.title {
  //     font-size: 2.5em;
  //     text-align: center;
  //     font-weight: var(--font-weight-bold);
  //   }
  //   .member {
  //     display: grid;
  //     grid-template-columns: 3fr 4fr;
  //     grid-gap: 40px;
  //     position: relative;
  //     overflow: visible;
  //     margin: 4em 0 7em;
  //     box-shadow: var(--panel-shadow);
  //     background: var(--color-light);
  //     border-radius: 0.5em;

  //     figure {
  //       position: relative;
  //       overflow: hidden;
  //       transform: skewX(-8deg);
  //       margin-top: -30px;
  //       margin-left: 30px;
  //       margin-bottom: -30px;
  //       border-radius: 0.5em;
  //       box-shadow: var(--panel-shadow);

  //       img {
  //         height: 120%;
  //         width: auto;
  //         position: absolute;
  //         top: -40px;
  //         bottom: 0;
  //         left: -40px;
  //         transform: skewX(8deg);
  //       }
  //     }
  //     .content {
  //       grid-column: 2;
  //       padding: 3em;
  //       line-height: 1.4;
  //       font-size: 1.2em;
  //       .title {
  //         font-weight: var(--font-weight-bold);
  //         font-size: 1.5em;
  //       }
  //       .sub-title {
  //         font-weight: normal;
  //       }
  //       p {
  //         margin-top: 1em;
  //         opacity: 0.7;
  //         font-weight: 500;
  //       }
  //       cite {
  //         display: block;
  //         margin-top: 1em;
  //       }
  //     }
  //   }
  //   @media (max-width: 767px) {
  //     .title {
  //       font-size: 2em;
  //     }
  //     .member {
  //       grid-template-columns: 1fr;
  //       grid-gap: 0;
  //       figure {
  //         transform: skewX(0);
  //         margin: 0;
  //         border-radius: 0.5em 0.5em 0 0;
  //         img {
  //           width: 100%;
  //           height: auto;
  //           position: relative;
  //           top: 0;
  //           bottom: 0;
  //           left: 0;
  //           transform: skewX(0);
  //         }
  //       }
  //       .content {
  //         grid-column: auto;
  //         width: 100%;
  //         padding: 1em;
  //       }
  //     }
  //   }
  // }

  // .cta {
  //   .cta-inner {
  //     text-align: center;
  //     margin-bottom: 4em;
  //     .title {
  //       font-size: 2.5em;
  //       font-weight: var(--font-weight-bold);
  //       margin-bottom: 0.5em;
  //     }
  //   }
  // }
}
</style>