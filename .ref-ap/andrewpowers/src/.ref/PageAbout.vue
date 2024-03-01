<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
import PageWrap from './PageWrap.vue'
</script>

<template>
  <PageWrap>
    <div class="py-10">
      <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="md:flex md:space-x-12">
          <p class="mt-3 text-4xl font-bold sm:text-4xl sm:tracking-tight">
            About
          </p>
          <div
            class="mx-auto my-8 mt-5 space-y-6 text-xl font-medium leading-relaxed"
          >
            <p>
              I live in Southern California and am a founder of several active
              AI companies. Currently,
              <a
                href="https://www.fiction.com"
                class="decoration-theme-300 underline"
              >Fiction.com</a>
              an AI-centered long-form authoring platform, and
              <a
                href="https://www.supereon.ai"
                class="decoration-theme-300 underline"
              >PageLines</a>
              a smart web-experience platform.
            </p>

            <p>
              From Jan 2017 to Jan 2021, I was working on various other startup
              ideas in analytics, AI and marketing tech.
            </p>

            <p>
              During this time, there was a lot of learning and growing. I
              worked hard to master technical aspects of large software
              applications and learned a ton about working with data and AI.
            </p>

            <p>
              Prior to this period, I was working for 9 years on a company I
              founded, PageLines, which sold web tools and frameworks built for
              WordPress. At PageLines, I built the company from zero to 7
              figures in revenue. (Recently, we've transitioned the company to focus on applications of AI in websites)
            </p>
            <p>
              Before starting PageLines, circa 2009, I had finished up my MBA
              from San Diego State, and was working for various companies as a
              marketing consulant building websites and doing SEO.
            </p>
            <p>
              Additionally, I got my masters in Biomedical and Electrical
              Engineering from University of Utah. Here I focused on medical
              imaging technology and research.
            </p>
            <p>What else? Here are some interesting facts about me:</p>
            <ul class="list-outside list-disc space-y-3 pl-6 text-base">
              <li>I live in Laguna Niguel and work in Irvine, California.</li>
              <li>
                I'm married to my wife Antoinete, and I have two children, a boy
                and a girl:
                <span class="italic">Donovan and Nicolette</span>.
              </li>
              <li>
                I've been to 45 countries thanks to my time as a digital nomad.
              </li>
              <li>I drink a ton of ginger tea.</li>
              <li>
                I like all types of music, Lofi is my favorite when working but
                I listen to a ton of progressive trance when running. Outside of
                that, I really love Pink Floyd and Gregory Alan Isakov,
              </li>
              <li>
                I play the guitar, piano, and sing. I took extensive lessons in
                all when i was younger.
              </li>
              <li>
                I grew up in Salt Lake City and spent the first 25 years of my
                life there.
              </li>
              <li>I speak Spanish and English.</li>
            </ul>
            <!-- <p>
              You can also look at a more extensive
              <RouterLink to="/resume" class="decoration-theme-300 underline"
                >resume</RouterLink
              >
              if you're interested.
            </p> -->
          </div>
        </div>
        <SocialLinks />
      </div>
    </div>
    <div class="" />
  </PageWrap>
</template>
