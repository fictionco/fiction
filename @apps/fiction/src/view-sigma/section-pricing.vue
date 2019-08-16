<template>
  <section class="pricing-wrap">
    <div class="mast">
      <h2 class="section-title common-sectiontitle">Set up your startup for $500</h2>
      <div class="pricing-section">
        <div class="icon">
          <svg viewBox="0 0 48 48">
            <path
              fill="#FCD669"
              class="hover-fillLight"
              d="M24 0c13.255 0 24 10.745 24 24S37.255 48 24 48 0 37.255 0 24 10.745 0 24 0z"
            ></path>
            <path
              fill="#CE7C3A"
              class="hover-fillDark"
              d="M24.012 1.834c.366.005.73.196.92.575l16.825 33.72c.396.79-.314 1.685-1.175 1.48L24 33.626V1.834h.01z"
            ></path>
            <path
              fill="#FFF"
              d="M24 1.834v31.794l-16.584 3.98A1.043 1.043 0 0 1 6.24 36.13L23.067 2.41c.195-.39.572-.58.947-.576H24z"
            ></path>
          </svg>
        </div>
        <div class="feature-list core">
          <h3 class="feature-title common-bodytitle">Form a company with Stripe Atlas</h3>
          <p class="common-bodytext">
            We’ll guide you through what’s needed to set up your startup.
          </p>
          <h4 class="feature-lead common-bodytitle">Includes</h4>
          <ul class="common-bodytext">
            <li>
              <span> Formation of a C Corporation in Delaware&nbsp; </span>
            </li>
            <li>
              <span>
                Delaware state filing fees
                <small>($189 fee included)</small>
              </span>
            </li>
            <li>
              <span>
                Signed documents to establish company bylaws and protect IP&nbsp;
              </span>
            </li>
            <li>
              <span> Tool to issue stock to founders&nbsp; </span>
            </li>
            <li>
              <span> First year of registered agent fees&nbsp; </span>
            </li>
            <li>
              <span> Tax ID (EIN) filing&nbsp; </span>
            </li>
            <li>
              <span> Bank account opening&nbsp; </span>
            </li>
            <li>
              <span>
                Access to the Stripe Atlas Community
              </span>
            </li>
            <li>
              <span> Free templates for post-formation legal needs&nbsp; </span>
            </li>
          </ul>
        </div>
        <div class="price">
          <h3 class="common-sectiontitle">$500</h3>
          <h4 class="common-bodytitle">setup fee</h4>
        </div>
      </div>
      <div class="business-section">
        <div class="icon">
          <svg
            width="48px"
            height="48px"
            viewBox="0 0 48 48"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(-131.000000, -7924.000000)">
                <g transform="translate(131.000000, 7924.000000)">
                  <circle fill="#FCE883" cx="24" cy="24" r="24"></circle>
                  <path
                    d="M26,26 L26,34 C26,35.1045695 25.1045695,36 24,36 C22.8954305,36 22,35.1045695 22,34 L22,26 L14,26 C12.8954305,26 12,25.1045695 12,24 C12,22.8954305 12.8954305,22 14,22 L22,22 L22,14 C22,12.8954305 22.8954305,12 24,12 C25.1045695,12 26,12.8954305 26,14 L26,22 L34,22 C35.1045695,22 36,22.8954305 36,24 C36,25.1045695 35.1045695,26 34,26 L26,26 Z"
                    id="1"
                    fill="#E39F48"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div class="feature-list">
          <h3 class="feature-title common-bodytitle">Run your business</h3>
          <p class="common-bodytext">
            After you set up your company using Stripe Atlas, there are separate ongoing
            costs of running a company that we help you manage.
          </p>
          <h4 class="feature-lead common-bodytitle">
            Key ongoing costs <small>(not included in the setup fee)</small>
          </h4>
          <ul class="common-bodytext">
            <li>
              <span>
                <a href="/docs/atlas/next#agent" class="common-link"
                  >Delaware registered agent</a
                >—$100 per year
                <small>(renewed automatically)</small>
              </span>
            </li>
            <li>
              <span>
                <a href="/docs/atlas/tax-obligations#file-us-corp-tax" class="common-link"
                  >Corporate tax preparation</a
                >—packages start at $250 per year&nbsp;
              </span>
            </li>
            <li>
              <span>
                <a
                  href="/docs/atlas/tax-obligations#file-delaware-tax"
                  class="common-link"
                  >Delaware tax filing</a
                >—preparation is free, Delaware fee starts at $225&nbsp;
              </span>
            </li>
            <li>
              <span>
                <a href="/docs/atlas/account-progress#bank-account" class="common-link"
                  >Bank account maintenance</a
                >—$25 per month&nbsp;
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {}
}
</script>
<style lang="less">
.pricing-wrap {
  position: relative;
  margin: 180px 0 90px;
  z-index: 1;

  @media (max-width: 767px) {
    margin: 90px 0;
  }

  .section-title {
    text-align: center;
  }

  .pricing-section,
  .business-section {
    display: grid;
    grid-template-columns: 48px 70% auto;
    margin-top: 64px;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }

    > .icon {
      max-width: 48px;
      margin-bottom: 16px;
    }

    > .feature-list {
      padding: 0 220px 0 64px;

      @media (max-width: 767px) {
        padding: 0;
      }

      &.core {
        padding-right: 64px;

        @media (max-width: 767px) {
          padding-right: 0;
        }

        ul {
          list-style: none;
          padding-left: 0;
          li {
            display: flex;
            &:before {
              content: "";
              display: inline-block;
              background-image: url(./img/checkmark.svg);
              background-size: 100%;
              width: 20px;
              height: 20px;
              margin: 4px 16px 0 0;
            }
          }
        }
      }
      .feature-title {
        color: #32325d;
        margin-bottom: 0;
      }
      .feature-lead {
        color: #6b7c93;
        margin-top: 24px;
      }
      ul {
        list-style-type: disc;
        margin: 0;
        padding-left: 20px;

        li {
          color: #aab7c4;
          padding: 8px 0;
          span {
            color: #525f7f;
          }
        }
      }
    }

    .price {
      border-left: 1px solid #e6ebf1;
      padding: 0 0 0 32px;
      @media (max-width: 767px) {
        border-bottom: 1px solid #e6ebf1;
        border-left: 0;
        padding: 16px 0 30px;
      }
      .common-sectiontitle {
        color: #f5be58;
        font-size: 34px;
        margin: 0 0 0 -4px;
        line-height: 1.1;
      }
    }
  }
}
</style>
