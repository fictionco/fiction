<template>
  <div class="">
    <main>
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
              How can we help you?
            </h1>
            <p class="mt-6 text-xl text-bluegray-500 max-w-2xl">
              Get in touch with the sales team, receive answers to technical
              questions via support, or join the community chat.
            </p>
          </div>
        </div>
      </div>
      <div class="">
        <!-- Cards -->
        <section
          class="
            max-w-md
            mx-auto
            relative
            z-10
            px-4
            sm:max-w-3xl sm:px-6
            lg:max-w-7xl lg:px-8
          "
          aria-labelledby="contact-heading"
        >
          <h2 class="sr-only" id="contact-heading">Contact us</h2>
          <div
            class="
              grid grid-cols-1
              gap-y-20
              lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8
            "
          >
            <div
              class="
                flex flex-col
                bg-white
                rounded-2xl
                shadow-xl
                border border-bluegray-200
              "
              v-for="(channel, i) in channels"
              :key="i"
            >
              <div class="flex-1 relative p-6">
                <div class="w-10 h-10 text-primary-500" v-html="channel.icon" />
                <h3 class="mt-4 text-xl font-bold">{{ channel.title }}</h3>
                <p class="mt-4 text-base text-bluegray-500">
                  {{ channel.description }}
                </p>
              </div>
              <div class="mt-6 text-left p-6 border-t border-bluegray-200">
                <ElemButton
                  btn="primary"
                  :target="channel.button.href ? '_blank' : ''"
                  :href="channel.button.href"
                  :to="channel.button.to"
                  >{{ channel.button.text }}</ElemButton
                >
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section
          class="
            max-w-md
            mx-auto
            py-24
            px-4
            divide-y-2 divide-bluegray-200
            sm:max-w-3xl sm:px-6
            lg:max-w-7xl lg:py-32 lg:px-8
          "
          aria-labelledby="faq-heading"
        >
          <h2 class="text-3xl font-extrabold" id="faq-heading">
            Frequently answered questions
          </h2>
          <div class="mt-6 pt-10">
            <dl
              class="
                space-y-10
                md:space-y-0
                md:grid
                md:grid-cols-2
                md:grid-rows-2
                md:gap-x-8
                md:gap-y-12
              "
            >
              <div v-for="(faq, i) in faqs" :key="i">
                <dt class="text-xl font-medium">
                  {{ faq.title }}
                </dt>
                <dd class="mt-2 text-base text-bluegray-500">
                  {{ faq.description }}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { useMeta } from "@factor/api"
import ElemButton from "../el/ElemButton.vue"
import { ref } from "vue"
export default {
  components: {
    ElemButton,
  },
  setup() {
    const metaTitle = "Support, Sales, and Community Chat - Darwin Analytics"

    const metaDescription =
      "Get in touch with the sales team, receive answers to technical questions via support, or join the community chat."

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

    const faqs = ref([
      {
        title: "How do I use/install Darwin?",
        description:
          "Darwin is installed on your website just like Google Analytics or any other tracking script. Just add a small piece of code to your site via Google Tag Manager or html.",
      },
      {
        title: "Does Darwin work with [type of website]?",
        description:
          "Yes! Darwin works with any website that allow you to add your own scripts or HTML.",
      },
      {
        title: "How is Darwin different?",
        description:
          "Darwin's primary difference is in resolution. It tracks 93% more information that services like Google Analytics. It also records sessions, has heatmaps and ab testing.",
      },
      {
        title: "Is Darwin free?",
        description:
          "Yes, Darwin offers a free analytics suite as well as an upgraded professional suite. The free plan includes many useful features including analytics, replays, heatmaps, and more.",
      },

      {
        title: "Does Darwin play well with user privacy?",
        description:
          "From the beginning, Darwin has been aware and compliant with current, new and upcoming laws regarding user privacy. It is fully compliant with GDPL and other statutes. To enable all features, like ab testing, personal identifiers are needed; however, which may require 'cookie consent' in some locations.",
      },
      {
        title: "What exactly is Darwin?",
        description:
          "Darwin is an analytics tool focused on digital experience optimization. Technically, it is a tracking code that you install on your site. It then tracks public information about visitors to your site, as well as bots. From there, we provide you a nice UI that helps you understand their behavior and optimize your site.",
      },
      {
        title: "Can I get my money back after I pay for the Pro solution?",
        description:
          "Yes, Darwin offers a 14 day no-questions-asked satisfaction guarantee.",
      },
    ])
    const channels = ref([
      {
        title: "Contact Us",
        description:
          "Have a question before you upgrade? Need something specific that's not discussed on the site? This is the place to go.",
        path: "/contact",
        icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>`,
        button: {
          text: "Message Us on WhatsApp",
          href: "https://wa.me/message/OIB3KTHVFVHSA1",
        },
      },
      {
        title: "Technical Support",
        description:
          "Have a technical question that needs answering, great. We're here to help.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>`,
        button: {
          text: "Message Us on WhatsApp",
          href: "https://wa.me/message/OIB3KTHVFVHSA1",
        },
      },
      {
        title: "Community Channels",
        description:
          "Join the community chat channels to discuss and get help from us as well as members of the Darwin community.",
        button: {
          text: "Join Slack Channel",
          href: "https://join.slack.com/t/darwin-analytics/shared_invite/zt-rrr512dj-xh_wEGr7cAqOy4nXxT7aRA",
        },

        icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
</svg>`,
      },
    ])
    return { faqs, channels }
  },
}
</script>
