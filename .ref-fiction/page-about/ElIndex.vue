<script lang="ts" setup>
import ContentBox from '@fiction/core/ui/ContentBox.vue'
import { useMeta, vue } from '@factor/api'
import ElBadge from '@fiction/core/ui/ElBadge.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import PageWrap from '../el/PageWrap.vue'
import ElemMap from './ElMap.vue'
import ElemDirections from './ElDirections.vue'

const team = vue.ref([
  {
    email: 'andrew@fiction.com',
    name: 'Andrew Powers',
    title: 'Founder &amp; CEO',
    content: `Andrew is a serial entrepreneur and developer. He's passionate about helping people and a father of two.`,
    social: [
      {
        name: 'Website',
        link: 'https://www.andrewpowers.com',
      },
      {
        name: 'Twitter',
        link: 'https://www.twitter.com/arpowers',
      },
      {
        name: 'Insta',
        link: 'https://www.instagram.com/arpowers',
      },
    ],
  },
])

const metaTitle = 'About Fiction - AI tools for creatives'

const metaDescription
  = 'Fiction is a company creating AI tools for designers and creatives.'

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
</script>

<template>
  <PageWrap class="">
    <div class="relative overflow-visible px-4 py-24">
      <ContentBox wrap-class="z-20 p-8 md:p-16">
        <div class="text-center">
          <h1
            class="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:mb-6 lg:text-5xl xl:text-6xl"
          >
            Bringing Humanity to AI
          </h1>
          <p class="text-theme-500 mb-12 text-2xl lg:mb-20 lg:text-2xl">
            Fiction is creating tools to help
            <span class="text-theme-600">everyone</span> take part in the AI
            revolution.
          </p>
        </div>
        <div class="gap-12 md:grid md:grid-cols-2">
          <div class="relative">
            <div class="">
              <p
                class="mb-3 text-2xl font-extrabold tracking-tight md:text-3xl"
              >
                Your <span class="italic">Personal</span> AI Toolkit
              </p>
              <div class="text-theme-600 space-y-5 text-lg md:text-2xl">
                <p>
                  Fiction is creating the tools to help regular people take part
                  in the AI revolution.
                </p>
                <p>
                  Fiction believes that AI tech must be built intentionally to
                  ensure its effects on society are positive. And we are
                  committed to advancing the field in a way that enhances and
                  improves humanity.
                </p>
                <p>
                  Part of that is making sure anyone can create specialized AI
                  tools, not just the large corporations.
                </p>
                <p>
                  That's why Fiction is focusing on open-source AI (rather than
                  proprietary APIs). It's mission is to enable everyone to have
                  their own personal AI toolkit.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 md:mt-0">
            <div
              v-for="member in team"
              :key="member.name"
              class="group block shrink-0"
            >
              <div class="flex space-x-4">
                <div class="flex min-w-0 space-x-5 md:space-x-8">
                  <div>
                    <ElAvatar
                      class="float-right ml-6 inline-block h-12 w-12 rounded-full md:h-24 md:w-24"
                      :email="member.email"
                    />
                  </div>
                  <div>
                    <p class="text-2xl font-extrabold md:text-3xl">
                      {{ member.name }}
                    </p>
                    <p
                      class="text-theme-700 text-sm font-medium uppercase tracking-wider"
                      v-html="member.title"
                    />
                    <div class="text-theme-500 my-4 text-xl">
                      {{ member.content }}
                    </div>
                    <ul v-if="member.social" class="flex space-x-5">
                      <li v-for="(item, ii) in member.social" :key="ii">
                        <ElBadge
                          :href="item.link"
                          class="text-theme-700 hover:text-theme-800 inline-flex space-x-2"
                          target="_blank"
                        >
                          <span>{{ item.name }} &rarr;</span>
                        </ElBadge>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentBox>

      <ElemDirections />

      <ContentBox class="relative z-10 my-12" wrap-class="p-8 md:p-16">
        <div class="grid gap-12 md:grid-cols-2">
          <div class="">
            <h1 class="m-auto mb-4 text-4xl font-extrabold sm:text-6xl">
              Work With Us
            </h1>
            <p class="text-theme-600 text-2xl sm:max-w-lg">
              Fiction is looking to build a world-class team of talented people.
            </p>
            <div class="mt-6 text-2xl">
              Interested? &rarr;
              <a
                href="mailto:hello@fiction.com"
                class="text-primary-500 hover:text-primary-600"
              >Email Us Your Resume
              </a>
            </div>
          </div>
          <div />
        </div>
      </ContentBox>
      <div class="absolute inset-0 opacity-30">
        <ElemMap container="mapContainer" />
      </div>
    </div>
  </PageWrap>
</template>
