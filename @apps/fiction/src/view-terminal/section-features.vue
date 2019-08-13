<template>
  <div id="features" class="features">
    <div class="common-StripeGrid">
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
          <div class="stripe"></div>
        </div>
      </div>
    </div>
    <section id="developer-centric" class="feature feature--developer feature--reversed">
      <div class="container-lg">
        <article class="feature-content">
          <h3 class="common-UppercaseTitle feature-title">
            Build your perfect point of sale
          </h3>
          <p class="common-MediumBodyText">
            Break free from the constraints of off-the-shelf point of sale software.
            Fiction Terminal makes it easier to build your point of sale and own your
            checkout experience, including creating customized email receipts or splash
            screens. Our APIs and SDKs simplify the integration of Terminal into
            JavaScript web apps, or iOS and Android mobile apps.
          </p>
          <a
            href="#"
            class="common-Link common-Link--arrow common-MediumBodyText"
            data-analytics-action="docs_terminal"
            data-analytics-source="feature_developer_centric"
          >
            Explore the docs <factor-icon icon="arrow-right" />
          </a>
        </article>

        <figure class="floating-cards">
          <div class="card">
            <div class="code-container">
              <pre
                class="language-javascript"
              ><code class="prism language-javascript"><span class="token keyword">const</span> terminal <span class="token operator">=</span> FictionTerminal<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>  
  onFetchConnectionToken<span class="token punctuation">:</span> server<span class="token punctuation">.</span>fetchConnectionToken<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> terminal<span class="token punctuation">.</span><span class="token function">discoverReaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> reader <span class="token operator">=</span> result<span class="token punctuation">.</span>discoveredReaders<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">await</span> terminal<span class="token punctuation">.</span><span class="token function">connectReader</span><span class="token punctuation">(</span>reader<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> item <span class="token operator">=</span> <span class="token punctuation">{</span>
  description<span class="token punctuation">:</span> <span class="token string">'High Growth Handbook'</span><span class="token punctuation">,</span>
  amount<span class="token punctuation">:</span> <span class="token number">2000</span><span class="token punctuation">,</span>
  quantity<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> cart <span class="token operator">=</span> <span class="token punctuation">{</span>
  lineItems<span class="token punctuation">:</span> <span class="token punctuation">[</span>item<span class="token punctuation">]</span><span class="token punctuation">,</span>
  currency<span class="token punctuation">:</span> <span class="token string">'usd'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

terminal<span class="token punctuation">.</span><span class="token function">setReaderDisplay</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> <span class="token string">'cart'</span><span class="token punctuation">,</span> cart <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code>
              </pre>
            </div>
            <div class="shine"></div>
          </div>
        </figure>
      </div>
    </section>

    <section id="pre-certified-hardware" class="feature feature--hardware">
      <div class="container-lg">
        <article class="feature-content">
          <h3 class="common-UppercaseTitle feature-title">
            Pre-certified card readers
          </h3>
          <p class="common-MediumBodyText">
            Save months of developer and certification time with our EMV Level 1, 2, 3
            pre-certified Fiction card readers. They provide
            <span class="feature-no-break-english">end-to-end</span> encryption, natively
            support chip cards and contactless payments, including Apple Pay and Google
            Pay, and help protect you against liability for counterfeit&nbsp;fraud.
          </p>
          <a
            href="#"
            class="common-Link common-Link--arrow common-MediumBodyText"
            data-analytics-action="docs_terminal_readers"
            data-analytics-source="feature_pre_certified_hardware"
          >
            See reader options <factor-icon icon="arrow-right" />
          </a>
        </article>

        <figure class="floating-cards">
          <div class="card">
            <img :src="require(`./img/devices@2x.jpg`)" alt="Fiction Terminal device" />
          </div>
        </figure>
      </div>
    </section>

    <section id="fleet-management" class="feature feature--reversed feature--fleet">
      <div class="container-lg">
        <article class="feature-content">
          <h3 class="common-UppercaseTitle feature-title">
            Centralized fleet management
          </h3>
          <p class="common-MediumBodyText">
            Manage your entire fleet of Fiction card readers right from the Fiction
            Dashboard, where you can register hardware to a location, monitor device
            status, and order card readers. We’ll take care of delivering the hardware
            where you need&nbsp;it.
          </p>
          <a
            href="#"
            class="common-BodyText common-Link common-Link--arrow"
            data-analytics-action="docs_terminal_readers"
            data-analytics-source="feature_fleet_management"
          >
            Learn more <factor-icon icon="arrow-right" />
          </a>
        </article>

        <figure class="floating-cards">
          <div class="card">
            <img
              :src="require(`./img/screenshot-fleet-updated.jpg`)"
              alt="Fiction Dashboard screenshot of managing your fleet hardware."
            />
          </div>
        </figure>
      </div>
    </section>
  </div>
</template>
<script>
export default {
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

  .common-StripeGrid {
    .background {
      background-color: #f6f9fc;
      grid-row: e("3 / -2") !important;
    }

    .stripe {
      &:first-child {
        box-shadow: inset 0 0 0 2px #e6ebf1;
        grid-column: e("5 / 8");
        grid-row: e("1 / 2");
        transform: translateY(2px);
      }
      &:nth-child(2) {
        background-color: #e6ebf1;
        grid-column: left-gutter-start / 7;
        grid-row: e("2 / 3");
      }
      &:nth-child(3) {
        background-color: #87bbfd;
        grid-column: viewport-start / 8;
        grid-row: e("3 / 4");
      }
      &:nth-child(4) {
        background-color: #e6ebf1;
        grid-column: e("8 / 10");
        grid-row: e("3 / 4");
      }
      &:nth-child(5) {
        background-color: #e6ebf1;
        grid-column: right-gutter;
        grid-row: e("3 / 4");
      }
      &:nth-child(6) {
        display: none;
        background-color: #32325d;
        grid-column: e("3 / 8");
        grid-row: e("4 / 5");
        @media (min-width: 670px) {
          display: block;
        }
      }
      &:nth-child(7) {
        background-color: #6772e5;
        grid-column: e("3 / 6");
        grid-row: e("-5 / -4");
      }
      &:nth-child(8) {
        background-color: #32325d;
        grid-column: viewport-start/8;
        grid-row: e("-4 / -3");
      }
      &:nth-child(9) {
        background-color: #87bbfd;
        grid-column: e("8 / 10");
        grid-row: e("-4 / -3");
      }
      &:nth-child(10) {
        background-color: #e6ebf1;
        grid-column: e("6 / 9");
        grid-row: e("-3 / -2");
      }
      &:nth-child(11) {
        box-shadow: inset 0 0 0 2px #e6ebf1;
        grid-column: e("3 / 6");
        grid-row: e("-2 / -1");
      }
    }
  }

  .common-Link {
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
    .container-lg {
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
          font-size: 14px;
          line-height: normal;
          color: #e6ebf1;
          pre {
            position: relative;
            color: #e6ebf1;
            white-space: pre;
            code {
              font-family: Source Code Pro, Consolas, Menlo, monospace;
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
    &.feature--hardware {
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
    &.feature--fleet {
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
