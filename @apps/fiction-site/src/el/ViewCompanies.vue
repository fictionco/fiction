<template>
  <div
    class="overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black"
  >
    <div class="lg:relative lg:z-10">
      <div class="mx-auto max-w-7xl px-8 py-16 lg:py-24">
        <h1
          class="pl-6 text-5xl leading-normal font-bold border-l-4 border-primary-500 text-gray-100 lg:text-7xl lg:leading-tight"
        >
          Fiction Companies.
        </h1>
        <p class="mt-6 max-w-3xl text-xl leading-relaxed text-gray-500">
          Since 2017, we have partnered with extraordinary founders reimagining
          the way we live, work, and play. We’ve joined their journeys at the
          earliest stages across industries and geographies.
        </p>
        <p class="mt-6 max-w-3xl text-xl leading-relaxed text-gray-500">
          These are our core businesses, the ones that we own a majority stake
          in. Meet the companies who inspire our work.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-8 py-12 lg:py-18 lg:relative lg:z-10">
      <dl class="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
        <a
          v-for="company in companyList"
          :key="company.title"
          :href="company.link"
          target="_blank"
          class="flex items-center px-4 py-6 rounded-md bg-gray-900 transition-all border-2 border-transparent hover:border-primary-500 hover:shadow-xl"
        >
          <div
            v-if="company"
            class="flex-shrink-0 w-12 text-gray-100"
            v-html="company.icon"
          />
          <div class="ml-4">
            <dt class="text-xl leading-normal font-semibold text-gray-100">
              {{ company.title }}
            </dt>
            <dd class="mt-1 text-base text-gray-500 md:text-lg">
              {{ company.content }}
            </dd>
          </div>
        </a>
      </dl>
    </div>

    <div
      class="mx-auto max-w-5xl py-16 px-4 lg:py-24 text-center lg:relative lg:z-10"
    >
      <h2
        class="mt-4 text-3xl font-bold text-gray-300 md:text-5xl md:leading-tight"
      >
        Think your company belongs here?
      </h2>
      <a
        href="mailto:hello@fiction.com"
        class="mt-12 inline-flex justify-center rounded-md transition-colors border-2 border-primary-500 text-gray-200 hover:bg-primary-500 hover:text-white"
      >
        <ElemButton
          class="px-5 py-3 focus:ring-opacity-0 sm:mt-0 md:px-8 md:py-3 md:text-lg"
        >
          Get in touch
          <ElemHoverArrow size="large" />
        </ElemButton>
      </a>
    </div>

    <ElemCta class="lg:relative lg:z-10" />

    <svg
      class="hidden absolute z-0 max-w-lg h-auto top-20 right-0 text-gray-700 lg:block"
      viewBox="0 0 768 1948"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M768 25.445C328.922 125.873 1.431 517.77 1.431 985.905c0 468.135 327.492 860.035 766.569 960.455v1.03C328.368 1846.94.431 1454.6.431 985.905.431 517.213 328.367 124.866 768 24.419v1.026z"
        fill="currentColor"
      />
      <path
        d="M768 1805.9c-363.092-97.63-630.342-428.95-630.342-822.664 0-393.71 267.25-725.037 630.342-822.663v1.036c-362.533 97.6-629.342 428.473-629.342 821.627 0 393.154 266.809 724.024 629.342 821.624v1.04z"
        fill="currentColor"
      />
      <path
        d="M768 1667.17c-291.152-92.99-501.824-363.97-501.824-683.768 0-319.796 210.672-590.771 501.824-683.759v1.05c-290.594 92.952-500.824 363.476-500.824 682.709 0 319.238 210.23 589.758 500.824 682.718v1.05z"
        fill="currentColor"
      />
      <path
        d="M768 1514.73c-207.948-86.47-354.069-290.75-354.069-528.993 0-238.234 146.121-442.516 354.069-528.985v1.083c-207.384 86.411-353.069 290.234-353.069 527.902 0 237.673 145.685 441.493 353.069 527.903v1.09z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import ElemButton from "@factor/ui/ElemButton.vue"
import { ref } from "vue"

import ElemCta from "./ElemCta.vue"
import ElemHoverArrow from "./ElemHoverArrow.vue"

export default {
  components: {
    ElemButton,
    ElemHoverArrow,
    ElemCta,
  },
  setup() {
    const companyList = ref([
      {
        link: "https://www.darwin.so/?ref=fiction",
        icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.437 23.3043H24.7059C25.7714 23.3043 26.4 22.9009 26.8168 22.3896C27.3538 21.677 27.6385 20.7956 27.6235 19.8922C27.6336 18.8765 27.321 18.0139 26.8605 17.4574C26.4538 16.9739 25.7916 16.5217 24.5378 16.5217H8.40336C7.63361 16.5217 6.97815 16.3026 6.55462 16.1287C6.10798 15.9398 5.67831 15.7105 5.27059 15.4435C4.46042 14.9114 3.70766 14.2911 3.02521 13.593C2.28239 12.8497 1.63098 12.0144 1.08571 11.1061C0.571429 10.2261 0 8.94957 0 7.47826V4H24.5378C28.6386 4 32.5715 5.68571 35.4712 8.68629C38.371 11.6869 40 15.7565 40 20C40 24.2435 38.371 28.3131 35.4712 31.3137C32.5715 34.3143 28.6386 36 24.5378 36H18.8235C16.0403 36 13.916 34.0522 12.7597 32.5983C12.1122 31.7878 11.5698 30.8933 11.1462 29.9374C10.69 28.9451 10.4425 27.8639 10.4202 26.7652L10.437 23.3043ZM5.23025 10.9565C6.3563 12.1391 7.70084 13.0435 8.40336 13.0435H24.5378C33.2773 13.0435 32.9412 26.7826 24.7059 26.7826H13.7815V26.807C13.7849 27.7496 14.3697 29.1061 15.2538 30.2609C16.2118 31.5096 17.5193 32.5217 18.8235 32.5217H24.5378C27.7472 32.5217 30.8251 31.2025 33.0944 28.8542C35.3637 26.5059 36.6387 23.321 36.6387 20C36.6387 16.679 35.3637 13.4941 33.0944 11.1458C30.8251 8.79751 27.7472 7.47826 24.5378 7.47826H3.36134C3.36134 8.55652 4.20168 9.87478 5.23025 10.9565Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.85683 22.3306C5.51901 20.028 4.5375 17.1132 4.5375 14.7828H7.89885C7.89885 16.2785 8.59801 18.5811 9.7375 20.5393C10.2071 21.3845 10.8001 22.1495 11.4955 22.8072C12.1039 23.3463 12.5375 23.4785 12.7728 23.4785V26.9567C11.4148 26.9567 10.2283 26.2611 9.30725 25.4437C8.33824 24.5449 7.5114 23.4944 6.85683 22.3306Z" fill="currentColor" /></svg>`,
        title: "Darwin",
        content: "Conversion analytics.",
      },
      {
        link: "https://factor.dev/?ref=fiction",
        icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 20C3 12.8942 8.76036 7.1339 15.8661 7.1339H23.7739C30.8796 7.1339 36.6399 12.8942 36.6399 20C36.6399 27.1058 30.8796 32.8661 23.7738 32.8661H15.8661C8.76035 32.8661 3 27.1058 3 20ZM15.8661 13.0968C12.0536 13.0968 8.96294 16.1875 8.96294 20C8.96294 23.8125 12.0536 26.9032 15.8661 26.9032H23.7738C27.5863 26.9032 30.6771 23.8125 30.6771 20C30.6771 16.1875 27.5864 13.0968 23.7739 13.0968H15.8661Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.7319 40C17.3445 40 17.0304 39.6859 17.0304 39.2985V0.701524C17.0304 0.314082 17.3445 0 17.7319 0H22.2918C22.6792 0 22.9933 0.314081 22.9933 0.701518V39.2985C22.9933 39.6859 22.6792 40 22.2918 40H17.7319Z" fill="currentColor" /></svg>`,
        title: "Factor",
        content: "A minimal CMS for javascript.",
      },
      {
        //link: "https://www.pagelines.com/?ref=fiction",
        icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1049 23.6943L11.8352 28.4017L16.0731 26.8974L19.8456 40L23.3026 26.8305L27.9529 28.4051L26.4378 23.6868L40 20.178L26.4608 16.6661L27.8981 12.5048L23.3265 13.3435L19.8168 0L16.0442 13.2877L11.8856 12.52L13.086 16.6574L0 20.178L13.1049 23.6943ZM17.132 17.2541L17.7263 19.3023L14.2881 20.1734L17.6765 21.0288L17.2683 22.5423L18.624 22.0611L19.6796 25.9851L20.6663 22.0269L22.1611 22.5331L21.685 21.0501L25.2189 20.1735L21.624 19.2787L22.3091 17.2949L20.6019 17.6081L19.6796 14.1018L18.7024 17.544L17.132 17.2541Z" fill="currentColor" /> </svg>`,
        title: "Photic",
        content: "Real estate.",
      },
    ])

    return { companyList }
  },
  metaInfo(this: any) {
    return {
      title: "Fiction - We buy wonderful internet businesses.",
      description:
        "For over a decade, we've been partnering with founders to give them quick, straightforward exits that protect their team and culture and keep their businesses operating for the longterm.",
    }
  },
}
</script>
