<template>
  <div class="overflow-hidden relative bg-gray-900">
    <div class="relative border-b border-gray-800">
      <div class="relative z-10 mx-auto max-w-4xl py-16 px-4 lg:py-24">
        <div class="text-center">
          <h1 class="mt-4 text-4xl font-bold text-gray-300 md:text-6xl">
            Finders earn big.
          </h1>
          <p
            class="
              mt-3
              max-w-md
              mx-auto
              text-xl text-color-500
              sm:leading-8
              md:mt-5 md:max-w-4xl
            "
          >
            <span class="block">
              Do you know a great business that we should know about?</span
            >
            Introduce us and earn big when we close the deal. Join our network
            of 50+ global finders!
          </p>
          <router-link
            to="mailto:hello@fiction.com"
            class="
              mt-6
              inline-flex
              justify-center
              rounded-md
              transition-colors
              border border-gray-300
              text-gray-300
              hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900
            "
          >
            <ElemButton
              class="
                px-5
                py-3
                focus:ring-opacity-0
                sm:mt-0
                md:px-8 md:py-3 md:text-lg
              "
            >
              Send us a lead
              <ElemHoverArrow size="large" />
            </ElemButton>
          </router-link>
        </div>
      </div>
    </div>

    <!-- <router-link to="#">
      <ElemButton btn="primary" class="focus:ring-opacity-0 md:py-3 md:px-8 md:text-lg">
        Sign up free <ElemHoverArrow size="large" />
      </ElemButton>
    </router-link> -->

    <div
      class="
        mx-8
        max-w-4xl
        my-8
        py-10
        px-10
        rounded-md
        lg:mx-auto lg:px-20 lg:py-20
      "
    >
      <h2 class="mt-3 text-4xl leading-tight font-bold text-gray-300">
        1. Review Terms
      </h2>
      <p class="mt-6 text-color-500 text-xl leading-8">
        Please review our finders agreement to learn more about the finders
        process and how to earn big. We will send over the Agreement for signing
        during the onboarding process.
      </p>
      <router-link
        to="/"
        class="
          mt-6
          inline-flex
          justify-center
          rounded-md
          transition-colors
          border border-gray-300
          text-gray-300
          hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900
        "
      >
        <ElemButton
          class="
            focus:ring-opacity-0
            px-5
            py-3
            sm:mt-0
            md:px-8 md:py-3 md:text-lg
          "
        >
          Preview the agreement
          <ElemHoverArrow size="large" />
        </ElemButton>
      </router-link>
    </div>

    <div
      class="
        mx-8
        max-w-4xl
        my-8
        py-10
        px-10
        rounded-md
        lg:mx-auto lg:px-20 lg:py-20
      "
    >
      <h2 class="mt-3 text-4xl leading-tight font-bold text-gray-300">
        2. Get Started
      </h2>
      <p class="mt-6 text-color-500 text-xl leading-8">
        As a Fiction finder, please
        <a
          class="border-b border-dashed border-gray-400 hover:text-gray-300"
          href="mailto:hello@fiction.com"
          >send us an email</a
        >
        with the companies you have in mind. Prior to you reaching out we need
        to ensure we haven't already been in contact with the business.
      </p>
      <router-link
        to="mailto:hello@fiction.com"
        class="
          mt-6
          inline-flex
          justify-center
          rounded-md
          transition-colors
          border border-gray-300
          text-gray-300
          hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900
        "
      >
        <ElemButton
          class="
            px-5
            py-3
            focus:ring-opacity-0
            sm:mt-0
            md:px-8 md:py-3 md:text-lg
          "
        >
          Email us
          <ElemHoverArrow size="large" />
        </ElemButton>
      </router-link>
    </div>

    <div
      class="
        mx-8
        max-w-4xl
        my-8
        py-10
        px-10
        rounded-md
        lg:mx-auto lg:px-20 lg:py-20
      "
    >
      <h2 class="mt-3 text-4xl leading-tight font-bold text-gray-300">
        3. We’ll work the deal
      </h2>
      <p class="mt-6 text-color-500 text-xl leading-8">
        If it looks like a fit, we'll let you know so you can introduce us to
        the company’s leadership. We will dive into a conversation with them and
        do what we do best.
      </p>
    </div>

    <div
      class="
        mx-8
        max-w-4xl
        my-8
        py-10
        px-10
        rounded-md
        lg:mx-auto lg:px-20 lg:py-20
      "
    >
      <h2 class="mt-3 text-4xl leading-tight font-bold text-gray-300">
        4. Get paid
      </h2>
      <p class="mt-6 text-color-500 text-xl leading-8">
        If we close, once signatures are on paper we will be in touch and you'll
        receive a check from us in the mail.
      </p>
    </div>

    <!-- <ElemFindersForm id="fiction-finder-form" class="mt-28 relative z-10" /> -->

    <div
      class="
        absolute
        bottom-0
        left-0
        h-20
        w-full
        bg-gradient-to-b
        from-transparent
        to-gray-900
        z-40
      "
    />
  </div>
</template>

<script lang="ts">
import ElemButton from "@factor/ui/ElemButton.vue"

import ElemHoverArrow from "./ElemHoverArrow.vue"
//import ElemFindersForm from "./ElemFindersForm.vue"

export default {
  components: {
    ElemButton,
    ElemHoverArrow,
    //ElemFindersForm,
  },
  setup() {
    return {}
  },
  metaInfo(this: any) {
    return {
      title: "Fiction - Finders earn big.",
      description:
        "Do you know a great business that we should know about? Introduce us and earn big when we close the deal. Join our network of 50+ global finders!",
    }
  },
}
</script>
