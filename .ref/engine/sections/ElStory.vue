<script lang="ts" setup>
import ElAvatar from '@factor/ui/ElAvatar.vue'
</script>

<template>
  <div class="pl-content-width mx-auto my-20 p-4">
    <div class="grid grid-cols-12 gap-8 md:gap-12">
      <div class="pic col-span-12 md:col-span-4 md:text-right">
        <ElAvatar
          email="arpowers@gmail.com"
          class="inline-block aspect-square w-32 rounded-full border-4 border-white lg:w-56"
          :image-size="800"
        />
      </div>
      <div class="entry col-span-12 md:col-span-7">
        <div
          class="x-font-title text-primary mb-6 text-lg font-bold uppercase"
        >
          About
        </div>
        <div class="text-3xl font-semibold">
          Andrew Powers is a software designer and developer with a passion for
          excellent customer experience.
        </div>
        <p>
          He lives in Southern California and is the founder of several
          companies in the areas of AI, data, and content creation. Currently,
          <a href="https://www.fiction.com">Fiction.com</a>
          a generative AI platform for personal marketing.
        </p>

        <p>
          Prior to Fiction, Andrew founded PageLines, a leader in web tools and
          frameworks built for WordPress. He took the company from a consultancy
          to over 67,000 paying customers.
        </p>
        <!-- <p>Interesting facts:</p>
        <ul class="list-outside list-disc space-y-3 pl-6 text-base">
          <li>I live in Laguna Niguel and work in Irvine, California.</li>
          <li>
            I'm married to my wife Antoinete, and I have two children, a boy and
            a girl:
            <span class="italic">Donovan and Nicolette</span>.
          </li>
          <li>
            I've been to 45 countries thanks to my time as a digital nomad.
          </li>
          <li>I drink a ton of ginger tea.</li>
          <li>
            I like all types of music, Lofi is my favorite when working but I
            listen to a ton of progressive trance when running. Outside of that,
            I really love Pink Floyd and Gregory Alan Isakov,
          </li>
          <li>
            I play the guitar, piano, and sing. I took extensive lessons in all
            when i was younger.
          </li>
          <li>
            I grew up in Salt Lake City and spent the first 25 years of my life
            there.
          </li>
          <li>I speak Spanish and English.</li>
        </ul> -->
      </div>
    </div>
  </div>
</template>
