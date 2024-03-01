<template>
  <div class="max-w-7xl mx-auto px-8 xl:mb-20">
    <div class="rounded-lg bg-gray-100">
      <div class="max-w-4xl mx-auto text-center p-10 lg:p-12">
        <h2
          class="text-3xl font-bold text-gray-900 sm:text-4xl sm:leading-tight"
        >
          Join our finders network
        </h2>
        <p
          class="mt-3 text-gray-500 sm:text-lg md:mt-5 md:text-xl md:leading-relaxed"
        >
          We want to learn a little about you and get a countersigned finders
          agreement on file. We will then review and get back to you within 2
          business days.
        </p>
        <div
          class="mt-8 p-12 text-left border-4 border-dashed border-gray-700 rounded-lg"
        >
          <p class="text-xl font-bold">Finder form placeholder</p>
          <ul>
            <li>Full name:</li>
            <li>Phone:</li>
            <li>Full address:</li>
            <li>Email address:</li>
            <li>
              When speaking to business owners/founders and/or their advisors as
              part of the Fiction Finders Program, I will not represent that I
              am an employee, associate, or representative of Fiction. I
              acknowledge that I do not have the legal authority to bind Fiction
              or its affiliates to contractual agreements of any kind, and will
              not represent to anyone that I have such authority.
            </li>
            <li>
              <router-link
                to="/"
                class="mt-6 inline-flex justify-center rounded-md transition-colors border border-gray-900 text-gray-900 hover:border-black hover:bg-gray-900 hover:text-gray-100"
              >
                <ElemButton
                  class="px-5 py-3 sm:mt-0 focus:ring-opacity-0 md:px-8 md:py-3 md:text-lg"
                >
                  Submit your finders application
                  <ElemHoverArrow size="large" />
                </ElemButton>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ElemButton from "@factor/ui/ElemButton.vue"

import ElemHoverArrow from "./ElemHoverArrow.vue"

export default {
  components: {
    ElemButton,
    ElemHoverArrow,
  },
}
</script>
