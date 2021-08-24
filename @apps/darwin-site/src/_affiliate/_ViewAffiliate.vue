<template>
  <div class="overflow-x-hidden">
    <div class="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-40">
        <div
          class="
            mx-auto
            max-w-md
            px-4
            sm:max-w-3xl sm:px-6
            lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24
          "
        >
          <div class="sm:max-w-xl mx-auto">
            <div>
              <h1
                class="
                  text-3xl
                  md:text-6xl
                  font-extrabold
                  tracking-tight
                  lg:text-6xl
                "
              >
                Darwin Affiliate Program
              </h1>
              <div class="mt-6 text-bluegray-500 text-xl md:text-2xl">
                As a Darwin affiliate you help others experience high-resolution
                analytics and earn a recurring 30% commission for every marketer
                you send our way.
              </div>
            </div>
            <div class="my-10 flex justify-start space-x-4">
              <ElemButton href="#" btn="primary" size="lg"
                >Join The Darwin Affiliate Program &rarr;
              </ElemButton>
            </div>

            <div class="mt-6">
              <ProofStars />
            </div>
          </div>
        </div>

        <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div
            class="
              py-12
              sm:relative sm:mt-12 sm:py-16
              lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2
            "
          >
            <div
              class="
                relative
                pl-4
                -mr-40
                sm:mx-auto sm:max-w-3xl sm:px-0
                lg:max-w-none lg:h-full lg:pl-12
              "
            >
              <img
                class="
                  w-full
                  rounded-md
                  shadow-xl
                  ring-1 ring-black ring-opacity-5
                  lg:h-full lg:w-auto lg:max-w-none
                "
                :src="affiliate"
                alt="Affiliate Graph"
              />
            </div>
            <!-- <span class="block mt-7 text-center text-sm text-bluegray-400">
              Watch the Darwin affiliate video.
            </span> -->
          </div>
        </div>
      </div>
    </div>

    <ElemIntegrations
      class="mx-auto max-w-6xl pb-20 px-4 md:pb-36 md:px-20 lg:px-12"
      title="Trusted by"
    />

    <section class="mx-auto max-w-7xl px-4 md:px-20 lg:px-8 text-center">
      <h1
        class="
          text-3xl
          sm:text-4xl
          lg:text-6xl
          xl:text-7xl
          font-extrabold
          m-auto
        "
      >
        How It Works
      </h1>
    </section>

    <section
      class="
        py-10
        px-8
        mx-auto
        max-w-7xl
        lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center
      "
    >
      <div
        class="
          px-4
          max-w-xl
          mx-auto
          sm:px-6
          lg:py-16 lg:max-w-none lg:mx-0 lg:px-0
        "
      >
        <div
          class="
            flex-none flex
            justify-center
            items-center
            rounded-full
            w-12
            h-12
            mb-6
            border-2 border-primary-500
            text-primary-500
          "
        >
          <div class="text-xl font-bold">1</div>
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Sign Up
        </h2>
        <div class="text-lg text-bluegray-500 lg:text-xl">
          <p class="mt-4">
            Anyone can join the Darwin affiliate program. You don’t even need to
            be a Darwin customer to promote Darwin. But to be a successful
            affiliate, you must:
          </p>
          <ul class="mt-4 space-y-4 list-inside list-decimal">
            <li>
              Understand the importance of conversion optimization and believe
              in the power of Darwin.
            </li>
            <li>
              Have an audience who needs a powerful, yet simple conversion
              analytics tool to help them increase revenue.
            </li>
          </ul>
          <!-- <p class="text-sm mt-4">
            P.S. This scale only shows commissions for referrals on our lowest
            monthly plan. You can earn MUCH more if your referrals have larger
            email lists.
          </p> -->
        </div>
      </div>
      <div class="mt-12 sm:mt-16 lg:mt-0">
        <div
          class="
            shadow-lg
            ring-1 ring-black ring-opacity-10
            rounded-md
            px-4
            py-12
            mx-auto
            max-w-lg
            md:px-20
            lg:px-12
          "
        >
          <blockquote>
            <div
              class="
                max-w-3xl
                mx-auto
                text-center text-xl
                leading-8
                italic
                text-bluegray-500
                py-6
              "
            >
              &ldquo;I love the Darwin affiliate program! It provides me with
              recurring commission that keeps growing!&rdquo;
            </div>
            <footer class="mt-8">
              <div class="md:flex md:items-center md:justify-center">
                <div
                  class="
                    mt-3
                    text-center
                    md:mt-0 md:ml-4 md:flex md:items-center
                  "
                >
                  <div class="text-sm">–Scott Valdez, Vida Select</div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <section
      class="
        mx-auto
        max-w-7xl
        px-8
        py-10
        lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center
      "
    >
      <div
        class="
          px-4
          max-w-xl
          mx-auto
          sm:px-6
          lg:py-16 lg:max-w-none lg:mx-0 lg:px-0
        "
      >
        <div
          class="
            flex-none flex
            justify-center
            items-center
            rounded-full
            w-12
            h-12
            mb-6
            border-2 border-primary-500
            text-primary-500
          "
        >
          <div class="text-xl font-bold">2</div>
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Share With Your Audience
        </h2>
        <div class="text-lg text-bluegray-500 lg:text-xl">
          <p class="mt-4">
            To earn recurring commission, all you need to do is start sharing
            the custom link we send you in all the right places. But we want you
            to be a really successful affiliate. That’s why we also provide you
            helpful resources including:
          </p>
          <ul class="mt-4 space-y-4 list-inside list-decimal">
            <li>Graphic assets to create your content.</li>
            <li>A dashboard to track your progress.</li>
          </ul>
        </div>
      </div>
      <div class="mt-12 sm:mt-16 lg:mt-0">
        <div
          class="
            shadow-lg
            ring-1 ring-black ring-opacity-10
            rounded-md
            px-4
            py-12
            mx-auto
            max-w-lg
            md:px-20
            lg:px-12
          "
        >
          <img class="w-full" :src="affiliateShare" alt="Affiliate Share" />
        </div>
      </div>
    </section>

    <section
      class="
        py-12
        px-8
        mx-auto
        max-w-7xl
        lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center
      "
    >
      <div
        class="
          px-4
          max-w-xl
          mx-auto
          sm:px-6
          lg:py-16 lg:max-w-none lg:mx-0 lg:px-0
        "
      >
        <div
          class="
            flex-none flex
            justify-center
            items-center
            rounded-full
            w-12
            h-12
            mb-6
            border-2 border-primary-500
            text-primary-500
          "
        >
          <div class="text-xl font-bold">3</div>
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Start Earning
        </h2>
        <div class="text-lg text-bluegray-500 lg:text-xl">
          <p class="mt-4">
            We send you a 30% commission for every person who signs up to Darwin
            through your affiliate link. But it’s not just that one payment when
            they sign up. That 30% is going to hit your bank account every month
            for as long as their Darwin account is active.
          </p>
        </div>
      </div>
      <div class="mt-12 sm:mt-16 lg:mt-0">
        <div
          class="
            shadow-lg
            ring-1 ring-black ring-opacity-10
            rounded-md
            px-4
            py-12
            mx-auto
            max-w-lg
            md:px-20
            lg:px-12
          "
        >
          <div class="flex flex-col items-start mb-4">
            <div class="uppercase text-primary-500 font-medium mb-6">
              Estimate Your Monthly Earnings
            </div>
            <div>
              <div
                class="inline font-extrabold text-3xl lg:text-5xl"
                v-html="referralAccounts[volumeTier].price"
              />
              <div class="inline text-2xl">/mo</div>
            </div>

            <div class="text-bluegray-500 py-6">
              Monthly commission for referring
              <strong
                >{{ referralAccounts[volumeTier].accounts }} accounts</strong
              >
              for up to 10,000 sessions
            </div>

            <input
              v-model="volumeTier"
              type="range"
              name="volume"
              min="0"
              :max="referralAccounts.length - 1"
              class="w-full h-2 mt-4 mb-8 outline-none bg-purple-100"
            />
            <img
              :src="bothWaysArrow"
              alt="both ways arrow"
              class="self-center mb-2.5"
            />
            <div class="text-sm text-xlight-500 self-center">
              Adjust your monthly commission
            </div>
          </div>
        </div>
      </div>
    </section>

    <ElemCta />
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue"
import ProofStars from "../el/ProofStars.vue"
import ElemIntegrations from "./ElemIntegrations.vue"
import ElemButton from "../el/ElemButton.vue"
import ElemCta from "./ElemCta.vue"

//Images
import bothWaysArrow from "../img/both-ways-arrow.svg"
import affiliate from "./affiliate.webp"
import affiliateShare from "./affiliateShare.webp"
import { getDashboardUrl } from "../util"

export default {
  components: {
    ProofStars,
    ElemIntegrations,
    ElemButton,
    ElemCta,
  },
  setup() {
    const volumeTier = ref(0)

    const referralAccounts = computed(() => {
      const base = [
        {
          referrals: 1,
        },
        {
          referrals: 2,
        },
        {
          referrals: 3,
        },
        {
          referrals: 4,
        },
        {
          referrals: 5,
        },
        {
          referrals: 10,
        },
        {
          referrals: 20,
        },
        {
          referrals: 30,
        },
        {
          referrals: 40,
        },
        {
          referrals: 50,
        },
        {
          referrals: 100,
        },
        {
          referrals: 150,
        },
        {
          referrals: 200,
        },
      ]

      return base.map((_) => {
        const price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(_.referrals * 23.7)

        let accounts = Intl.NumberFormat("en-US").format(+_.referrals)

        return {
          accounts,
          price,
        }
      })
    })

    return {
      getDashboardUrl,
      affiliate,
      affiliateShare,
      bothWaysArrow,
      volumeTier,
      referralAccounts,
    }
  },
}
</script>

<style lang="less">
input[type="range"] {
  @apply rounded-sm;
  -moz-appearance: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    -webkit-appearance: none;
    border: 8px solid #8660fe;
  }
  &::-moz-range-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-ms-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-moz-focus-outer {
    border: 0;
  }
}
</style>
