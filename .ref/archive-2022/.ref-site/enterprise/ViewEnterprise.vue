<script lang="ts" setup>
import { storeItem, useMeta } from '@factor/api'
import { onMounted } from 'vue'
import ElButton from '@kaption/ui/ElButton.vue'
import GetDemo from '@kaption/ui/ElGetDemo.vue'

const metaTitle = 'Affiliate Referral Program - Kaption.co'

const metaDescription
  = 'As a Kaption affiliate, you will make a 30% recurring commission for every customer you send our way. Anyone can join.'

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

onMounted(() => {
  storeItem('pageMode', 'dark')
})
</script>

<template>
  <div class="overflow-x-hidden">
    <div class="bg-slate-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
      <div class="mx-auto max-w-7xl lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <div
            class="col-span-12 sm:text-center px-6 lg:px-0 lg:text-left lg:flex lg:items-center"
          >
            <div class="py-12 lg:py-24">
              <h1
                class="text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl"
              >
                <span class="">Give your brand a</span><span
                  class="mt-1 pb-3 bg-clip-text text-transparent bg-gradient-to-b decoration-clone from-primary-100 to-primary-300 sm:pb-5 xl:block"
                >competitive edge</span>
              </h1>
              <div
                class="my-8 text-lg text-white md:text-2xl leading-relaxed max-w-prose space-y-4"
              >
                <div class="block">
                  Kaption.co is designed to help brands drive growth by building
                  smarter, more engaging customer experiences.
                </div>
              </div>
              <div class="mt-10 sm:mt-12">
                <div class="">
                  <div class="mt-3 sm:mt-0">
                    <GetDemo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 md:px-20 lg:px-8 py-12 lg:py-24">
      <div class="my-20 items-center lg:flex-row">
        <h2
          class="max-w-4xl text-3xl font-extrabold tracking-tight lg:text-6xl lg:pr-7"
        >
          <span
            class="mb-2 block bg-clip-text text-transparent bg-gradient-to-r decoration-clone from-primary-200 to-primary-400"
          >Cutting Edge</span>
          Technologies
        </h2>
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="grid 2xl:gap-32 grid-cols-12">
            <div class="col-span-12 2xl:col-span-6">
              <ul class="list-outside my-6 list-disc ml-12 space-y-4">
                <li>
                  <div class="font-bold">
                    Survey Engine
                  </div>
                  <div>
                    Customize your surveys to match your brand. Survey your
                    customers in any and every way you imagine.
                  </div>
                </li>
              </ul>
            </div>
            <div class="col-span-12 2xl:col-span-6 mt-8 2xl:mt-2">
              <blockquote
                class="2xl:absolute sm:max-w-2xl bg-dark-800 rounded-lg shadow-lg"
              >
                <div class="rounded-t-lg px-6 py-8 sm:px-10 sm:pt-10 sm:pb-8">
                  <svg
                    class="svg w-32 text-dark-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 412 166"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        class="svg-text"
                        fill-rule="nonzero"
                        d="M201.79 109.56c6.49 0 10.58-3.37 13.58-7.45v6.61h9.01V53.91h-9.01v21.27c-2.88-3.73-6.97-6.97-13.58-6.97-9.37 0-18.39 7.45-18.39 20.55V89c0 13.11 9.14 20.56 18.39 20.56zm2.17-7.93c-6.13 0-11.42-5.05-11.42-12.62v-.24c0-7.81 5.29-12.62 11.42-12.62s11.54 4.93 11.54 12.62v.24c-.01 7.57-5.41 12.62-11.54 12.62zm31.61-38.7h9.74v-8.65h-9.74v8.65zm.36 45.79h9.13V69.06h-9.13v39.66zm38.34 12.14c7.09 0 12.62-1.68 16.23-5.29 3.37-3.37 5.05-8.29 5.05-15.02V69.06h-9.01v5.89c-3.12-3.61-7.33-6.73-13.94-6.73-9.25 0-18.03 6.85-18.03 18.63v.12c0 11.66 8.65 18.63 18.03 18.63 6.49 0 10.7-3 13.94-7.33v3.12c0 7.93-4.45 12.14-12.5 12.14-5.41 0-9.98-1.56-14.18-4.21l-3.37 6.85c5.16 3.01 11.17 4.69 17.78 4.69zm.72-22.96c-6.25 0-11.3-4.45-11.3-10.94v-.24c0-6.49 4.93-10.82 11.3-10.82 6.25 0 11.66 4.45 11.66 10.94v.12c0 6.38-5.41 10.94-11.66 10.94zm31.73-34.97h9.74v-8.65h-9.74v8.65zm.36 45.79h9.13V69.06h-9.13v39.66zm33.89.72c3.37 0 5.89-.84 8.17-2.04v-7.45c-1.8.84-3.61 1.32-5.65 1.32-3 0-4.81-1.44-4.81-4.93V76.87h10.58v-7.81h-10.58V58.12h-9.13v10.94h-5.05v7.81h5.05v20.91c0 8.66 4.69 11.66 11.42 11.66zm50.48-.72V85.16c0-10.58-5.77-16.71-17.43-16.71-6.49 0-10.82 1.32-15.14 3.25l2.52 7.33c3.61-1.56 6.85-2.52 11.3-2.52 6.25 0 9.74 3 9.74 8.53v.72c-3-.96-6.13-1.56-10.94-1.56-9.25 0-16.11 4.21-16.11 12.98v.12c0 7.93 6.61 12.26 14.18 12.26 6.01 0 10.1-2.52 12.86-5.77v4.93h9.02zm-8.77-14.3c0 4.93-4.57 8.29-10.58 8.29-4.33 0-7.69-2.16-7.69-5.89v-.12c0-3.85 3.37-6.13 9.13-6.13 3.49 0 6.73.6 9.13 1.56v2.29h.01zm19.71 14.3h9.13V53.91h-9.13v54.81z"
                      />
                      <path
                        fill="currentColor"
                        d="M.48.79H164.9v164.42H.48V.79zm31.37 108.53h9.13V71.94l28.97 37.38h7.69V56.68h-9.01V93.1L40.39 56.68h-8.53v52.64h-.01zm61.05 0h9.25V92.37h10.46c11.54 0 21.03-6.13 21.03-17.91v-.12c0-10.58-7.81-17.67-20.07-17.67H92.9v52.65zm9.26-25.24V65.21h10.7c6.97 0 11.3 3.12 11.3 9.37v.12c0 5.53-4.33 9.37-11.3 9.37h-10.7v.01zM9.61 9.93h146.27V156.2H9.61V9.93z"
                      />
                    </g>
                    <title>NP Digital Logo</title>
                  </svg>
                  <div class="relative text-2xl font-medium mt-8">
                    <p class="relative">
                      Affiliate marketing is an excellent opportunity if you
                      truly believe in the product you're selling. Because many
                      times, you can make money from product you'd recommend
                      anyway.
                    </p>
                  </div>
                </div>
                <cite
                  class="relative flex items-center sm:items-start bg-dark-600 rounded-b-lg not-italic py-5 px-6 sm:py-5 sm:pl-12 sm:pr-10 sm:mt-10"
                >
                  <div
                    class="relative rounded-full border-2 border-white sm:absolute sm:top-0 sm:transform sm:-translate-y-1/2"
                  >
                    <img
                      class="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-indigo-300"
                      src="./img/Neil-Patel.webp"
                      alt="Neil Patel Quote"
                    >
                  </div>
                  <span
                    class="relative ml-4 text-dark-300 font-semibold leading-6 sm:ml-24 sm:pl-1 text-base"
                  >
                    <p class="text-white font-semibold sm:inline mr-2">
                      Neil Patel
                    </p>
                    <p class="sm:inline">CEO Neil Patel Digital</p>
                  </span>
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      <div class="my-20 items-center lg:flex-row">
        <h2
          class="max-w-4xl text-3xl font-extrabold tracking-tight lg:text-6xl lg:pr-7"
        >
          <span
            class="mb-2 block bg-clip-text text-transparent bg-gradient-to-r decoration-clone from-primary-200 to-primary-400"
          >Now's the time</span>
          There's never been a better time to get started than today.
        </h2>
        <div class="mt-8 text-lg text-white md:text-2xl md:leading-relaxed">
          <div class="grid grid-cols-12">
            <div class="col-span-12">
              <div>
                Through this program you'll have the opportunity to not only
                earn extra money for you and your family, but you'll also be
                helping your audience do the same.
              </div>
            </div>
            <div class="col-span-12 mt-8">
              <ElButton
                href="https://app.linkmink.com/a/kaption-co/904"
                size="lg"
                class="px-3 sm:px-6 bg-dark-400 border-dark-400 text-white"
              >
                Join The Program &rarr;
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
input[type="range"] {
  @apply rounded-sm;
  -moz-appearance: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    -webkit-appearance: none;
    border: 8px solid #8660fe;
  }
  &::-moz-range-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-ms-thumb {
    @apply h-9 w-9 bg-white cursor-pointer rounded-full appearance-none;
    border: 8px solid #8660fe;
  }
  &::-moz-focus-outer {
    border: 0;
  }
}
</style>
