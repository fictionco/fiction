<template>
  <main class="my-32">
    <!-- Pricing Section -->
    <section class="relative" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" class="sr-only">Pricing</h2>

      <!-- Tiers -->
      <div
        class="mx-auto max-w-2xl space-y-12 px-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:space-y-0 lg:px-8"
      >
        <div
          class="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-slate-900">Freelancer</h3>
            <p class="mt-4 flex items-baseline text-slate-900">
              <span class="text-5xl font-extrabold tracking-tight">$24</span>
              <span class="ml-1 text-xl font-semibold">/month</span>
            </p>
            <p class="mt-6 text-slate-500">
              The essentials to provide your best work for clients.
            </p>

            <!-- Feature list -->
            <ul role="list" class="mt-6 space-y-6">
              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">5 products</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Up to 1,000 subscribers</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Basic analytics</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500"
                  >48-hour support response time</span
                >
              </li>
            </ul>
          </div>

          <RouterLink
            :to="randomRoute()"
            class="mt-8 block w-full rounded-md border border-transparent bg-slate-50 py-3 px-6 text-center font-medium text-slate-700 hover:bg-slate-100"
            >Monthly billing</RouterLink
          >
        </div>

        <div
          class="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-slate-900">Startup</h3>

            <p
              class="absolute top-0 -translate-y-1/2 rounded-full bg-slate-500 py-1.5 px-4 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Most popular
            </p>
            <p class="mt-4 flex items-baseline text-slate-900">
              <span class="text-5xl font-extrabold tracking-tight">$32</span>
              <span class="ml-1 text-xl font-semibold">/month</span>
            </p>
            <p class="mt-6 text-slate-500">
              A plan that scales with your rapidly growing business.
            </p>

            <!-- Feature list -->
            <ul role="list" class="mt-6 space-y-6">
              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">25 products</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500"
                  >Up to 10,000 subscribers</span
                >
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Advanced analytics</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500"
                  >24-hour support response time</span
                >
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Marketing automations</span>
              </li>
            </ul>
          </div>

          <RouterLink
            :to="randomRoute()"
            class="mt-8 block w-full rounded-md border border-transparent bg-slate-500 py-3 px-6 text-center font-medium text-white hover:bg-slate-600"
            >Monthly billing</RouterLink
          >
        </div>

        <div
          class="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-slate-900">Enterprise</h3>
            <p class="mt-4 flex items-baseline text-slate-900">
              <span class="text-5xl font-extrabold tracking-tight">$48</span>
              <span class="ml-1 text-xl font-semibold">/month</span>
            </p>
            <p class="mt-6 text-slate-500">
              Dedicated support and infrastructure for your company.
            </p>

            <!-- Feature list -->
            <ul role="list" class="mt-6 space-y-6">
              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Unlimited products</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Unlimited subscribers</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Advanced analytics</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500"
                  >1-hour, dedicated support response time</span
                >
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Marketing automations</span>
              </li>

              <li class="flex">
                <!-- Heroicon name: outline/check -->
                <svg
                  class="h-6 w-6 shrink-0 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="ml-3 text-slate-500">Custom integrations</span>
              </li>
            </ul>
          </div>

          <RouterLink
            :to="randomRoute()"
            class="mt-8 block w-full rounded-md border border-transparent bg-slate-50 py-3 px-6 text-center font-medium text-slate-700 hover:bg-slate-100"
            >Monthly billing</RouterLink
          >
        </div>
      </div>
    </section>

    <!-- Logo Cloud -->
    <section
      aria-labelledby="customer-heading"
      class="mx-auto max-w-2xl py-24 px-4 sm:px-6 lg:max-w-7xl lg:py-32 lg:px-8"
    >
      <h2 id="customer-heading" class="sr-only">Our customers</h2>
      <div class="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        <div class="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img
            class="h-12"
            src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
            alt="Tuple"
          />
        </div>
        <div class="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img
            class="h-12"
            src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
            alt="Mirage"
          />
        </div>
        <div class="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img
            class="h-12"
            src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
            alt="StaticKit"
          />
        </div>
        <div class="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
          <img
            class="h-12"
            src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
            alt="Transistor"
          />
        </div>
        <div class="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
          <img
            class="h-12"
            src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
            alt="Workcation"
          />
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <div class="relative">
      <!-- Decorative background -->
      <div
        aria-hidden="true"
        class="absolute inset-x-0 h-1/2 bg-gradient-to-b from-white to-slate-50"
      ></div>

      <div class="relative mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div
          class="relative overflow-hidden rounded-xl bg-slate-500 py-24 px-8 shadow-2xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-16"
        >
          <div
            class="absolute inset-0 opacity-50 mix-blend-multiply saturate-0"
          >
            <img
              src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
              alt=""
              class="h-full w-full object-cover"
            />
          </div>
          <div class="relative lg:col-span-1">
            <img
              class="h-12 w-auto"
              src="https://tailwindui.com/img/logos/workcation-logo-white.svg"
              alt=""
            />
            <blockquote class="mt-6 text-white">
              <p class="text-xl font-medium sm:text-2xl">
                Workflow has completely transformed how we interact with
                customers. We've seen record bookings, higher customer
                satisfaction, and reduced churn.
              </p>
              <footer class="mt-6">
                <p class="flex flex-col font-medium">
                  <span>Marie Chilvers</span>
                  <span>CEO, Workcation</span>
                </p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <section
      aria-labelledby="faq-heading"
      class="mx-auto max-w-2xl divide-y divide-slate-200 py-24 px-4 sm:px-6 lg:max-w-7xl lg:py-32 lg:px-8"
    >
      <h2 id="faq-heading" class="text-3xl font-extrabold text-slate-900">
        Frequently asked questions
      </h2>
      <div class="mt-8">
        <dl class="divide-y divide-slate-200">
          <div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
            <dt class="text-base font-medium text-slate-900 md:col-span-5">
              What&#039;s the best thing about Switzerland?
            </dt>
            <dd class="mt-2 md:col-span-7 md:mt-0">
              <p class="text-base text-slate-500">
                I don&#039;t know, but the flag is a big plus. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Quas cupiditate
                laboriosam fugiat.
              </p>
            </dd>
          </div>

          <!-- More questions... -->
          <!-- More items... -->
        </dl>
      </div>
    </section>
  </main>
</template>
<script lang="ts" setup>
import { RouterLink } from "vue-router"
import { randomRoute } from "../utils"
</script>
