<template>
  <div class="view-about">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="label label-pink">Careers</div>
        <h1 class="title">Let's Create Something Beautiful Together</h1>
        <p
          class="subtitle"
        >Fiction is on a mission to help frontend developers create better Javascript apps.</p>
        <a href="#current-openings">
          <app-btn path="#current-openings" btn="quaternary" size="large">
            Check Our Current Openings
            <factor-icon icon="arrow-down" />
          </app-btn>
        </a>
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

    <section id="current-openings" class="careers">
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
          <!-- <li>
            <div>
              <img :src="require(`./icon-designer.svg`)" alt="Factor Designer" >
            </div>
            <div>
              <h3>
                Product Designer
                <span>Salt Lake City</span>
              </h3>
              <p>Looking for a new home? Our design team is growing. To thrive in this role, you’ll have 2+ years of design experience under your belt, as well as a demonstrated understanding of the pace and variety of agency work...</p>
              <app-link path="/#">
                Learn More
                <factor-icon icon="arrow-right" />
              </app-link>
            </div>
          </li>-->
        </ul>
      </div>
    </section>
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
      title: "Fiction Careers - Work on the Future of the Web",
      description:
        "Apply for a job with Fiction.com to help build the future of web business and remote work."
    }
  },
  methods: {
    hash(name) {
      this.$router.replace({ hash: name })
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
      //grid-column-gap: 60px;
      align-items: center;
      text-align: center;
      max-width: 670px;
      padding: 6em 0 12em;
      @media (max-width: 767px) {
        padding: 6em 2em 8em;
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 4em;
        letter-spacing: -0.03em;
        line-height: 1;
        margin: 0.3em 0;
        color: #f9f9f9;
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
            color: var(--color-secondary);
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

  // Careers
  .careers {
    position: relative;
    //background-color: #fff;
    padding: 3em 0;
    .title {
      font-size: 2.5em;
      font-weight: var(--font-weight-bold);
    }
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
            border-bottom: none;
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
  }
}
</style>