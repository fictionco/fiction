<template>
  <section class="integrate">
    <div class="mast">
      <div class="integrate-intro">
        <h2 class="common-SectionTitle">Build Impressive Apps</h2>
        <p class="common-MediumBodyText integrate-intro-paragraph">
          Fiction Terminal works with pre-certified third-party hardware to support a
          range of use-cases. We currently offer two reader and SDK combinations, with
          more coming soon.
        </p>
      </div>
    </div>

    <div class="mast-lg feature-table-wrap">
      <div class="feature-table">
        <div class="feature-table-content">
          <div class="labels">
            <div class="label">
              <span class="common-uppercase-text">Fiction SDK</span>
            </div>
            <div class="label">
              <span class="common-uppercase-text">Reader</span>
            </div>
          </div>

          <div class="column column-dominant">
            <div class="header bg-dark-blue">
              <h1 class="common-body-title">Native mobile app</h1>
            </div>

            <div class="subheader">
              <span class="common-uppercase-text">Fiction SDK</span>
            </div>

            <div class="item">
              <p class="common-bodytext text-small">
                <span>iOS</span>
                <span class="second">
                  Android
                  <span class="annotation-label">Beta</span>
                </span>
              </p>
            </div>
            <div class="subheader">
              <span class="common-uppercase-text">Reader</span>
            </div>

            <div class="item item-alternate">
              <p class="common-bodytext text-small">
                <span class="long-label"> <span>bbPOS</span> Chipper™ 2X BT </span>
                <span class="second long-label">
                  <span> <span>Verifone</span>® P400 </span>
                  <span class="annotation-label">Coming soon</span>
                </span>
              </p>
            </div>
          </div>
          <div class="column">
            <div class="header bg-dark-blue">
              <h1 class="common-body-title">Desktop or mobile web</h1>
            </div>

            <div class="subheader" />

            <div class="item">
              <p class="common-bodytext text-small">
                <span>JavaScript</span>
              </p>
            </div>
            <div class="subheader" />

            <div class="item item-alternate">
              <p class="common-bodytext text-small">
                <span class="second"> <span>Verifone</span>® P400 </span>
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
  mounted() {},
}
</script>
<style lang="less">
.integrate {
  position: relative;
  padding-top: 120px;
  @media (max-width: 767px) {
    padding-top: 60px;
  }

  .integrate-intro {
    text-align: center;
  }
  .integrate-intro-paragraph {
    max-width: 880px;
    margin: 20px auto 14px;
  }
  .feature-table-wrap {
    max-width: 1100px;
    margin: 30px auto 0;
    padding: 0;
    position: relative;
    border-bottom: none;
    @media (max-width: 767px) {
      border-bottom: 1px solid #f6f9fc;
    }
  }

  .feature-table {
    --border-radius: 8px;
    --cell-min-height: 105px;
    @media (max-width: 767px) {
      --cell-min-height: 85px;
    }
    width: 100%;
    max-width: 100%;
    padding: 20px 5px;
    @media (max-width: 767px) {
      padding: 0;
    }

    .text-small {
      font-size: 1em;
    }

    .feature-table-content {
      display: flex;
      justify-content: flex-start;
      .labels {
        flex: 0 0.7 320px;
        max-width: 320px;
        min-width: 160px;
        align-self: flex-end;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        box-shadow: 0 3px 3px 0 rgba(23, 55, 87, 0.03), 0 0 5px 1px rgba(0, 0, 0, 0.05);
        margin-bottom: 5px;
        display: block;

        @media (max-width: 767px) {
          display: none;
        }

        .label {
          padding: 0 32px;
          color: #32325d;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: calc(var(--cell-min-height) - 5px);
          @media (max-width: 767px) {
            min-height: var(--cell-min-height);
          }
          &:first-child {
            border-top-left-radius: 4px;
          }
          &:nth-child(2n) {
            background: #f6f9fc;
          }
        }
      }
      .column {
        display: flex;
        flex-direction: column;
        position: relative;
        flex: 1 0.3 420px;
        border-radius: var(--border-radius);
        margin-right: 8px;
        max-width: 420px;
        min-width: 170px;
        box-shadow: 0 4px 35px 0 rgba(23, 55, 87, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.07);
        @media (max-width: 767px) {
          flex: 1;
          border-radius: 0;
          margin-right: 0;
          max-width: initial;
          min-width: initial;
          box-shadow: none;
        }
        &.column-dominant .subheader {
          width: 200%;
          z-index: 2;
        }
        .bg-dark-blue {
          background-color: #1b223c;
          h1 {
            color: #f6f9fc;
          }
        }
        .header {
          text-align: center;
          z-index: 1;
          min-height: 96px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
          top: 0;
          bottom: 64px;
          border-radius: var(--border-radius) var(--border-radius) 0 0;
          position: relative;
          padding: 16px 40px;

          @media (max-width: 767px) {
            position: sticky;
            padding: 16px 20px;
            border-radius: 0;
          }

          h1 {
            font-size: 1.063em;
            line-height: 1.4em;
          }
        }
        .subheader {
          min-height: 54px;
          background-color: #f6f9fc;
          width: 0;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
          display: none;
          @media (max-width: 767px) {
            display: flex;
          }
        }
        .item {
          min-height: var(--cell-min-height);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
          background-color: #fff;
          padding: 0 24px;

          @media (max-width: 767px) {
            padding: 0 15px;
          }

          &:last-of-type {
            border-radius: 0 0 var(--border-radius) var(--border-radius);
          }

          &.item-alternate {
            background-color: #f6f9fc;
            @media (max-width: 767px) {
              background-color: #fff;
            }
          }

          span {
            line-height: 1.313em;
            color: #525f7f;
            display: flex;
            align-items: center;
            justify-content: center;

            &.second {
              margin: 8px 0 0;
            }
            &.long-label {
              flex-direction: row;
              @media (max-width: 420px) {
                flex-direction: column;
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
  }
}
</style>
