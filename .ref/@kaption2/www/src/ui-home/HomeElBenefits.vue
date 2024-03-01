<script lang="ts" setup>
import { ref } from 'vue'
import GridBg from '../ui/EffectGridBg.vue'

const list = ref([
  {
    title: 'Happy Customers',
    description: '',
    list: [
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M3.2075 1.0135C4.51011 0.865883 5.93914 0.75 7.25 0.75C8.561 0.75 9.99116 0.865906 11.2944 1.01355C12.1916 1.11518 12.8958 1.8258 12.9936 2.72337C13.1347 4.01918 13.25 5.44675 13.25 6.75C13.25 8.05358 13.1347 9.48389 12.9935 10.7813C12.8958 11.6789 12.1916 12.3895 11.2943 12.4902C9.99107 12.6365 8.56096 12.75 7.25 12.75C6.10673 12.75 4.87359 12.6637 3.71281 12.5446L0.75 13.25L1.43668 10.0913C1.32928 8.9885 1.25004 7.82607 1.25004 6.75C1.25004 5.44673 1.36626 4.01915 1.50797 2.72333C1.60611 1.8258 2.31036 1.11517 3.2075 1.0135Z"></path><path d="M13.1327 4.17344C13.2032 5.0386 13.25 5.91954 13.25 6.75C13.25 8.05358 13.1347 9.48389 12.9935 10.7813C12.8958 11.6789 12.1916 12.3895 11.2943 12.4902C9.99107 12.6365 8.56096 12.75 7.25 12.75C6.10673 12.75 4.87359 12.6637 3.71281 12.5446L0.75 13.25L1.43668 10.0913C1.32928 8.9885 1.25004 7.82607 1.25004 6.75C1.25004 5.44673 1.36626 4.01915 1.50797 2.72333C1.60611 1.8258 2.31036 1.11517 3.2075 1.0135C4.51011 0.865883 5.93914 0.75 7.25 0.75C7.53607 0.75 7.82781 0.755519 8.12266 0.765682" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 4.125L8.81818 6C9.67375 3.54232 10.3863 2.46386 12 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Improve Reviews',
        text: 'Collect more high quality reviews from verified customers. Display it on your website with full control.',
      },
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M9.33535 9.10373C10.6073 9.95089 9.74842 11.5848 8.22016 11.5848H2.48108C0.952824 11.5848 0.0939295 9.95089 1.36589 9.10373C2.50682 8.34384 3.877 7.90099 5.35062 7.90099C6.82424 7.90099 8.19443 8.34384 9.33535 9.10373Z" fill="none"></path><path d="M5.35231 5.95071C6.78845 5.95071 7.95266 4.78649 7.95266 3.35036C7.95266 1.91422 6.78845 0.75 5.35231 0.75C3.91617 0.75 2.75195 1.91422 2.75195 3.35036C2.75195 4.78649 3.91617 5.95071 5.35231 5.95071Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.06374 8.42987C7.22643 8.08887 6.31047 7.90099 5.35062 7.90099C3.877 7.90099 2.50682 8.34384 1.36589 9.10373C0.0939295 9.95089 0.952824 11.5848 2.48108 11.5848H5.35062" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M10.75 8.25V13.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.25 10.75H13.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Get More Referrals',
        text: 'Get a standardized structure without it getting in your way. Your app controls all features and all UI.',
      },
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M0.959867 10.2568C1.114 11.6975 2.2727 12.8562 3.71266 13.0167C4.78221 13.1359 5.88037 13.2383 7 13.2383C8.11963 13.2383 9.21779 13.1359 10.2873 13.0167C11.7273 12.8562 12.886 11.6975 13.0401 10.2568C13.1539 9.1933 13.25 8.10144 13.25 6.98828C13.25 5.87512 13.1539 4.78326 13.0401 3.71975C12.886 2.2791 11.7273 1.12039 10.2873 0.95989C9.21779 0.840673 8.11963 0.738281 7 0.738281C5.88037 0.738281 4.78221 0.840674 3.71266 0.95989C2.2727 1.12039 1.114 2.2791 0.959867 3.71975C0.846083 4.78326 0.75 5.87512 0.75 6.98828C0.75 8.10144 0.846084 9.1933 0.959867 10.2568Z" fill=""></path><path d="M4 3.98828V4.98828" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 3.98828V4.98828" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 5.48828V6.73828C7 7.29057 6.55228 7.73828 6 7.73828H5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.28601 10.3021C5.74853 10.7415 6.36209 10.9864 7.00001 10.9864C7.63793 10.9864 8.25149 10.7415 8.71401 10.3021" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.0135 0.929932C10.3844 0.969879 10.7519 1.0127 11.1158 1.05487C12.0753 1.16608 12.8408 1.93117 12.9486 2.89106C12.9892 3.2526 13.0301 3.61773 13.0682 3.98616" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M10.0135 13.0444C10.3844 13.0045 10.7519 12.9617 11.1158 12.9195C12.0753 12.8083 12.8408 12.0432 12.9486 11.0833C12.9892 10.7218 13.0301 10.3566 13.0682 9.9882" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M4 0.929932C3.62915 0.969879 3.26164 1.0127 2.89776 1.05487C1.93827 1.16608 1.17267 1.93117 1.06491 2.89106C1.02432 3.2526 0.983393 3.61773 0.945352 3.98616" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M4 13.0444C3.62915 13.0045 3.26164 12.9617 2.89776 12.9195C1.93827 12.8083 1.17267 12.0432 1.06491 11.0833C1.02432 10.7218 0.983393 10.3566 0.945352 9.9882" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></g></svg>`,
        title: 'Reduce Churn',
        text: 'Visualize the customer life cycle and fix problems. Craft loyalty programs.',
      },
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M3.2075 1.0135C4.51011 0.865883 5.93914 0.75 7.25 0.75C8.561 0.75 9.99116 0.865906 11.2944 1.01355C12.1916 1.11518 12.8958 1.8258 12.9936 2.72337C13.1347 4.01918 13.25 5.44675 13.25 6.75C13.25 8.05358 13.1347 9.48389 12.9935 10.7813C12.8958 11.6789 12.1916 12.3895 11.2943 12.4902C9.99107 12.6365 8.56096 12.75 7.25 12.75C6.10673 12.75 4.87359 12.6637 3.71281 12.5446L0.75 13.25L1.43668 10.0913C1.32928 8.9885 1.25004 7.82607 1.25004 6.75C1.25004 5.44673 1.36626 4.01915 1.50797 2.72333C1.60611 1.8258 2.31036 1.11517 3.2075 1.0135Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M7.24686 7.15856C7.24686 6.7975 7.54051 6.57603 8.05859 6.22986C8.53914 5.90877 8.79262 5.49225 8.67987 4.9254C8.56712 4.35856 8.09875 3.89019 7.5319 3.77744C6.64211 3.60044 5.78577 4.30322 5.78577 5.21044" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.2461 9.60318C7.11334 9.60318 7.00571 9.49555 7.00571 9.36279C7.00571 9.23003 7.11334 9.12241 7.2461 9.12241" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.24613 9.60321C7.37889 9.60321 7.48651 9.49558 7.48651 9.36282C7.48651 9.23006 7.37889 9.12244 7.24613 9.12244" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Gain Customer Insight',
        text: 'All the tools you need to get and analyze user feedback.',
      },
    ],
  },
  {
    title: 'Digital Experience',
    description: '',
    list: [
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846084 9.20502 0.959867 10.2685Z" fill="" stroke="currentColor" stroke-width="1.5"></path><path d="M4.00595 3.60144H5.74425" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.00595 6.27245H7.00001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.4685 7.57935L8.80068 10.0168L6.42903 8.86106L4.88718 10.7709" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Session Replay, Heatmaps',
        text: 'See how users are using your website or app. Visualize their experience.',
      },
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846084 9.20502 0.959867 10.2685Z" fill="" stroke="currentColor" stroke-width="1.5"></path><path d="M4.00595 3.60144H5.74425" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.00595 6.27245H7.00001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.4685 7.57935L8.80068 10.0168L6.42903 8.86106L4.88718 10.7709" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Track Clicks and Scrolls',
        text: 'Track clicks, scrolls, and more to see exactly how users are using your website.',
      },
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846084 9.20502 0.959867 10.2685Z" fill="" stroke="currentColor" stroke-width="1.5"></path><path d="M4.00595 3.60144H5.74425" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.00595 6.27245H7.00001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.4685 7.57935L8.80068 10.0168L6.42903 8.86106L4.88718 10.7709" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Debug Problems',
        text: 'See when and where errors are occurring and tie them to problems in your customer experience.',
      },
      {
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"><path d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846084 9.20502 0.959867 10.2685Z" fill="" stroke="currentColor" stroke-width="1.5"></path><path d="M4.00595 3.60144H5.74425" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.00595 6.27245H7.00001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.4685 7.57935L8.80068 10.0168L6.42903 8.86106L4.88718 10.7709" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
        title: 'Visualize Everything',
        text: 'Use Kaption\'s customizable dashboards to visualize what matters to you. You might not need Google after all.',
      },
    ],
  },
  {
    title: 'Workforce',
    description: '',
    list: [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M3.16 6.278c.052 2.1 1.736 3.937 3.836 3.937v0c2.133 0 3.777-1.808 3.835-3.94a33.017 33.017 0 00-.196-4.443.952.952 0 00-.786-.838A17.226 17.226 0 006.996.75c-.986 0-1.95.085-2.867.242a.942.942 0 00-.774.825 32.246 32.246 0 00-.195 4.461z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.996 10.223v3.027"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.592 13.25H9.4"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.602 1.712h1.644a1 1 0 011 1v.176c0 .936-.304 1.834-.845 2.496-.426.522-.973.864-1.56.985"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.364 1.712h-1.61a1 1 0 00-1 1v.176c0 .936.304 1.834.845 2.496.424.52.967.86 1.551.983"></path></g></svg>`,
        title: 'Recognize Excellence',
        text: 'Use Kaption workforce attribution to recognize team members who are doing great CX.',
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.453 6.903a1.135 1.135 0 01-.904 0l-5.48-2.539a.538.538 0 010-.961L6.548.845a1.135 1.135 0 01.904 0l5.48 2.538a.54.54 0 010 .962l-5.48 2.558z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 7.335l-5.865 2.702a.962.962 0 01-.798 0L.75 7.335"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 10.46l-5.865 2.702a.96.96 0 01-.798 0L.75 10.46"></path></g></svg>`,
        title: 'Visualize Performance',
        text: 'Use team attribution and scorecard metrics to determine which teams are doing the best work.',
      },
    ],
  },
])
</script>

<template>
  <div
    class="relative bg-gradient-to-br from-slate-900 via-black to-slate-900 py-32 text-white"
  >
    <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-bold tracking-tight">
          Understand your online experience
        </h2>
        <p class="text-theme-400 mt-4 text-center text-2xl">
          A few things that Kaption can do for you...
        </p>
      </div>

      <div class="pt-16">
        <h2 class="sr-only">
          Factor will help you launch websites and applications faster.
        </h2>
        <dl class=" ">
          <div
            v-for="(item, i) in list"
            :key="i"
            class="mb-20 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-16"
          >
            <div class="md:col-span-3">
              <h3 class="text-3xl font-extrabold">
                {{ item.title }}
              </h3>
            </div>
            <div
              class="grid grid-cols-1 gap-4 md:col-span-9 md:grid-cols-2 md:gap-8"
            >
              <div
                v-for="(benefit, ii) in item.list"
                :key="ii"
                class="bg-theme-800 rounded p-8 md:flex md:space-x-4"
              >
                <div
                  class="text-theme-600 mb-4 h-8 w-8 shrink-0 overflow-hidden rounded-md"
                  v-html="benefit.icon"
                />
                <div class="grow-0">
                  <dt class="text-xl font-bold leading-6">
                    {{ benefit.title }}
                  </dt>
                  <dd class="text-theme-300 mt-2 text-base">
                    {{ benefit.text }}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
    <GridBg />
  </div>
</template>
