<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { colorStandard } from '@factor/api'
import LogoTesla from './LogoTesla.svg'
import LogoCostco from './LogoCostco.svg'
import LogoRayBan from './LogoRayBan.svg'
import SurveyPhone from './SurveyPhone.svg'
import DashboardAttribution from './DashboardAttribution.svg'
import DashboardContacts from './DashboardContacts.svg'
import DashboardInbox from './DashboardInbox.svg'
import DashboardTeam from './DashboardTeam.svg'
import DashboardHeatmaps from './DashboardHeatmaps.svg'
import DashboardHeatmapsPhone from './DashboardHeatmapsPhone.svg'
import DashboardAnalytics from './DashboardAnalytics.svg'
import DashboardGlobal from './DashboardGlobal.svg'
import DashboardReplay from './DashboardReplay.svg'
import DashboardConversion from './DashboardConversion.svg'
import DashboardReviews from './DashboardReviews.svg'
import DashboardChat from './DashboardChat.svg'
import DashboardLive from './DashboardLive.svg'
import DashboardSurvey from './DashboardSurvey.svg'
import FigureAspect from './FigureAspect.vue'
import FigureChartBar from './FigureChartBar.vue'
import FigurePhone from './FigurePhone.vue'
import FigureNps from './FigureNps.vue'
import FigureCsat from './FigureCsat.vue'
import ReviewRequestSms from './ReviewRequestSms.vue'
import FeedbackForm from './FeedbackForm.vue'

const props = defineProps({
  featureId: { type: String, default: '' },
  format: { type: String as PropType<'hero' | 'splash'>, default: '' },
})

const dashboardImage = computed(() => {
  if (props.featureId === 'scorecard')
    return DashboardTeam
  else if (props.featureId === 'inbox')
    return DashboardInbox
  else if (props.featureId === 'recognition')
    return DashboardAttribution
  else if (props.featureId === 'contacts')
    return DashboardContacts
  else if (props.featureId === 'heatmaps')
    return DashboardHeatmaps
  else if (props.featureId === 'realtime')
    return DashboardGlobal
  else if (props.featureId === 'replay')
    return DashboardReplay
  else if (props.featureId === 'conversion')
    return DashboardConversion
  else if (props.featureId === 'reviews')
    return DashboardReviews
  else if (props.featureId === 'chat')
    return DashboardChat
  else if (props.featureId === 'live')
    return DashboardLive
  else if (props.featureId === 'surveys')
    return DashboardSurvey
  else
    return DashboardAnalytics
})
</script>

<template>
  <div
    class="stage relative mx-auto max-w-lg"
    :style="{ perspective: `800px` }"
  >
    <div
      v-if="featureId === 'inbox'"
      class="app-adjust-right absolute -bottom-12 -left-12 z-10"
    >
      <div
        class="text-theme-800 w-48 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
      >
        <img
          class="mb-4 w-12"
          :src="LogoTesla"
          alt="Tesla"
        >
        <div class="space-y-2">
          <div class="bg-theme-100 ml-6 rounded-md p-2">
            When can I get a test drive?
          </div>
          <div class="bg-primary-500 mr-6 rounded-md p-2 text-white">
            Let's set an appointment.
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="featureId === 'chat'"
      class="app-adjust-right absolute -bottom-12 -right-12 z-10"
    >
      <div
        class="text-theme-800 w-48 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
      >
        <img
          class="mb-4 w-12"
          :src="LogoTesla"
          alt="Tesla"
        >
        <div class="space-y-2">
          <div class="bg-theme-100 ml-6 rounded-md p-2">
            I have a question...
          </div>
          <div class="mr-6 rounded-md bg-green-500 p-2 text-white">
            We got your message. The team will text you.
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="featureId === 'recognition'"
      class="app-adjust-right absolute -bottom-12 -right-12 z-10"
    >
      <div
        class="text-theme-800 w-48 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
      >
        <img
          class="mb-4 w-12"
          :src="LogoCostco"
          alt="Costco"
        >
        <div class="space-y-2">
          <div class="rounded-md font-bold">
            Jon Smith
          </div>
          <div class="bg-primary-500 mr-6 rounded-md p-2 text-white">
            4.2 Satisfaction Score
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="featureId === 'contacts'"
      class="app-adjust-left absolute -bottom-12 z-10"
    >
      <div
        class="text-theme-800 w-56 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
      >
        <img
          class="mb-4 w-12"
          :src="LogoRayBan"
          alt="RayBan"
        >
        <div class="space-y-2">
          <div class="rounded-md font-bold">
            Emily Braun
          </div>
          <div class="bg-theme-50 flex items-center space-x-2 rounded-md p-2">
            <span class="text-primary-500 text-base font-bold">42</span>
            <span>Page Views</span>
          </div>
          <div class="bg-theme-50 flex items-center space-x-2 rounded-md p-2">
            <span class="text-primary-500 text-base font-bold">3</span>
            <span>Conversion Events</span>
          </div>
          <div class="bg-theme-50 flex items-center space-x-2 rounded-md p-2">
            <span class="text-primary-500 text-base font-bold">14:04</span>
            <span>Minutes on Site</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="featureId === 'conversion'"
      class="app-adjust-left absolute -bottom-12 -left-12 z-10"
    >
      <FigureAspect text="56 Conversions">
        <FigureChartBar :height="75" :timeout="5000" />
      </FigureAspect>
    </div>
    <div
      v-if="featureId === 'realtime'"
      class="app-adjust-left absolute -bottom-12 -left-12 z-10"
    >
      <FigureAspect text="Active Users">
        <FigureChartBar :height="75" :timeout="1000" />
      </FigureAspect>
    </div>
    <div
      v-if="featureId === 'performance'"
      class="app-adjust-right absolute -bottom-12 -right-4 z-10"
    >
      <FigureAspect text="Page Errors Tracked">
        <FigureChartBar
          :height="75"
          :timeout="8000"
          :colors="[
            colorStandard({ color: 'pink', level: 800 }),
            colorStandard({ color: 'slate', level: 300 }),
          ]"
          chart="line"
        />
      </FigureAspect>
    </div>
    <div
      v-if="featureId === 'behavior'"
      class="app-adjust-left absolute -bottom-12 -left-12 z-10"
    >
      <FigureAspect text="Clicks vs Touches">
        <FigureChartBar
          :height="75"
          :timeout="3000"
          chart="line"
        />
      </FigureAspect>
    </div>
    <div
      v-if="featureId === 'heatmaps'"
      class="app-adjust-left absolute -bottom-12 -left-12 z-10"
    >
      <FigurePhone class="w-32 shadow-xl" layout="full">
        <img class="w-full" :src="DashboardHeatmapsPhone">
      </FigurePhone>
    </div>
    <div
      v-if="featureId === 'replay'"
      class="app-adjust-right absolute -bottom-12 -right-12 z-10"
    >
      <FigureAspect text="Recorded Sessions">
        <div class="text-theme-500">
          <div class="mb-3 flex">
            <div
              class="fi fis mr-4 h-6 w-6 shrink-0 rounded-lg fi-us"
            />
            <span class="font-bold">8:32 Min. &rarr;</span>
          </div>
          <div class="flex">
            <div
              class="fi fis mr-4 h-6 w-6 shrink-0 rounded-lg fi-es"
            />
            <span class="font-bold">4:04 Min. &rarr;</span>
          </div>
        </div>
      </FigureAspect>
    </div>
    <div
      v-if="featureId === 'scorecard'"
      class="app-adjust-right absolute -bottom-12 -right-12 z-10"
    >
      <div
        class="text-theme-800 w-48 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
      >
        <img
          class="mb-4 w-12"
          :src="LogoCostco"
          alt="Costco"
        >
        <div class="space-y-2">
          <div class="rounded-md font-bold">
            Denver Store
          </div>
          <div class="mr-6 rounded-md bg-sky-500 p-2 text-white">
            <span class="font-bold">65</span> NPS
          </div>
          <div class="mr-6 rounded-md bg-sky-500 p-2 text-white">
            <span class="font-bold">4.4</span> CSAT
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="featureId === 'reviews'"
      class="app-adjust-right absolute -bottom-16 -right-4 z-10"
    >
      <ReviewRequestSms class="w-36" />
    </div>

    <template v-else-if="featureId === 'home'">
      <FigureNps
        class="nps-figure app-adjust-left absolute -left-10 bottom-12 z-10 shadow-lg md:-left-24"
      />
      <FigureCsat
        class="csat-figure app-adjust-right absolute -bottom-4 -right-10 z-10 md:-right-24"
      />
    </template>

    <template v-else-if="featureId === 'live'">
      <div class="app-adjust-left absolute -bottom-16 -left-4 z-10">
        <div
          class="flex h-48 w-48 max-w-2xl flex-col overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-1 ring-black/10"
        >
          <div class="top relative grow">
            <div
              class="absolute bottom-0 left-1/2 w-[12em] -translate-x-1/2 rounded-t-lg bg-black p-2 text-center text-xs font-bold text-white"
            >
              Give Your Feedback
            </div>
          </div>
          <div class="bottom bg-theme-200 h-16" />
        </div>
      </div>
      <div
        class="app-adjust-right absolute -bottom-16 -right-24 z-10 hidden md:block"
      >
        <FeedbackForm class="w-56" />
      </div>
    </template>

    <div
      v-else-if="featureId === 'surveys'"
      class="app-adjust-right absolute -bottom-12 -right-12 z-10"
    >
      <FigurePhone class="w-36 shadow-xl" layout="email">
        <img class="w-full" :src="SurveyPhone">
      </FigurePhone>
    </div>

    <img
      :alt="`${featureId} Dashboard`"
      class="z-0 mx-auto w-full scale-90 rounded-lg bg-white shadow-lg ring-1 ring-black/10 md:max-w-2xl md:scale-100"
      :src="dashboardImage"
    >
  </div>
</template>

<style lang="less"></style>
