<script lang="ts" setup>
import { useMeta } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import { ref } from 'vue'

const metaTitle = 'Support, Sales, and Community Chat - Kaption Analytics'

const metaDescription
  = 'Get in touch with the sales team, receive answers to technical questions via support, or join the community chat.'

useMeta({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ],
})

interface PageItem {
  title: string
  description: string
  path?: string
  icon?: string
  button?: { text: string, href?: string, to?: string }
}

const faqs = ref<PageItem[]>([
  {
    title: 'How do I use/install Kaption?',
    description:
      'Kaption is installed on your website just like Google Analytics or any other tracking script. Just add a small piece of code to your site via Google Tag Manager or html.',
  },
  {
    title: 'Does Kaption work with [type of website]?',
    description:
      'Yes! Kaption works with any website that allow you to add your own scripts or HTML.',
  },
  {
    title: 'Is Kaption free?',
    description:
      'Yes, Kaption offers a free analytics suite as well as an upgraded professional suite. The free plan includes many useful features including analytics, replays, heatmaps, and more.',
  },

  {
    title: 'Does Kaption play well with user privacy?',
    description:
      'From the beginning, Kaption has been aware and compliant with current, new and upcoming laws regarding user privacy. It is fully compliant with GDPL and other statutes. To enable all features, like ab testing, personal identifiers are needed; however, which may require \'cookie consent\' in some locations.',
  },
  {
    title: 'What exactly is Kaption?',
    description:
      'Kaption is a feedback and analytics tool focused on customer experience optimization. You can create surveys, forms, etc and then track analytics data to understand your CX better.',
  },
  {
    title: 'Can I get my money back after I pay for the Pro solution?',
    description:
      'Yes, Kaption offers a 14 day no-questions-asked satisfaction guarantee.',
  },
])
const channels = ref<PageItem[]>([
  {
    title: 'Contact Us',
    description:
      'Have a question before you upgrade? Need something specific that\'s not discussed on the site? Just email us.',
    path: '/contact',
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>`,
    button: {
      text: 'Email Kaption',
      href: 'mailto:support@kaption.co',
    },
  },
  {
    title: 'Technical Support',
    description:
      'Have a technical question that needs answering, great. We\'re here to help.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>`,
    button: {
      text: 'Message Us on WhatsApp',
      href: 'https://wa.me/message/JBDCYHNGGJBGB1',
    },
  },
  //   {
  //     title: "Community Channels",
  //     description:
  //       "Join the community chat channels to discuss and get help from us as well as members of the Kaption community.",
  //     button: {
  //       text: "Join Slack Channel",
  //       href: "#",
  //     },

  //     icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  // </svg>`,
  //   },
])
</script>

<template>
  <div class="">
    <main>
      <!-- Header -->
      <div class="">
        <div class="pb-24 pt-32 lg:pt-64">
          <div
            class="relative z-10 mx-auto max-w-7xl pl-4 pr-8 sm:px-6 lg:px-8"
          >
            <h1
              class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              How can we help you?
            </h1>
            <p class="text-theme-500 mt-6 max-w-2xl text-xl">
              Get in touch with the sales team, receive answers to technical
              questions via support, or join the community chat.
            </p>
          </div>
        </div>
      </div>
      <div class="">
        <!-- Cards -->
        <section
          class="relative z-10 mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading" class="sr-only">
            Contact us
          </h2>
          <div
            class="grid grid-cols-1 gap-y-20 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0"
          >
            <div
              v-for="(channel, i) in channels"
              :key="i"
              class="channel-shadow flex flex-col rounded-2xl bg-white ring ring-black/10"
            >
              <div class="relative flex-1 p-6">
                <div class="text-primary-500 h-6 w-6" v-html="channel.icon" />
                <h3 class="mt-4 text-xl font-bold">
                  {{ channel.title }}
                </h3>
                <p class="text-theme-500 mt-4 text-base">
                  {{ channel.description }}
                </p>
              </div>
              <div
                v-if="channel.button"
                class="mt-6 border-t border-slate-200 p-6 text-left"
              >
                <ElButton
                  btn="slate"
                  :target="channel.button.href ? '_blank' : ''"
                  :href="channel.button.href"
                  :to="channel.button.to"
                >
                  {{ channel.button.text }}
                </ElButton>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section
          class="mx-auto max-w-md divide-y-2 divide-slate-200 px-4 py-24 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8 lg:py-32"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" class="text-3xl font-extrabold">
            Frequently answered questions
          </h2>
          <div class="mt-6 pt-10">
            <dl
              class="space-y-10 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 md:space-y-0"
            >
              <div v-for="(faq, i) in faqs" :key="i">
                <dt class="text-xl font-medium">
                  {{ faq.title }}
                </dt>
                <dd class="text-theme-500 mt-2 text-base">
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

<style lang="less">
.channel-shadow {
  box-shadow: var(--cardShadowSmall);
}
</style>
