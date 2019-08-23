<template>
  <div class="features">
    <el-stripes :num-stripes="11" />

    <section class="feature feature--developer feature--reversed">
      <div class="mast">
        <article class="feature-content">
          <h3 class="common-UppercaseTitle feature-title">Build your perfect point of sale</h3>
          <p class="common-MediumBodyText">
            Break free from the constraints of off-the-shelf point of sale software.
            Fiction Terminal makes it easier to build your point of sale and own your
            checkout experience, including creating customized email receipts or splash
            screens. Our APIs and SDKs simplify the integration of Terminal into
            JavaScript web apps, or iOS and Android mobile apps.
          </p>
          <a href="#" class="common-link common-link--arrow common-MediumBodyText">
            Explore the docs
            <factor-icon icon="arrow-right" />
          </a>
        </article>

        <figure class="floating-cards">
          <div class="card">
            <div class="code-container">
              <pre><code class="prism language-javascript">const terminal = StripeTerminal.create({
  onFetchConnectionToken: server.fetchConnectionToken,
});

const result = await terminal.discoverReaders();
const reader = result.discoveredReaders[0];
await terminal.connectReader(reader);

const item = {
  description: 'High Growth Handbook',
  amount: 2000,
  quantity: 1,
};
const cart = {
  lineItems: [item],
  currency: 'usd',
};

terminal.setReaderDisplay({ type: 'cart', cart });</code></pre>
            </div>
            <div class="shine" />
          </div>
        </figure>
      </div>
    </section>

    <section class="feature feature-hardware">
      <div class="mast">
        <article class="feature-content">
          <h3 class="common-UppercaseTitle feature-title">Pre-certified card readers</h3>
          <p class="common-MediumBodyText">
            Save months of developer and certification time with our EMV Level 1, 2, 3
            pre-certified Fiction card readers. They provide end-to-end encryption,
            natively support chip cards and contactless payments, including Apple Pay and
            Google Pay, and help protect you against liability for counterfeit fraud.
          </p>
          <a href="#" class="common-link common-link--arrow common-MediumBodyText">
            See reader options
            <factor-icon icon="arrow-right" />
          </a>
        </article>

        <figure class="floating-cards">
          <div class="card">
            <img :src="require(`./img/devices@2x.jpg`)" alt="Fiction Terminal device" >
          </div>
        </figure>
      </div>
    </section>

    <section class="feature feature--reversed feature-fleet">
      <div class="mast">
        <article class="feature-content">
          <h3 class="common-UppercaseTitle feature-title">Centralized fleet management</h3>
          <p class="common-MediumBodyText">
            Manage your entire fleet of Fiction card readers right from the Fiction
            Dashboard, where you can register hardware to a location, monitor device
            status, and order card readers. We’ll take care of delivering the hardware
            where you need it.
          </p>
          <a href="#" class="common-bodytext common-link common-link--arrow">
            Learn more
            <factor-icon icon="arrow-right" />
          </a>
        </article>

        <figure class="floating-cards">
          <div class="card">
            <img
              :src="require(`./img/screenshot-fleet-updated.jpg`)"
              alt="Fiction Dashboard screenshot of managing your fleet hardware."
            >
          </div>
        </figure>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {
    "el-stripes": () => import("./el-stripes")
  },
  mounted() {}
}
</script>
<style lang="less">
.features {
  position: relative;
  z-index: 0;
  padding: 200px 0 130px;

  @media (min-width: 670px) {
    padding: 130px 0;
  }

  .common-link {
    margin: 13px 0 0;
  }

  .floating-cards {
    perspective: 1500px;
    position: relative;
    align-items: center;
    > div {
      flex-shrink: 0;
      border-radius: 8px;
    }
    .shine {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
    }
  }

  .feature {
    &.feature--reversed {
      @media (min-width: 670px) {
        figure {
          order: -1;
          justify-content: flex-end;
        }
      }
    }
    .mast {
      display: flex;
      flex-direction: column;
      @media (min-width: 670px) {
        flex-direction: row;
        .feature-content,
        figure {
          width: 50%;
        }
      }
    }
    .feature-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 0;
      .feature-title {
        color: #32325d;
        margin: 0 0 10px;
      }
    }
    &.feature--developer {
      max-width: 100vw;
      figure {
        display: flex;
        justify-content: center;
        padding-bottom: 80px;
        transform: scale(0.7);
        margin: -80px 0;

        @media (min-width: 420px) {
          transform: none;
          margin: 0;
        }
        @media (min-width: 670px) {
          justify-content: flex-end;
          padding: 80px 40px 80px 0;
        }
        @media (min-width: 880px) {
          padding-right: 70px;
        }
        @media (min-width: 1040px) {
          padding-right: 100px;
        }
        .card {
          position: relative;
          width: 525px;
          height: 400px;
          transform: rotate3d(0.5, 0.866, 0, 15deg) rotateZ(-1deg);
          box-shadow: -27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
            -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
          background: #32325d;
          display: flex;
          flex-direction: column;
        }
        .code-container {
          position: relative;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          padding: 25px 30px;
          font-size: 0.875em;
          line-height: normal;
          color: #e6ebf1;
          pre {
            position: relative;
            color: #e6ebf1;
            white-space: pre;
            code {
              font-family: monospace;
            }
          }
        }
        .shine {
          background: linear-gradient(
            to top right,
            hsla(0, 0%, 100%, 0) 20%,
            hsla(0, 0%, 100%, 0.5) 70%,
            #fff
          );
          opacity: 0.2;
        }
      }
    }
    &.feature-hardware {
      max-width: 100vw;
      .card img {
        max-width: 100%;
        width: 680px;
        height: auto;
        @media (min-width: 1040px) {
          max-width: none;
        }
      }
    }
    &.feature-fleet {
      max-width: 100vw;
      figure {
        display: flex;
        justify-content: center;
        padding-bottom: 80px;
        transform: scale(0.7);
        margin: -80px 0;
        @media (min-width: 420px) {
          transform: none;
          margin: 0;
        }
        @media (min-width: 670px) {
          justify-content: flex-end;
          padding: 80px 40px 80px 0;
        }
        @media (min-width: 880px) {
          padding-right: 70px;
        }
        @media (min-width: 1040px) {
          padding-right: 100px;
        }
        .card {
          position: relative;
          width: 554px;
          height: 360px;
          transform: rotate3d(0.5, 0.866, 0, 15deg) rotateZ(-1deg);
          box-shadow: -27.1px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
            -16.2px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
          border-radius: 10px;
          background: #32325d;
          display: flex;
          flex-direction: column;
          > img {
            height: 100%;
            width: auto;
            border-radius: 8px;
          }
        }
      }
    }
  }
}
</style>
