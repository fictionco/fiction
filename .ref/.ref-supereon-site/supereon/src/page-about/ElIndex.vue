<script lang="ts" setup>
import { unhead, vue } from '@factor/api'
import ElBadge from '@factor/ui/ElBadge.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import PageWrap from '../PageWrap.vue'
import ElemDirections from './ElDirections.vue'

const team = vue.ref([
  {
    email: 'andrew@fiction.com',
    name: 'Andrew Powers',
    title: 'Founder &amp; CEO',
    content: `Andrew is a serial entrepreneur and developer. He's passionate about helping people and a father of two.`,
    social: [
      {
        name: 'AndrewPowers.com',
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

const metaTitle = 'About Supereon'

const metaDescription
  = 'Dedicated to keeping companies on the edge of AI innovation.'

unhead.useHead({
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
    <div class="text-theme-0 relative overflow-visible px-4 py-24">
      <div class="relative z-20 text-center">
        <h1
          class="font-cal mb-4 text-3xl font-extrabold sm:text-4xl md:mb-6 lg:text-5xl xl:text-6xl"
        >
          Your AI Problems Are Solved
        </h1>
        <p class="text-theme-0 mb-12 text-2xl lg:mb-20 lg:text-2xl">
          Supereon is helping the world's
          <span class="text-theme-0">best companies</span> stay ahead of the AI
          curve.
        </p>
      </div>
      <div
        class="bg-theme-0 text-theme-800 z-20 mx-auto max-w-3xl rounded-md p-8 md:p-16"
      >
        <div class="gap-12 md:grid md:grid-cols-1">
          <div class="relative">
            <div class="">
              <p
                class="font-cal mb-8 text-center text-2xl font-extrabold md:text-5xl"
              >
                About Us
              </p>
              <div class="text-theme-600 space-y-5 text-lg md:text-2xl">
                <p>
                  At Supereon, we're passionate about applying AI to business.
                  We believe companies need to move fast to stay ahead of the
                  curve; and that's what we help them do.
                </p>
                <p>
                  We believe that AI is the future of business, and that it can
                  be used to solve some of the world's biggest problems.
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
                <div class="min-w-0 md:flex md:space-x-8">
                  <div>
                    <ElAvatar
                      class="float-right ml-6 inline-block h-12 w-12 rounded-full md:h-24 md:w-24"
                      :email="member.email"
                    />
                  </div>
                  <div>
                    <p class="font-cal text-2xl font-extrabold md:text-3xl">
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
      </div>

      <ElemDirections />

      <div class="text-theme-800 relative z-10 my-12 p-8 md:p-16">
        <div class="grid grid-cols-1 gap-12">
          <div class="text-center">
            <h1 class="font-cal m-auto mb-4 text-4xl md:text-6xl">
              Work With Us
            </h1>
            <p class="text-theme-600 mx-auto text-3xl sm:max-w-lg">
              Supereon is looking to build a world-class team of talented
              people.
            </p>
            <div class="mt-6 flex flex-col space-y-2 text-2xl">
              <span class="font-bold">Interested?</span>
              <span>&darr;</span>
              <a
                href="mailto:hello@supereon.ai"
                class="text-primary-500 hover:text-primary-600 font-bold"
              >Email Us Your Resume
              </a>
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>
  </PageWrap>
</template>
