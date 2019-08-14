<template>
  <section class="benefits">
    <div class="mast">
      <div class="benefit">
        <figure class="benefit-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48px"
            height="48px"
            viewBox="0 0 48 48"
          >
            <g fill="none" fill-rule="evenodd">
              <path
                fill="#87BBFD"
                fill-rule="nonzero"
                d="M46 33.44v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98zm0-10v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98zm0-10v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98z"
              />
              <path
                fill="#555ABF"
                fill-rule="nonzero"
                d="M46 3.44v3.09a1 1 0 0 1-.8.97l-42 8.93a1 1 0 0 1-1.2-.98v-3.09a1 1 0 0 1 .8-.97l42-8.93a1 1 0 0 1 1.2.98z"
              />
            </g>
          </svg>
        </figure>

        <h3 class="common-body-title benefit-title">Unify your payments stack</h3>

        <p class="common-bodytext">
          Manage all your online and offline sales in one place with a single Stripe
          integration, simplifying reporting and reconciliation. Terminal works seamlessly
          with Stripe
          <a href="/payments" class="common-link">Payments</a>,
          <a href="/connect" class="common-link">Connect</a>, and
          <a href="/billing" class="common-link">Billing</a>.
        </p>
      </div>
      <div class="benefit">
        <figure class="benefit-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48px"
            height="48px"
            viewBox="0 0 48 48"
          >
            <g fill="none" fill-rule="evenodd">
              <path
                fill="#555ABF"
                fill-rule="nonzero"
                d="M4 42a4 4 0 0 1-4-4h4V10a4 4 0 0 1 4-4h13v36H4z"
              />
              <path
                fill="#87BBFD"
                fill-rule="nonzero"
                d="M8 10h13v28H8V10zm20-8h16a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm-2 6v32h20V8H26z"
              />
            </g>
          </svg>
        </figure>

        <h3 class="common-body-title benefit-title">Own your in-store experience</h3>

        <p class="common-bodytext">
          Provide a seamless customer experience across channels, like reserving online
          and picking up in store. Our SDKs make it easy to integrate Stripe into your own
          mobile and web applications to accept in-store payments.
        </p>
      </div>
      <div class="benefit">
        <figure class="benefit-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48px"
            height="48px"
            viewBox="0 0 48 48"
          >
            <g fill="none" fill-rule="evenodd">
              <path
                fill="#555ABF"
                fill-rule="nonzero"
                d="M26.97 7H42a6 6 0 0 1 5.92 5H25.9l1.07-5zm-7.23 34l5.1-24H48v18a6 6 0 0 1-6 6H19.74zM35.4 28l-3.89 3.89A1.5 1.5 0 0 0 33.63 34l4.95-4.95a1.5 1.5 0 0 0 0-2.12l-4.95-4.95a1.5 1.5 0 1 0-2.12 2.12L35.4 28z"
              />
              <path
                fill="#87BBFD"
                fill-rule="nonzero"
                d="M27.61 7l-1.06 5H.08A6 6 0 0 1 6 7h21.61zM20.4 41H6a6 6 0 0 1-6-6V17h25.49l-5.1 24zm-7.65-13l3.9-3.89A1.5 1.5 0 0 0 14.5 22l-4.95 4.95a1.5 1.5 0 0 0 0 2.12l4.95 4.95a1.5 1.5 0 1 0 2.12-2.12L12.74 28z"
              />
            </g>
          </svg>
        </figure>

        <h3 class="common-body-title benefit-title">Grow your platform’s revenue</h3>

        <p class="common-bodytext">
          Add in-person payments to your platform or marketplace. Using Stripe Terminal
          with
          <a href="/connect" class="common-link">Connect</a>, you can onboard users for
          online and in-person payments, and unify their payouts across channels.
        </p>
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
// Benefits
.benefits {
  position: relative;
  .mast {
    display: grid;
    grid-template-rows: repeat(3, auto);
    grid-gap: 26px 0;
    @media (min-width: 670px) {
      grid-gap: 0 26px;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(1, 1fr);
    }
  }
  .benefit {
    margin: 0 auto;
    @media (min-width: 670px) {
      margin: 0;
    }
    .benefit-icon {
      display: grid;
      align-items: end;
      min-height: 48px;
      margin: 0 0 16px;
    }
  }
}
</style>
