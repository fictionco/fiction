<template>
  <div class="min-h-screen">
    <main class="overflow-hidden">
      <!-- Header -->
      <div class="bg-warm-gray-50">
        <div class="py-24 lg:py-32">
          <div
            class="relative z-10 max-w-7xl mx-auto pl-4 pr-8 sm:px-6 lg:px-8"
          >
            <h1
              class="
                text-4xl
                font-extrabold
                tracking-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              Contact
            </h1>
            <p class="mt-6 text-xl text-bluegray-500 max-w-3xl">
              Want to get a demo over Zoom or have a discussion with sales? Just
              fill out your information below and we'll be in touch.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact section -->
      <section class="relative bg-white" aria-labelledby="contactHeading">
        <div class="absolute w-full h-1/2 bg-warm-gray-50" aria-hidden="true" />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative shadow-xl rounded-lg overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-3">
              <!-- Contact information -->
              <div
                class="
                  relative
                  overflow-hidden
                  py-10
                  px-6
                  bg-primary-700
                  text-white
                  sm:px-10
                  xl:p-12
                "
              >
                <h3 class="text-lg font-medium">Contact information</h3>
                <p class="mt-6 text-base max-w-3xl text-primary-300">
                  There are a ton of ways to get in touch with us. Make sure to
                  connect with Darwin on Facebook and LinkedIn.
                </p>
                <dl class="mt-8 space-y-6">
                  <dt><span class="sr-only">Email</span></dt>
                  <dd class="flex text-base">
                    <!-- Heroicon name: outline/mail -->
                    <svg
                      class="flex-shrink-0 w-6 h-6 text-bluegray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a href="mailto:hello@darwin.so" class="ml-3"
                      >hello@darwin.so</a
                    >
                  </dd>
                </dl>
                <ul class="mt-8 flex space-x-12" role="list">
                  <li>
                    <a
                      class="text-white hover:opacity-70"
                      href="https://www.facebook.com/getdarwin/"
                    >
                      <span class="sr-only">Facebook</span>
                      <svg
                        class="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      class="text-white hover:opacity-70"
                      href="https://github.com/fiction-com"
                    >
                      <span class="sr-only">GitHub</span>
                      <svg
                        class="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Contact form -->
              <div
                class="
                  py-10
                  px-6
                  sm:px-10
                  lg:col-span-2
                  xl:p-12
                  border-t border-r border-b border-bluegray-200
                "
              >
                <ElemForm class="grid grid-cols-2 gap-6">
                  <div class="sm:col-span-2">
                    <ElemInput class="my-0" label="Full Name" input="text" />
                  </div>
                  <div>
                    <ElemInput class="my-0" label="Email" input="email" />
                  </div>
                  <div>
                    <ElemInput
                      class="my-0"
                      label="Phone (optional)"
                      input="phone"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <ElemInput class="my-0" label="Subject" input="text" />
                  </div>
                  <div class="sm:col-span-2">
                    <ElemInput
                      class="my-0"
                      label="Message"
                      description="Max. 500 characters"
                      input="textarea"
                    />
                  </div>
                  <div class="sm:col-span-2 sm:flex sm:justify-end">
                    <ElemButton btn="primary" type="submit" size="lg"
                      >Submit</ElemButton
                    >
                  </div>
                </ElemForm>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact grid -->
      <section aria-labelledby="officesHeading">
        <div class="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h2 id="officesHeading" class="text-3xl font-extrabold">
            Darwin offices
          </h2>
          <p class="mt-6 text-lg text-bluegray-500 max-w-3xl">
            Darwin is based in California. Let us know if you want to drop by.
          </p>
          <div
            class="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <h3 class="text-lg font-medium">Laguna Beach</h3>
              <p class="mt-2 text-base text-bluegray-500">
                <span class="block">4556 Brendan Ferry</span>

                <span class="block">Los Angeles, CA 90210</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import ElemButton from "@factor/ui/ElemButton.vue"
import ElemInput from "@factor/ui/ElemInput.vue"
import ElemForm from "@factor/ui/ElemForm.vue"
export default {
  components: {
    ElemButton,
    ElemInput,
    ElemForm,
  },
  setup() {
    const metaTitle = "Get in Touch - Darwin Analytics"

    const metaDescription =
      "Want to get a demo over Zoom or have a discussion with sales? Just ask, and we'll be in touch as soon as possible. Darwin is based in California. Let us know if you want to drop by."

    useMeta({
      title: metaTitle,
      meta: [
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: metaTitle,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          name: "twitter:title",
          content: metaTitle,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
      ],
    })

    return {}
  },
}
</script>
