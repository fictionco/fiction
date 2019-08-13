<template>
  <section class="integrate">
    <div class="mast">
      <div class="integrate-intro">
        <h2 class="common-SectionTitle">Hardware</h2>
        <p
          class="common-MediumBodyText integrate-intro-paragraph"
        >Stripe Terminal works with pre-certified third-party hardware to support a range of use-cases. We currently offer two reader and SDK combinations, with more coming&nbsp;soon.</p>
      </div>
    </div>

    <div class="mast-lg table-container">
      <div class="Helm-FeatureTable Helm-FeatureTable--noFooter">
        <div class="Helm-FeatureTable__content">
          <div class="Helm-FeatureTable__labels">
            <div class="Helm-FeatureTable__label">
              <span class="common-UppercaseText Helm__text--slate3">Stripe SDK</span>
            </div>
            <div class="Helm-FeatureTable__label">
              <span class="common-UppercaseText Helm__text--slate3">Reader</span>
            </div>
          </div>

          <div class="Helm-FeatureTable__column Helm-FeatureTable__column--dominant">
            <div class="Helm-FeatureTable__header Helm__background--slate1">
              <h1 class="common-BodyTitle Helm__text--slate9">Native mobile app</h1>
            </div>

            <div class="Helm-FeatureTable__subHeader">
              <span class="common-UppercaseText Helm__text--slate3">Stripe SDK</span>
            </div>

            <div class="Helm-FeatureTable__item">
              <p
                class-name="Helm-FeatureTable__small"
                class="common-BodyText Helm-FeatureTable__small"
              >
                <span>iOS</span>
                <span class="second">
                  Android
                  <span class="annotation-label">Beta</span>
                </span>
              </p>
            </div>
            <div class="Helm-FeatureTable__subHeader">
              <span class="common-UppercaseText Helm__text--slate3">Reader</span>
            </div>

            <div class="Helm-FeatureTable__item Helm-FeatureTable__item--alternate">
              <p
                class-name="Helm-FeatureTable__small"
                class="common-BodyText Helm-FeatureTable__small"
              >
                <span>
                  <span class="reader-logo reader-logo--bbpos">bbPOS</span> Chipper™ 2X BT
                </span>
                <span class="second long-label">
                  <span>
                    <span class="reader-logo reader-logo--verifone">Verifone</span>® P400
                  </span>
                  <span class="annotation-label">Coming soon</span>
                </span>
              </p>
            </div>
          </div>
          <div class="Helm-FeatureTable__column">
            <div class="Helm-FeatureTable__header Helm__background--slate1">
              <h1 class="common-BodyTitle Helm__text--slate9">Desktop or mobile&nbsp;web</h1>
            </div>

            <div class="Helm-FeatureTable__subHeader" />

            <div class="Helm-FeatureTable__item">
              <p
                class-name="Helm-FeatureTable__small"
                class="common-BodyText Helm-FeatureTable__small"
              >
                <span>JavaScript</span>
              </p>
            </div>
            <div class="Helm-FeatureTable__subHeader" />

            <div class="Helm-FeatureTable__item Helm-FeatureTable__item--alternate">
              <p
                class-name="Helm-FeatureTable__small"
                class="common-BodyText Helm-FeatureTable__small"
              >
                <span class="second">
                  <span class="reader-logo reader-logo--verifone">Verifone</span>® P400
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  mounted() {}
}
</script>
<style lang="less">
.integrate {
  position: relative;
  padding-top: 60px;
  @media (min-width: 670px) {
    padding-top: 120px;
  }
  .integrate-intro {
    text-align: center;
  }
  .integrate-intro-paragraph {
    max-width: 880px;
    margin: 20px auto 14px;
  }
  .table-container {
    max-width: 1100px;
    margin: 30px auto 0;
    padding: 0;
    position: relative;
    border-bottom: 1px solid #f6f9fc;
    @media (min-width: 880px) {
      border-bottom: none;
    }
  }

  .Helm-FeatureTable {
    --cell-min-height: 85px;
    --border-radius: 8px;
    width: 100%;
    max-width: 100%;
    @media (min-width: 670px) {
      --cell-min-height: 105px;
      --font-size: 17px;
    }
    @media (min-width: 880px) {
      padding: 20px 5px;
    }

    .Helm-FeatureTable__small {
      font-weight: 400;
      font-size: 15px;
      line-height: 20px;
    }

    .Helm-FeatureTable__content {
      display: flex;
      justify-content: flex-start;
      .Helm-FeatureTable__labels {
        flex: 0 0.7 320px;
        max-width: 320px;
        min-width: 160px;
        align-self: flex-end;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        box-shadow: 0 3px 3px 0 rgba(23, 55, 87, 0.03),
          0 0 5px 1px rgba(0, 0, 0, 0.05);
        margin-bottom: 64px;
        display: none;
        @media (min-width: 880px) {
          display: block;
        }

        .Helm-FeatureTable__label {
          padding: 0 32px;
          color: #32325d;
          background: #fff;
          min-height: var(--cell-min-height);
          display: flex;
          flex-direction: column;
          justify-content: center;
          &:first-child {
            border-top-left-radius: 4px;
          }
          &:nth-child(2n) {
            background: #f6f9fc;
          }
          @media (min-width: 880px) {
            min-height: calc(var(--cell-min-height) - 5px);
          }
        }
      }
      .Helm-FeatureTable__column {
        display: flex;
        flex-direction: column;
        position: relative;
        flex: 1;
        @media (min-width: 880px) {
          border-radius: var(--border-radius);
          margin-right: 8px;
          flex: 1 0.3 420px;
          max-width: 420px;
          min-width: 170px;
          box-shadow: 0 4px 35px 0 rgba(23, 55, 87, 0.1),
            0 5px 15px 0 rgba(0, 0, 0, 0.07);
        }
        &.Helm-FeatureTable__column--dominant .Helm-FeatureTable__subHeader {
          width: 200%;
          z-index: 2;
        }
        .Helm__background--slate1 {
          color: #f6f9fc;
          background-color: #32325d;
        }
        .Helm-FeatureTable__header {
          padding: 16px 20px;
          text-align: center;
          position: sticky;
          z-index: 1;
          min-height: 96px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
          top: 0;
          bottom: 64px;

          @media (min-width: 880px) {
            position: relative;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
            padding: 16px 40px;
          }
          h1 {
            font-size: 17px;
            line-height: 23px;
          }
        }
        .Helm-FeatureTable__subHeader {
          min-height: 54px;
          background-color: #f6f9fc;
          display: flex;
          width: 0;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
          @media (min-width: 880px) {
            display: none;
          }
        }
        .Helm-FeatureTable__item {
          min-height: var(--cell-min-height);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
          padding: 0 15px;
          background-color: #fff;
          @media (min-width: 880px) {
            &.Helm-FeatureTable__item--alternate {
              background: #f6f9fc;
            }
          }
          @media (min-width: 670px) {
            padding: 0 24px;
          }
          span {
            line-height: 21px;
            color: #525f7f;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--font-size);
            &.second {
              margin: 8px 0 0;
            }
            &.long-label {
              flex-direction: column;
              @media (min-width: 420px) {
                flex-direction: row;
              }
            }
          }
          span.annotation-label {
            text-transform: uppercase;
            font-size: 0.7em;
            font-weight: 600;
            color: #aab7c4;
            display: inline-block;
            margin: 0 0 0 6px;
            position: relative;
            top: 1px;
          }
        }
      }
    }

    &.Helm-FeatureTable--noFooter {
      .Helm-FeatureTable__labels {
        margin-bottom: 5px;
      }
      .Helm-FeatureTable__item:last-of-type {
        border-radius: 0 0 var(--border-radius) var(--border-radius);
      }
    }
  }
}
</style>
