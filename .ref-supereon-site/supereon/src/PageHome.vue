<script setup lang="ts">
import { unhead } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElLogo from './ElLogo.vue'
import FigurePoweredBy from './FigurePoweredBy.vue'
import FigurePlugins from './FigurePlugins.vue'
import ShootingStar from './ShootingStar.vue'
import PageWrap from './PageWrap.vue'
import ElNav from './ElNav.vue'

unhead.useHead({
  title: 'Applied AI Development - Supereon',
  meta: [
    {
      name: `description`,
      content: `Supereon helps businesses large and small add AI to their products and services`,
    },
  ],
})
</script>

<template>
  <PageWrap :hide-header="true">
    <div class="">
      <!-- Hero card -->
      <div class="relative grid h-[85vh] grid-cols-1 md:grid-cols-2">
        <div
          class="from-theme-950 to-theme-1000 relative hidden overflow-hidden bg-gradient-to-br p-6 md:block lg:p-8"
        >
          <div class="relative z-30 text-white">
            <ElLogo class="w-36" />
          </div>
          <ShootingStar class="absolute inset-0" />
          <div class="bg-gray/70 absolute inset-0 z-20 bg-blend-multiply" />
        </div>
        <div class="border-theme-900 mx-auto max-w-7xl border-b-4 p-6 lg:p-8">
          <div class="mb-8 flex justify-between">
            <div class="md:hidden">
              <ElLogo class="w-36" />
            </div>
            <ElNav class="justify-center" />
          </div>
          <div class="flex h-full grow flex-col justify-center">
            <div class="mx-auto my-8 min-w-0 max-w-xl">
              <h1
                class="font-cal text-3xl font-bold leading-tight tracking-tight md:text-5xl"
              >
                We design, build, and support AI in your business.
              </h1>
              <div class="font-cal my-6 text-lg md:text-3xl">
                <span
                  class="from-theme-500 to-theme-400 bg-gradient-to-br bg-clip-text py-1 text-transparent"
                >
                  With simple monthly pricing.
                </span>
              </div>
              <div
                class="text-theme-700 border-theme-900 mt-4 text-lg font-medium md:text-2xl"
              >
                Get started fast with deep learning and AI. Work with experts
                that identify, develop and support your AI opportunities.
              </div>
              <div
                class="mt-8 flex flex-col space-y-4 sm:flex-row md:space-x-6 md:space-y-0"
              >
                <ElButton
                  href="/contact"
                  btn="primary"
                  size="xl"
                >
                  Schedule A Call &rarr;
                </ElButton>
                <ElButton
                  href="/pricing"
                  btn="default"
                  size="xl"
                >
                  See Pricing
                </ElButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8 py-32">
      <div class="mx-auto max-w-screen-xl">
        <div class="text-theme-400 text-sm font-bold uppercase tracking-wide">
          Leaders In Applied AI
        </div>
        <div class="font-cal flex flex-wrap justify-between py-6 text-3xl">
          <div class="p-6">
            Precision
          </div>
          <div class="whitespace-nowrap p-6">
            Competitive-edge
          </div>
          <div class="p-6">
            Personalization
          </div>
          <div class="p-6">
            Automation
          </div>
          <div class="whitespace-nowrap p-6">
            Scalability
          </div>
          <div class="p-6">
            Forecasting
          </div>
          <div class="whitespace-nowrap p-6">
            Cost-savings
          </div>
          <div class="whitespace-nowrap p-6">
            Decision-making
          </div>
          <div class="whitespace-nowrap p-6">
            Risk-reduction
          </div>
          <div class="whitespace-nowrap p-6">
            Customer-insights
          </div>
        </div>
      </div>
    </div>
    <div
      class="from-theme-950 to-theme-1000 text-theme-0 bg-gradient-to-br p-8 py-32"
    >
      <div id="solutions" class="mx-auto max-w-screen-xl">
        <div class="text-theme-500 text-base font-bold uppercase tracking-wide">
          The Supereon Process
        </div>
        <div class="my-12 grid grid-cols-1 gap-16 md:grid-cols-3">
          <div>
            <div class="font-cal mb-8 text-3xl md:text-6xl">
              1. Plan
            </div>
            <div class="space-y-4 text-lg md:text-3xl">
              <p>
                We start by identifying areas where AI could benefit your
                business.
              </p>
              <p>
                We then consider approaches and create a plan to implement it
                across your infrastructure.
              </p>
            </div>
          </div>
          <div>
            <div class="font-cal mb-8 text-3xl md:text-6xl">
              2. Build
            </div>
            <div class="space-y-4 text-lg md:text-3xl">
              <p>
                We first help you format and organize your data and tech to work
                well with AI.
              </p>
              <p>
                Then we get to work coding, training, and scaling to make it all
                a reality.
              </p>
            </div>
          </div>
          <div>
            <div class="font-cal mb-8 text-3xl md:text-6xl">
              3. Manage
            </div>
            <div class="space-y-4 text-lg md:text-3xl">
              <p>
                As your implementation evolves, we help you update technology
                and improve over time.
              </p>
              <p>
                In production, you get dedicated 24/7 support, and new features
                on request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8 py-32">
      <div class="mx-auto grid max-w-screen-xl grid-cols-12 gap-16">
        <div class="col-span-6">
          <div class="mt-20 flex flex-col justify-center">
            <div
              class="text-theme-500 mb-6 text-sm font-bold uppercase tracking-wide"
            >
              APPLIED-AI-AS-A-SERVICE
            </div>
            <div class="font-cal mb-8 text-3xl leading-tight md:text-5xl">
              Your first and last AI developer!
            </div>
            <div
              class="text-theme-500 space-y-3 text-lg font-medium leading-relaxed md:text-2xl"
            >
              <p>
                By leveraging Supereon's experience, we'll help you save time,
                reduce mistakes, and focus on what's important...
              </p>
              <p>
                We'll help you identify areas to apply AI and then help you with
                its implementation. With Supereon, you'll get the results and
                ROI you're looking for.
              </p>
            </div>
          </div>
        </div>
        <div class="col-span-6">
          <FigurePoweredBy />
        </div>
      </div>
    </div>
    <div
      class="from-theme-0 to-theme-0 border-theme-100 border-y-4 border-dashed bg-gradient-to-b p-8 py-48"
    >
      <div class="mx-auto grid max-w-screen-xl grid-cols-12 gap-16">
        <div class="relative col-span-5">
          <FigurePlugins />
        </div>
        <div class="col-span-7">
          <div class="flex flex-col justify-center rounded-lg bg-white p-10">
            <div
              class="text-theme-500 mb-6 text-sm font-bold uppercase tracking-wide"
            >
              Custom, Open-Source, or API
            </div>
            <div class="font-cal mb-8 text-5xl leading-tight">
              Your Powerful New Competitive Advantage
            </div>
            <div
              class="text-theme-500 space-y-3 text-2xl font-medium leading-relaxed"
            >
              <p>
                Instantly add experience with a variety of AI tools and
                technology to your team.
              </p>
              <p>
                We'll analyze the AI opportunities in your business and
                strategically implement the best option before your competition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gradient-to-br p-8 py-24">
      <div class="mx-auto max-w-screen-lg">
        <div
          class="text-theme-500 text-center text-sm font-bold uppercase tracking-wide"
        >
          Projects and Testimonials
        </div>
        <div
          class="font-cal mx-auto my-8 max-w-2xl text-center text-3xl leading-tight md:text-6xl"
        >
          Join Ecstatic Customers with

          <span
            class="from-theme-900 to-theme-300 bg-gradient-to-br bg-clip-text py-1 text-transparent"
          >
            Incredible
          </span>
          Results
        </div>
        <div class="my-20 grid grid-cols-1 gap-20 md:grid-cols-2">
          <div class="flex space-x-4">
            <div class="text-theme-900">
              <span
                class="i-carbon-quotes -ml-8 inline-block shrink-0 text-4xl"
              />
            </div>
            <div>
              <div class="text-lg font-bold md:text-2xl">
                @supereonai helped us find tons of ways to use our analytics
                data to execute AI. They are absolutely fantastic!"
              </div>
              <div class="mt-4 flex items-center space-x-4">
                <div
                  class="text-theme-0 from-theme-500 to-theme-950 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gradient-to-br text-center"
                >
                  <div class="i-carbon-chat-bot text-3xl" />
                </div>
                <div>
                  <div class="font-bold">
                    John Haylen
                  </div>
                  <div class="text-theme-400 text-xs">
                    CTO @ GrowBot (SaaS)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex space-x-4">
            <div class="text-theme-900">
              <span
                class="i-carbon-quotes -ml-8 inline-block shrink-0 text-4xl"
              />
            </div>
            <div>
              <div class="text-lg font-bold md:text-2xl">
                "Supereon helped in big and small ways. We launched AI in our
                product about 500% faster than we would have otherwise."
              </div>
              <div class="mt-4 flex items-center space-x-4">
                <div
                  class="text-theme-0 from-theme-500 to-theme-950 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gradient-to-br text-center"
                >
                  <div class="i-carbon-bee text-3xl" />
                </div>
                <div>
                  <div class="font-bold">
                    Emmy Zhao
                  </div>
                  <div class="text-theme-400 text-xs">
                    Marketing @ Bonbas (eCommerce)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrap>
</template>
