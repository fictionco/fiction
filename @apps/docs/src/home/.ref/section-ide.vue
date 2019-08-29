<template>
  <section class="big-section sigma-ide">
    <div class="mast split-feature">
      <article class="feature-content">
        <home-icon icon="ssr" />

        <h1 class="section-title">Universal SSR</h1>

        <p class="medium-body-text">
          We’ve already written the queries for the most useful reports for different
          types of businesses: From computing MRR to ARPU to analyzing the payment methods
          your customers prefer, you can jump in quickly by editing one of our pre-built
          templates or start from scratch to fully customize your report. We’ve also added
          syntax highlighting, descriptive errors, and auto-completion for data tables and
          columns—it’s like a built-in IDE for writing queries.
        </p>

        <p class="medium-body-text">
          <a class="common-Link" href="#">
            Syntax documentation
            <factor-icon icon="arrow-right" />
          </a>
        </p>
      </article>

      <figure class="feature-figure">
        <div class="ide-animation">
          <div class="code sigma-query-code">
            <div class="line-numbers">
              1
              <br >2
              <br >3
              <br >4
              <br >5
              <br >6
            </div>
            <pre>
              <span class="bold" style="transform: translate(60px, 20px); opacity: 1;">s</span>
            </pre>
          </div>
          <div class="popups">
            <!-- 2 : cu -->
            <ul data-x="2" data-y="4" style="transform: translate(82px, 136px); opacity: 1;">
              <li>
                <span>
                  <code>customers</code>
                  <small>Table</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.account_balance</code>
                  <small>Bigint</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.business_vat_id</code>
                  <small>Varchar</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.created</code>
                  <small>Timestamp</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.currency</code>
                  <small>Varchar</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.default_source_id</code>
                  <small>Varchar</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.delinquent</code>
                  <small>Boolean</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.description</code>
                  <small>Varchar</small>
                </span>
              </li>
              <li>
                <span>
                  <code>customers.discount_coupon_id</code>
                  <small>Foreign key</small>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </figure>
    </div>
  </section>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue"),
    "image-pattern": () => import("./el-image-pattern")
  },
  methods: {}
}
</script>
<style lang="less">
.sigma-ide {
  position: relative;
  overflow: hidden;

  padding: 180px 0;
  @media (max-width: 767px) {
    padding: 100px 0 20px;
  }

  .pattern {
    position: absolute;
    top: -500px;
    left: calc(50% + 280px);
  }
  .split-feature {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .feature-content {
      z-index: 0;
      .icon {
        width: 72px;
        height: 72px;
        margin: -15px 0 20px -5px;
      }
      h1 {
        margin-bottom: 30px;
      }
      p {
        margin-top: 20px;
      }
    }
    .feature-figure {
      position: relative;
      z-index: 10;
      padding: 0 0 0 80px;
      @media (max-width: 767px) {
        padding: 80px 0 0;
      }
      .ide-animation {
        position: relative;
        pointer-events: none;
        padding-bottom: 100px;
        @media (max-width: 767px) {
          padding-bottom: 140px;
        }
        .code {
          background: #fff;
          height: 216px;
          width: 100%;
          min-width: 400px;
          border-radius: 8px;
          box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
            0 18px 36px -18px rgba(0, 0, 0, 0.3),
            0 -12px 36px -8px rgba(0, 0, 0, 0.025);
          font-family: monospace;
          font-size: 18px;
          line-height: 29px;
          color: #6f7c82;
          .line-numbers {
            white-space: pre;
            position: absolute;
            top: 20px;
            left: 30px;
            color: #cfd7df;
            user-select: none;
          }
          pre {
            padding-left: 20px;
          }
        }
        .popups ul {
          position: absolute;
          left: 0;
          top: 0;
          background: #fff;
          box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
            0 3px 7px -3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.07);
          border-radius: 4px;
          padding: 5px 0;
          list-style: none;
          min-width: 300px;
          max-width: 500px;
          color: #6b7c93;
          opacity: 0;
          transition: opacity 0.2s;
          will-change: opacity;
          li {
            padding: 5px 15px 6px;
            &:first-child {
              background: #e6ebf1;
              color: #32325d;
            }
          }
          code {
            font-size: 13px;
            margin-right: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          span {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            justify-content: space-between;
            white-space: nowrap;
          }
          small {
            color: #8898aa;
            font-size: 11px;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
