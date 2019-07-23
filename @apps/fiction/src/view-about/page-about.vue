<template>
  <div class="view-about">
    <div class="mission-wrap">
      <h1 class="title">Let's Create Something Beautiful Together</h1>
      <div
        class="sub-title"
      >Fiction was created to help you live a better life by seeing more of it. We’re focused on making software and services that solve the unique problems of long-term travelers.</div>
    </div>
    <div class="values-wrap">
      <div class="values">
        <div class="values-content">
          <h2 class="title">Values</h2>
          <div class="value-item">
            <div class="name">Less is More</div>
            <div
              class="description"
            >Do more with less. Given the choice, choose minimalization over maximization.</div>
          </div>

          <div class="value-item">
            <div class="name">Karma First</div>
            <div
              class="description"
            >Be as altruistic as possible. History has proven that karma works in mysterious ways.</div>
          </div>

          <div class="value-item">
            <div class="name">Feedback Driven</div>
            <div
              class="description"
            >Continually assess and reassess the things you believe and actions you're taking. Never assume.</div>
          </div>
        </div>
        <div class="values-image">
          <img :src="require(`./about.jpg`)" alt="Values" >
        </div>
      </div>
    </div>
    <div id="careers" class="careers-wrap">
      <div class="heading">
        <h1 class="title">Do Amazing Work</h1>
        <div
          class="sub-title"
        >Fiction works with top talent in all kinds of areas. If you have drive, love travel, and want to do great work, get in touch.</div>
      </div>
      <div class="apply-wrap">
        <div class="pad">
          <div class="apply">
            <div class="apply-content">
              <h2 class="title">Let's Talk</h2>
              <p>A company's secret sauce is its people. If you're passionate about great work let's chat.</p>
              <h3 class="sub-title">Current Job Postings</h3>
              <ul class="apply-list">
                <li>
                  <app-link
                    path="https://angel.co/fictiondotcom/jobs/454044-frontend-javascript-engineer-vue-node"
                    btn="default"
                    size="medium"
                    target="_blank"
                  >
                    Full-Stack Developer
                    <factor-icon icon="arrow-right" />
                  </app-link>
                </li>
                <!-- <li>
                <app-btn path="/" btn="default">
                  Product Designer
                  <factor-icon icon="arrow-right" />
                </app-btn>
              </li>
              <li>
                <app-btn path="/" btn="default">
                  Photographer - Miami, FL
                  <factor-icon icon="arrow-right" />
                </app-btn>
              </li>
              <li>
                <app-btn path="/" btn="default">
                  Photographer - NYC
                  <factor-icon icon="arrow-right" />
                </app-btn>
                </li>-->
              </ul>
            </div>
          </div>
          <div class="apply-image">
            <img :src="require(`./careers.jpg`)" alt="Careers" >
          </div>
        </div>
      </div>
      <div class="contact-wrap">
        <h2 class="title">Ready to apply?</h2>
        <p>
          Reach us at
          <a href="mailto:letters@fiction.com">letters@fiction.com</a>
        </p>
      </div>
    </div>
    <div class="member-wrap">
      <h1 class="title">Team</h1>
      <!-- <div class="member-title">
        
      </div>-->
      <div class="member">
        <figure>
          <span class="andrew" />
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
          <span class="raymond" />
        </figure>
        <div class="content">
          <h3 class="title">Raymond Aleman</h3>
          <h4 class="sub-title">Founder / VP Design</h4>
          <p
            class="desc"
          >Ray is a designer and UX specialist and has previously led design at several successful startups throughout the United States, including Digital Telepathy, Omni Studio, Wearable World and PageLines.</p>
        </div>
      </div>
    </div>
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
  // Mission
  .mission-wrap {
    text-align: center;
    max-width: 650px;
    margin: 0 auto;
    padding: 5em 0;
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-weight: var(--font-weight-bold);
      font-size: 3em;
      line-height: 1;
      margin-bottom: 0.5em;
    }
    .sub-title {
      font-size: 1.3em;
      font-weight: 500;
      opacity: 0.6;
    }
    @media (max-width: 767px) {
      padding: 5em 2em;
      .title {
        font-size: 2em;
      }
      .sub-title {
        font-size: 1.2em;
      }
    }
  }
  // Values
  .values-wrap {
    line-height: 1.4;
    max-width: 960px;
    margin: 0 auto;
    box-shadow: var(--panel-shadow);
    background: #fff;
    border-radius: 5px;

    .values {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 60px;
      padding: 4em;
    }
    .values-content {
      letter-spacing: -0.03em;
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 2.5em;
        padding-bottom: 1em;
      }
      .value-item {
        font-weight: var(--font-weight-bold);
        margin-bottom: 1em;
        .name {
          font-weight: var(--font-weight-bold);
          font-size: 1.4em;
          margin-bottom: 0.5em;
        }
        .description {
          margin: 0;
          opacity: 0.6;
          font-size: 1.2em;
          line-height: 1.4;
          font-weight: 500;
          padding-left: 1.25em;
        }
      }
    }
    .values-image {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      img {
        max-width: 150%;
        border-radius: 0.5em;
        transform: translateX(80px) translateY(0) perspective(400px)
          rotateY(-7deg) rotateX(2deg) rotate(0.7deg);
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(0, 0, 0, 0.3);
      }
    }
    @media (max-width: 767px) {
      margin: 0 2em;
      .values {
        padding: 2em;
        grid-template-columns: 1fr;
        grid-gap: 20px;
      }
      .values-content .title {
        font-size: 2em;
        padding-bottom: 0.5em;
      }
      .values-image {
        margin: 0 -2em -2em;
        img {
          border-radius: 0;
          max-width: 100%;
          transform: translateX(0) translateY(0) perspective(0) rotateY(0)
            rotateX(0) rotate(0);
        }
      }
    }
  }
  // Careers
  .careers-wrap {
    .heading {
      text-align: center;
      max-width: 650px;
      margin: 0 auto;
      padding: 5em 0;
      line-height: 1.4;
      letter-spacing: -0.03em;
      @media (max-width: 767px) {
        padding: 5em 0 1em;
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        line-height: 1em;
        margin-bottom: 0.5em;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .sub-title {
        font-size: 1.3em;
        font-weight: 500;
        opacity: 0.6;
        margin-bottom: 1em;
        @media (max-width: 767px) {
          font-size: 1.2em;
          padding: 0 5%;
        }
      }
    }
    .apply-wrap {
      line-height: 1.4;
      padding-bottom: 6em;
      .pad {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0;
        @media (max-width: 767px) {
          grid-template-columns: 1fr;
        }
      }
      .apply {
        position: relative;
        z-index: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &:before {
          z-index: -1;
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          transform: skewY(-12deg);
          transform-origin: 100% 0;
          background: #f2f9ff;
          background-size: 25% 200px;
          @media (max-width: 767px) {
            transform: skewY(0);
          }
        }
        .apply-content {
          max-width: 478px;
          padding-left: 20px;
          padding-top: 100px;
          margin-top: 30px;
          margin-right: 42px;
          margin-left: auto;
          @media (max-width: 767px) {
            margin: 0 auto;
            padding: 3em 2em 3em;
          }
          .title {
            font-weight: var(--font-weight-bold);
            font-size: 2em;
          }
          .sub-title {
            padding: 1.5em 0 0.5em;
            font-size: 1.4em;
            line-height: 1.2em;
          }
          p {
            opacity: 0.6;
            font-size: 1.2em;
            font-weight: normal;
          }
          .apply-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px;
            list-style: none;
            margin: 0;
            padding-left: 0;
            @media (max-width: 767px) {
              grid-template-columns: 1fr;
            }
            // li {
            //   margin: 0;
            //   font-weight: normal;
            //   button {
            //     width: 100%;
            //   }
            // }
          }
        }
      }
      .apply-image {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        max-width: 396px;
        @media (max-width: 767px) {
          display: none;
        }
        img {
          max-width: 340px;
          border-radius: 0.5em;
          box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
            0 18px 36px -18px rgba(0, 0, 0, 0.3);
        }
      }
    }
    .contact-wrap {
      max-width: 960px;
      margin: 0 auto;
      padding: 3em 0;
      text-align: center;
      @media (max-width: 767px) {
        padding: 3em 2em;
      }
      .title {
        font-size: 2em;
        font-weight: var(--font-weight-bold);
      }
      p {
        font-size: 1.7em;
        opacity: 0.6;
        font-weight: normal;
      }
    }
  }

  // Member
  .member-wrap {
    padding: 0 2px;
    line-height: 1.2;
    max-width: 960px;
    margin: 2em auto;
    border-top: 1px solid rgba(50, 50, 93, 0.05);
    padding-top: 5em;
    .title {
      font-size: 2.5em;
      text-align: center;
      font-weight: var(--font-weight-bold);
    }
    .member {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 20px 0;
      position: relative;
      overflow: hidden;
      margin: 4em 0;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
        0 18px 36px -18px rgba(0, 0, 0, 0.3);
      @media (max-width: 767px) {
        margin: 4em 2em;
      }
      .title {
        text-align: left;
      }
      figure {
        height: 100%;
        position: absolute;
        overflow: hidden;
        z-index: 2;
        left: -40px;
        top: 0;
        right: calc(50% + 100px);
        -webkit-transform: skewX(-12deg);
        transform: skewX(-12deg);

        @media (max-width: 767px) {
          position: relative;
          height: 200px;
          background: #506677;
          overflow: hidden;
          right: 0;
          top: 0;
          left: 0;
          -webkit-transform: skewX(0);
          transform: skewX(0);
        }
        span {
          display: block;
          position: absolute;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: left center;
          height: 100%;
          right: -40px;
          top: 0;
          bottom: 0;
          left: 20px;
          -webkit-transform: skewX(12deg);
          transform: skewX(12deg);
          &.raymond {
            background-image: url(./raymond.jpg);
          }
          &.andrew {
            background-image: url(./andrew.jpg);
          }
          @media (max-width: 767px) {
            display: block;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            -webkit-transform: skewX(0);
            transform: skewX(0);
          }
        }
      }
      .content {
        grid-column: 2;
        padding: 4em 4em 4em 0;
        line-height: 1.4;
        font-size: 1.2em;
        .title {
          font-weight: var(--font-weight-bold);
          font-size: 1.5em;
        }
        .sub-title {
          font-weight: normal;
        }
        p {
          margin-top: 1em;
          opacity: 0.6;
          font-weight: 500;
        }
        cite {
          display: block;
          margin-top: 1em;
        }
      }
    }
    @media (max-width: 767px) {
      .title {
        font-size: 2em;
      }
      .member {
        grid-template-columns: 1fr;

        .content {
          grid-column: auto;
          width: 100%;
          padding: 1em 2em 2em;
        }
      }
    }
  }
}
</style>