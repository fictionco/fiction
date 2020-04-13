<template>
  <div class="common-StripeGrid">
    <!-- Background -->
    <div class="backgroundContainer">
      <div class="grid">
        <div class="background" />
      </div>
    </div>
    <!-- Stripes -->
    <div class="stripeContainer">
      <div class="grid">
        <div v-for="stripe in numStripes" :key="stripe.id" class="stripe" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    numStripes: {
      type: Number,
      required: false,
      default: 2,
    },
  },
})
</script>
<style lang="less">
.common-StripeGrid {
  --stripe-height: 48px;
  --content-columns: 12;
  --gutter-columns: 4;
  --content-column-width: minmax(0, calc(1040px / var(--content-columns)));
  --gutter-column-width: 1fr;

  @media (min-width: 670px) {
    --stripe-height: 64px;
  }

  @media (min-width: 1040px) {
    --gutter-column-width: var(--content-column-width);
  }

  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;

  .grid {
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
    transform: skewY(-4deg);
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
// Header Stripes
.header .common-StripeGrid {
  .background {
    background-color: #f6f9fc;
    grid-row-end: -4;
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
      background-color: var(--color-primary);
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
      background-color: var(--color-primary);
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
      background-color: var(--color-primary);
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
// Features Stripes
.features {
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
}
</style>
